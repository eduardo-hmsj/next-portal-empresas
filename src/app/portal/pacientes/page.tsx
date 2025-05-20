'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Info from '@/components/Layout/Info';
import Logo from "@/img/logo.png"
import Image from 'next/image';
import { Alert, Button, Modal, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { activatePaciente, getPacientes as getPacientesApi, intativaPaciente, postPaciente, updatePaciente } from './actions';
import { UserContext } from '@/context/UserContext';
import { DataGrid, GridActionsCellItem, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { getPacienteReturn, PacienteInitial, PacientePayload } from './types';
import { aplicarMascaraCpfCnpj, isValidEmail } from '@/utils/functions';
import CreatePaciente from '@/components/Pacientes/CreatePaciente';
import { useRouter } from 'next/navigation';
import CreateIcon from '@mui/icons-material/Create';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import EditPaciente from '@/components/Pacientes/EditPaciente';
import moment from 'moment';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ShowCalcModal from '@/components/Pacientes/ShowCalcModal';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60%",
    bgcolor: 'background.paper',
    border: '1px solid #c3c3c3',
    boxShadow: 24,
    p: 4,
};


export default function Pacientes() {
    const { empresa, user } = React.useContext(UserContext)
    const [pacientes, setPacientes] = React.useState<getPacienteReturn[]>([])
    const [form, setForm] = React.useState<PacientePayload>(PacienteInitial)
    const [warnings, setWarnings] = React.useState<string[]>([])
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState("")
    const [formOpen, setFormOpen] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const route = useRouter()
    const [showCalcModal, setShowCalcModal] = React.useState<null | getPacienteReturn>(null)
    const fileRef = React.useRef<HTMLInputElement>(null);
    const [files, setFiles] = React.useState<PacientePayload[]>([]);
    const [importSuccess, setImportSuccess] = React.useState<PacientePayload[]>([])
    const [importFail, setImportFail] = React.useState<PacientePayload[]>([])
    const [openLogs, setOpenLogs] = React.useState(false)

    function uploadFile(evt: React.ChangeEvent<HTMLInputElement>) {
        setImportFail([])
        setImportSuccess([])
        const file = evt.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const text = e.target?.result;
            if (typeof text !== 'string') return;

            const lines = text.split('\n').filter(Boolean);
            const [headerLine, ...rows] = lines;
            const headers = headerLine.trim().split(',');

            const newFiles: PacientePayload[] = rows.map(row => {
                const values = row.trim().split(',');

                const paciente: PacientePayload = {
                    idUsuarioCadastro: user?.idUsuario || '',
                    idEmpresa: empresa?.idEmpresa || '',
                    nomeCompleto: values[headers.indexOf('nomeCompleto')],
                    cpf: values[headers.indexOf('cpf')],
                    dataNascimento: values[headers.indexOf('dataNascimento')] || null,
                    telefone: values[headers.indexOf('telefone')],
                    email: values[headers.indexOf('email')],
                };

                return paciente;
            });

            setFiles(newFiles);
        };

        reader.readAsText(file);
    }

    function cleanAdvises() {
        setWarnings([])
        setError("")
        setSuccess("")
    }

    async function inative(id: string) {
        cleanAdvises()
        setLoading(true)
        const response = await intativaPaciente({
            idPaciente: id,
            idUsuarioCadastro: user?.idUsuario || "",
            idEmpresa: empresa?.idEmpresa || ""
        })
        if (response.Codigo === "OK") {
            getPacientes()
            setSuccess("Paciente inativado com sucesso.")
        } else {
            setError("Falha ao inaativar paciente.")
        }
        setLoading(false)
    }

    async function active(id: string) {
        cleanAdvises()
        setLoading(true)
        const response = await activatePaciente({
            idPaciente: id,
            idUsuarioCadastro: user?.idUsuario || "",
            idEmpresa: empresa?.idEmpresa || ""
        })
        if (response.Codigo === "OK") {
            getPacientes()
            setSuccess("Paciente ativado com sucesso.")
        } else {
            setError("Falha ao ativar paciente.")
        }
        setLoading(false)
    }

    function editUser(uid: string) {
        cleanAdvises()
        const u = [...pacientes].find(v => v.idPaciente === uid)
        if (u) {
            setFormOpen("edit")
            setForm({
                ...form,
                idPaciente: u.idPaciente,
                cpf: u.cpf,
                dataNascimento: moment(new Date(u.dataNascimento)).format("DD/MM/YYYY"),
                email: u.email,
                nomeCompleto: u.nomeCompleto,
                telefone: u.telefone,
                idUsuarioCadastro: user?.idUsuario || "",
                idEmpresa: empresa?.idEmpresa || ""
            })
        }
    }

    const getPacientes = React.useCallback(async () => {
        setLoading(true)
        const u = await getPacientesApi({ idEmpresa: empresa?.idEmpresa })
        setPacientes(u)
        setLoading(false)
    }, [empresa?.idEmpresa]);

    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
        setLoading(true)
        evt.preventDefault()
        cleanAdvises()
        const e: string[] = []
        if (form.nomeCompleto === PacienteInitial.nomeCompleto) e.push('Nome necessita estar preenchido!')
        if (form.cpf === PacienteInitial.cpf) e.push('CPF necessita estar preenchido!')
        if (form.dataNascimento === PacienteInitial.dataNascimento) e.push('Data de Nascimento necessita estar preenchido!')
        if (form.email === PacienteInitial.email) e.push('E-mail necessita estar preenchido!')
        if (form.telefone === PacienteInitial.telefone) e.push('Telefone necessita estar preenchido!')
        if (!isValidEmail(form.email)) e.push('E-mail inválido!')

        if (e.length > 0) {
            setWarnings(e)
        } else {
            const response = await updatePaciente(form)
            if (response.Codigo === "OK") {
                getPacientes()
                setSuccess(response.Mensagem)
            } else {
                setError(response.Mensagem)
            }
        }

        setLoading(false)
    }

    React.useEffect(() => {
        if (!!empresa?.idEmpresa) {
            getPacientes()
        }

        setFormOpen("")
        setForm({
            ...PacienteInitial,
            idUsuarioCadastro: user?.idUsuario || "",
            idEmpresa: empresa?.idEmpresa || ""
        })

    }, [empresa, user, getPacientes, route])

    const columns: GridColDef<(getPacienteReturn[])[number]>[] = [
        { field: 'idPaciente', headerName: 'ID', width: 50, sortComparator: (v1, v2) => Number(v1) - Number(v2) },
        {
            field: 'nomeCompleto',
            headerName: 'Nome Completo',
            width: 170,
        },
        {
            field: 'cpf',
            headerName: 'CPF',
            width: 80,
            valueGetter: (value, row) => `${aplicarMascaraCpfCnpj(row.cpf)}`,
        },
        {
            field: 'email',
            headerName: 'E-mail',
            width: 200,
        },
        {
            field: 'dataNascimento',
            headerName: 'Data de Nascimento',
            width: 170,
            renderCell(params) {
                return moment(new Date(params.row.dataNascimento)).format("DD/MM/YYYY")
            },
        },
        {
            field: 'telefone',
            headerName: 'Telefone',
            width: 150,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell(params) {
                return params.row.status === "A" ? "Ativo" : "Inativo"
            },
        },
        {
            field: 'actions',
            type: 'actions',
            width: 160,
            getActions: (params) => [
                <>
                    {params.row.status === "A" ?
                        <GridActionsCellItem
                            icon={<PersonOffIcon />}
                            color="error"
                            label="Inativar"
                            onClick={() => inative(params.id.toString())}
                        />
                        :
                        <GridActionsCellItem
                            icon={<RecordVoiceOverIcon />}
                            color="success"
                            label="Ativar"
                            onClick={() => active(params.id.toString())}
                        />}
                </>,
                <>
                    {empresa?.tpUsuario !== "ADMINISTRATIVO" && <GridActionsCellItem
                        key={"showCalc"}
                        icon={<ChecklistIcon />}
                        label="showCalc"
                        color={'info'}
                        onClick={() => setShowCalcModal(params.row)}
                    />}
                </>,
                <GridActionsCellItem
                    key={"edit"}
                    icon={<CreateIcon />}
                    label="Edit"
                    onClick={() => editUser(params.id.toString())}
                />,
            ],
        },
    ];

    const importFiles = React.useCallback(async () => {
        setLoading(true)
        const s: PacientePayload[] = []
        const f: PacientePayload[] = []

        for (const v of files) {
            try {
                const response = await postPaciente(v)
                console.log(response)
                if (response.Codigo === "OK") s.push(v)
                else f.push(v)
            } catch (error) {
                console.log(error)
                f.push(v)
            }
        }

        console.log(s)
        console.log(f)
        setImportSuccess(s)
        setImportFail(f)
        setFiles([])
        setLoading(false)
    }, [files, setFiles, setImportFail, setImportSuccess])


    console.log(files)
    console.log(importFail)
    console.log(importSuccess)

    return (<Grid container sx={{ height: { xs: '100%', sm: '100%' } }}>
        <Grid
            size={{ xs: 12, sm: 5, lg: 4 }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.paper',
                borderRight: { sm: 'none', md: '1px solid' },
                borderColor: { sm: 'none', md: 'divider' },
                alignItems: 'start',
                pt: 16,
                px: { xs: 2, md: 10 },
                gap: 4,
                maxHeight: "100vh",
                overflowY: 'auto',
            }}
        >
            <Image src={Logo} alt='Logo Grupo Santa Joana Negócios' style={{ width: "100%", height: "auto" }} priority />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    width: '100%',
                    maxWidth: 500,
                }}
            >
                <Info
                    subtitle='Cadastre os pacientes no qual serão feito o calculo de nível de risco.'
                    title='Cadastro de Pacientes'
                />
            </Box>
        </Grid>
        <Grid
            size={{ sm: 12, md: 7, lg: 8 }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '100%',
                maxHeight: "100vh",
                backgroundColor: { xs: 'transparent', sm: 'background.default' },
                alignItems: 'start',
                overflowY: 'auto',
                pt: { xs: 6, sm: 10 },
                pb: { xs: 6, sm: 16 },
                px: { xs: 2, sm: 10 },
                gap: { xs: 4, md: 4 },
            }}
        >
            {!loading ? <>
                {formOpen === "create" && <CreatePaciente
                    setLoading={setLoading}
                    setError={setError}
                    setSuccess={setSuccess}
                    setWarnings={setWarnings}
                    getPacientes={getPacientes}
                    oldForm={form}
                    setOldFOrm={setForm}
                />}
                {formOpen === "edit" && <EditPaciente
                    form={form}
                    setForm={setForm}
                    validateForm={validateForm}
                />}
                <Box sx={{ width: "100%" }}>
                    {warnings.map((v, i) => <Alert key={i} severity="warning" sx={{ width: "100%", mt: 1 }}>{v}</Alert>)}
                    {!!error && <Alert severity="error" sx={{ width: "100%", mt: 1 }}>{error}</Alert>}
                    {!!success && <Alert severity="success" sx={{ width: "100%", mt: 1 }}>{success}</Alert>}
                </Box>
                <Box sx={{ width: "100%", mb: 3 }}>
                    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant='h4'>Pacientes Cadastrados</Typography>
                        <Button type='button' color='info' variant="contained" onClick={() => {
                            cleanAdvises()
                            setForm(PacienteInitial)
                            setFormOpen(formOpen === "" ? "create" : "")
                        }}>
                            {formOpen ? "Fechar Formulário" : "Cadastrar Paciente"}
                        </Button>
                    </Grid>
                    <DataGrid
                        rows={pacientes}
                        columns={columns}
                        getRowId={(row) => row.idPaciente}
                        slots={{ toolbar: GridToolbar }}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'nomeCompleto', sort: 'asc' }],
                            },
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                    />
                    <Grid container mt={5} spacing={2}>
                        <Grid size={6}>
                            <Button variant='contained' color='success' startIcon={<InsertDriveFileIcon />} fullWidth href='/files/exemploImportPaciente.csv' target='_blank' download> Baixar exemplo de arquivo</Button>
                        </Grid>
                        <Grid size={6}>
                            <Button variant='contained' fullWidth startIcon={<AttachFileIcon />} onClick={() => fileRef.current?.click()}>Importar usuários por csv</Button>
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileRef}
                                style={{ display: 'none' }}
                                onChange={uploadFile}
                            />
                        </Grid>
                        {(importSuccess.length > 0 || importFail.length > 0) && <Grid size={12}>
                            <Button variant='contained' color='warning' fullWidth onClick={() => setOpenLogs(true)}>Verificar logs da importação</Button>
                        </Grid>}
                    </Grid>
                </Box>
            </>
                : <Skeleton animation='wave' sx={{ height: "100vh", width: "100%" }} />}
        </Grid>
        {!!showCalcModal && <ShowCalcModal user={showCalcModal} close={() => setShowCalcModal(null)} />}
        <Modal
            open={!loading && files.length > 0}
            onClose={() => setFiles([])}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Importar pacientes
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Foram encontrados {files.length} pacientes em seu documento. Deseja importar todos?
                </Typography>

                <TableContainer component={Paper} sx={{ my: 5 }}>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome Completo</TableCell>
                                <TableCell>CPF</TableCell>
                                <TableCell>E-mail</TableCell>
                                <TableCell>Data de nascimento</TableCell>
                                <TableCell>Telefone</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map((row, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        {row.nomeCompleto}
                                    </TableCell>
                                    <TableCell>{aplicarMascaraCpfCnpj(row.cpf)}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{moment(new Date(row?.dataNascimento || "")).format("DD/MM/YYYY")}</TableCell>
                                    <TableCell>{row.telefone}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Button variant='contained' color='error' fullWidth onClick={() => setFiles([])}>Sair sem importar</Button>
                    </Grid>
                    <Grid size={6}>
                        <Button variant='contained' color='success' fullWidth onClick={importFiles}>Importar todos</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
        <Modal
            open={openLogs}
            onClose={() => setOpenLogs(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Logs de importação.
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Foram encontrados {importSuccess.length} pacientes cadastrados com sucesso e {importFail.length} pacientes cadastrados com sucesso em seu documento.
                </Typography>

                <Typography id="modal-modal-title" variant="h6" component="h2" mt={5}>
                    Importados com sucesso
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 5 }}>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome Completo</TableCell>
                                <TableCell>CPF</TableCell>
                                <TableCell>E-mail</TableCell>
                                <TableCell>Data de nascimento</TableCell>
                                <TableCell>Telefone</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {importSuccess.map((row, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        {row.nomeCompleto}
                                    </TableCell>
                                    <TableCell>{aplicarMascaraCpfCnpj(row.cpf)}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{moment(new Date(row?.dataNascimento || "")).format("DD/MM/YYYY")}</TableCell>
                                    <TableCell>{row.telefone}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography id="modal-modal-title" variant="h6" component="h2" mt={5}>
                    Importados com falha
                </Typography>
                <TableContainer component={Paper} sx={{ my: 5 }}>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome Completo</TableCell>
                                <TableCell>CPF</TableCell>
                                <TableCell>E-mail</TableCell>
                                <TableCell>Data de nascimento</TableCell>
                                <TableCell>Telefone</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {importFail.map((row, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        {row.nomeCompleto}
                                    </TableCell>
                                    <TableCell>{aplicarMascaraCpfCnpj(row.cpf)}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{moment(new Date(row?.dataNascimento || "")).format("DD/MM/YYYY")}</TableCell>
                                    <TableCell>{row.telefone}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    </Grid>);
}

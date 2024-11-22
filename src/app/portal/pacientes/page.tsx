'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Info from '@/components/Layout/Info';
import Logo from "@/img/logo.png"
import Image from 'next/image';
import { Alert, Button, Skeleton } from '@mui/material';
// import { activatePaciente, getPacientes, intativaPaciente, updatePaciente } from './actions';
import { UserContext } from '@/context/UserContext';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { getPacienteReturn, PacienteInitial, PacientePayload } from './types';
import { aplicarMascaraCpfCnpj, isValidEmail } from '@/utils/functions';
import CreatePaciente from '@/components/Pacientes/CreatePaciente';
import { useRouter } from 'next/navigation';
import CreateIcon from '@mui/icons-material/Create';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import EditPaciente from '@/components/Pacientes/EditPaciente';
import moment from 'moment';


export default function Pacientes() {
    const { empresa, user } = React.useContext(UserContext)
    const [pacientes, setPacientes] = React.useState<getPacienteReturn[]>([])
    const [form, setForm] = React.useState<PacientePayload>(PacienteInitial)
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [warnings, setWarnings] = React.useState<string[]>([])
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState("")
    const [formOpen, setFormOpen] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const route = useRouter()

    function cleanAdvises() {
        setWarnings([])
        setError("")
        setSuccess("")
    }

    async function inative(id: string) {
        cleanAdvises()
        setLoading(true)
        // const response = await intativaPaciente({
        //     idEmpresa: empresa?.idEmpresa || "",
        //     idPaciente: id,
        //     idPacienteCadastro: user?.idPaciente || ""
        // })
        // if (response.Codigo === "OK") {
        //     getpacientes()
        //     setSuccess("Usuário inativado com sucesso.")
        // }else{
        //     setError("Falha ao inaativar usuário.")
        // }
        setLoading(false)
    }

    async function active(id: string) {
        cleanAdvises()
        setLoading(true)
        // const response = await activatePaciente({
        //     idEmpresa: empresa?.idEmpresa || "",
        //     idPaciente: id,
        //     idPacienteCadastro: user?.idPaciente || ""
        // })
        // if (response.Codigo === "OK") {
        //     getpacientes()
        //     setSuccess("Usuário ativado com sucesso.")
        // }else{
        //     setError("Falha ao ativar usuário.")
        // }
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
                dataNascimento: moment(new Date(u.dataNascimento)).format("DD/MM/YYYY")
            })
        }
    }

    const getPacientes = React.useCallback(async () => {
        setLoading(true)
        // const u = await getPacientesApi({ idEmpresa: empresa?.idEmpresa })
        // setPacientes(u)
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

        if (e.length > 0) {
            setWarnings(e)
        } else {
            // const response = await updatePaciente(form)
            // if (response.Codigo === "OK") {
            //     getpacientes()
            //     setSuccess(response.Mensagem)
            // } else {
            //     setError(response.Mensagem)
            // }
        }

        setLoading(false)
    }

    React.useEffect(() => {
        if (!!empresa?.idEmpresa) {
            getPacientes()
        }

        setForm((prevForm) => ({
            ...prevForm,
            idUsuarioCadastro: user?.idUsuario || "",
            idEmpresa: empresa?.idEmpresa || ""
        }))

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
                <GridActionsCellItem
                    key={"edit"}
                    icon={<CreateIcon />}
                    label="Edit"
                    onClick={() => editUser(params.id.toString())}
                />,
            ],
        },
    ];


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
                            setFormOpen(formOpen === "" ? "create" : "")
                        }}>
                            {formOpen ? "Fechar Formulário" : "Cadastrar Paciente"}
                        </Button>
                    </Grid>
                    <DataGrid
                        rows={pacientes}
                        columns={columns}
                        getRowId={(row) => row.idPaciente}
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
                </Box>
            </>
                : <Skeleton animation='wave' sx={{ height: "100vh", width: "100%" }} />}
        </Grid>
    </Grid>);
}

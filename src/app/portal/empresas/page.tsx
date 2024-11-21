'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Info from '@/components/Layout/Info';
import Logo from "@/img/logo.png"
import Image from 'next/image';
import { Alert, Button, Skeleton } from '@mui/material';
import { activateEmpresa, intativaEmpresa, updateEmpresa } from './actions';
import { UserContext } from '@/context/UserContext';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { getEmpresaReturn, EmpresaInitial, EmpresaPayload } from './types';
import { aplicarMascaraCpfCnpj, aplicarMascaraTelefone } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import CreateIcon from '@mui/icons-material/Create';
import CreateEmpresa from '@/components/Empresas/CreateEmpresa';
import EditEmpresa from '@/components/Empresas/EditEmpresa';
import { getEmpresas as getEmpresasApi } from './actions';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import DomainDisabledIcon from '@mui/icons-material/DomainDisabled';


export default function Empresas() {
    const { empresa, user } = React.useContext(UserContext)
    const [users, setUsers] = React.useState<getEmpresaReturn[]>([])
    const [form, setForm] = React.useState<EmpresaPayload>(EmpresaInitial)
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
        const response = await intativaEmpresa({
            idEmpresa: id,
            idUsuarioCadastro: user?.idUsuario || ""
        })
        if (response.Codigo === "OK") {
            getEmpresas()
            setSuccess("Empresa inativada com sucesso.")
        } else {
            setError("Falha ao inativar empresa.")
        }
        setLoading(false)
    }

    async function active(id: string) {
        cleanAdvises()
        setLoading(true)
        const response = await activateEmpresa({
            idEmpresa: id,
            idUsuarioCadastro: user?.idUsuario || ""
        })
        if (response.Codigo === "OK") {
            getEmpresas()
            setSuccess("Empresa ativada com sucesso.")
        } else {
            setError("Falha ao ativar empresa.")
        }
        setLoading(false)
    }

    function editEmpresa(uid: string) {
        cleanAdvises()
        const u = [...users].find(v => v.idEmpresa === uid)
        if (u) {
            setFormOpen("edit")
            setForm({
                ...form,
                cnpj: aplicarMascaraCpfCnpj(u.cnpj),
                emailSuporte: u.emailSuporte,
                endereco: u.endereco,
                nomeContato: u.nomeContato,
                nomeEmpresa: u.nomeEmpresa,
                telefone: aplicarMascaraTelefone(u.telefone),
                idEmpresa: u.idEmpresa
            })
        }
    }

    const getEmpresas = React.useCallback(async () => {
        setLoading(true);
        const u = await getEmpresasApi({ idEmpresa: empresa?.idEmpresa });
        setUsers(u);
        setLoading(false);
    }, [empresa?.idEmpresa]);

    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
        setLoading(true)
        evt.preventDefault()
        cleanAdvises()
        const e: string[] = []
        if (form.nomeEmpresa === EmpresaInitial.nomeEmpresa) e.push('Nome da empresa necessita estar preenchido!')
        if (form.cnpj === EmpresaInitial.cnpj) e.push('CNPJ necessita estar preenchido!')
        if (form.telefone === EmpresaInitial.telefone) e.push('Telefone necessita estar preenchido!')
        if (form.nomeContato === EmpresaInitial.nomeContato) e.push('Nome do contato necessita estar preenchido!')
        if (form.endereco === EmpresaInitial.endereco) e.push('Endereço necessita estar preenchido!')
        if (form.emailSuporte === EmpresaInitial.emailSuporte) e.push('E-mail do suporte necessita estar preenchido!')

        if (e.length > 0) {
            setWarnings(e)
        } else {
            const response = await updateEmpresa(form)
            if (response.Codigo === "OK") {
                getEmpresas()
                setSuccess(response.Mensagem)
            } else {
                setError(response.Mensagem)
            }
        }

        setLoading(false)
    }

    React.useEffect(() => {
        if (!!empresa?.idEmpresa) {
            getEmpresas()
        }

        if (!!user?.idUsuario && !(empresa?.tpUsuario === "MASTER" || empresa?.tpUsuario === "ADMINISTRATIVO")) {
            route.push("/portal/calculadora")
        }

        setForm((prevForm) => ({
            ...prevForm,
            idUsuarioCadastro: user?.idUsuario || "",
            idEmpresaPai: empresa?.idEmpresa || "",
        }));

    }, [empresa, user, route, getEmpresas])

    const columns: GridColDef<(getEmpresaReturn[])[number]>[] = [
        { field: 'idEmpresa', headerName: 'ID', width: 50, sortComparator: (v1, v2) => Number(v1) - Number(v2) },
        {
            field: 'nomeEmpresa',
            headerName: 'Nome da Empresa',
            width: 170,
        },
        {
            field: 'cnpj',
            headerName: 'CNPJ',
            width: 210,
            valueGetter: (value, row) => `${aplicarMascaraCpfCnpj(row.cnpj)}`,

        },
        {
            field: 'emailSuporte',
            headerName: 'E-mail',
            width: 250,
        },
        {
            field: 'nomeContato',
            headerName: 'Nome do Contato',
            width: 150,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 160,
            getActions: (params) => [
                <>
                    {params.row.status === "A" ?
                        <GridActionsCellItem
                            icon={<DomainDisabledIcon />}
                            color="error"
                            label="Inativar"
                            onClick={() => inative(params.id.toString())}
                        />
                        :
                        <GridActionsCellItem
                            icon={<CorporateFareIcon />}
                            color="success"
                            label="Ativar"
                            onClick={() => active(params.id.toString())}
                        />}
                </>,
                <GridActionsCellItem
                    key={"edit"}
                    icon={<CreateIcon />}
                    label="Edit"
                    onClick={() => editEmpresa(params.id.toString())}
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
                    subtitle='Cadastre as empresas que terão acesso ao calculo de nível de risco.'
                    title='Cadastro de empresas'
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
                {formOpen === "create" && <CreateEmpresa
                    setLoading={setLoading}
                    getEmpresas={getEmpresas}
                    setError={setError}
                    setSuccess={setSuccess}
                    setWarnings={setWarnings}
                />}
                {formOpen === "edit" && <EditEmpresa
                    confirmPassword={confirmPassword}
                    form={form}
                    setConfirmPassword={setConfirmPassword}
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
                        <Typography variant='h4'>Empresas Cadastradas</Typography>
                        <Button type='button' color='info' variant="contained" onClick={() => {
                            cleanAdvises()
                            setFormOpen(formOpen === "" ? "create" : "")
                        }}>
                            {formOpen ? "Fechar Formulário" : "Cadastrar Empresa"}
                        </Button>
                    </Grid>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        getRowId={(row) => row.idEmpresa}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'nomeEmpresa', sort: 'asc' }]
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

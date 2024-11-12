'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Info from '@/components/Layout/Info';
import Logo from "@/img/logo.png"
import Image from 'next/image';
import { Button } from '@mui/material';
import { getUsuarios, postUsuario } from './actions';
import { UserContext } from '@/context/UserContext';
import { DataGrid } from '@mui/x-data-grid';
import { columns, getUsuarioReturn, usuarioInitial, usuarioPayload } from './types';
import { isValidEmail } from '@/utils/functions';
import CreateUsuario from '@/components/Usuarios/CreateUsuario';
import { useRouter } from 'next/navigation';


export default function Usuarios() {
    const { empresa, user } = React.useContext(UserContext)
    const [users, setUsers] = React.useState<getUsuarioReturn[]>([])
    const [form, setForm] = React.useState<usuarioPayload>(usuarioInitial)
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [warnings, setWarnings] = React.useState<string[]>([])
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState("")
    const [formOpen, setFormOpen] = React.useState(false)
    const route = useRouter()

    async function getUsers() {
        const u = await getUsuarios({ idEmpresa: empresa?.idEmpresa })
        setUsers(u)
    }

    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()
        setWarnings([])
        setError("")
        setSuccess("")
        const e: string[] = []
        if (form.nomeCompleto === usuarioInitial.nomeCompleto) e.push('Nome necessita estar preenchido!')
        if (form.senha === usuarioInitial.senha) e.push('Senha necessita estar preenchida!')
        if (form.cpf === usuarioInitial.cpf) e.push('CPF necessita estar preenchido!')
        if (!isValidEmail(form.email)) e.push('E-mail inválido!')
        if (form.tipoUsuario === usuarioInitial.tipoUsuario) e.push('Tipo do usuário necessita estar preenchido!')
        if (form.email === usuarioInitial.email) e.push('E-mail necessita estar preenchido!')
        if (form.senha !== confirmPassword) e.push('Senhas não conferem!')

        if (e.length > 0) {
            setWarnings(e)
        } else {
            const response = await postUsuario(form)
            if (response.Codigo === "OK") {
                getUsers()
                setForm({
                    ...usuarioInitial,
                    idUsuarioCadastro: user?.idUsuario || "",
                    idEmpresa: empresa?.idEmpresa || ""
                })
                setConfirmPassword("")
                setSuccess(response.Mensagem)
            } else {
                setError(response.Mensagem)
            }

            console.log(response)
        }
    }

    React.useEffect(() => {
        if (!!empresa?.idEmpresa) {
            getUsers()
        }

        if (!!user?.idUsuario && !(empresa?.tpUsuario === "MASTER" || empresa?.tpUsuario === "ADMINISTRATIVO")) {
            route.push("/portal/calculadora")
        }

        setForm({
            ...form,
            idUsuarioCadastro: user?.idUsuario || "",
            idEmpresa: empresa?.idEmpresa || ""
        })

    }, [empresa, user])

    return (<Grid container sx={{ height: { xs: '100%', sm: '100dvh' } }}>
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
            <Image src={Logo} alt='Logo Grupo Santa Joana Negócios' />
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
                    title='Cadastro de Usuários'
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
                pt: { xs: 6, sm: 16 },
                pb: { xs: 6, sm: 16 },
                px: { xs: 2, sm: 10 },
                gap: { xs: 4, md: 8 },
            }}
        >
            {formOpen && <CreateUsuario
                confirmPassword={confirmPassword}
                error={error}
                warnings={warnings}
                form={form}
                setForm={setForm}
                setConfirmPassword={setConfirmPassword}
                success={success}
                validateForm={validateForm}
            />}
            <Box sx={{ width: "100%", mb: 3 }}>
                <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant='h4'>Usuários Cadastrados</Typography>
                    <Button type='button' color='info' variant="contained" onClick={() => setFormOpen(!formOpen)}>
                        {formOpen ? "Fechar Formulário" : "Cadastrar Usuário"}
                    </Button>
                </Grid>
                <DataGrid
                    rows={users}
                    columns={columns}
                    getRowId={(row) => row.idUsuario}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </Box>
        </Grid>
    </Grid>);
}

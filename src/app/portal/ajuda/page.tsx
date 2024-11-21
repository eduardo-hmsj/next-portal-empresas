'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Info from '@/components/Layout/Info';
import Logo from "@/img/logo.png"
import Image from 'next/image';
import { Alert, Button, Skeleton, TextField } from '@mui/material';
import { UserContext } from '@/context/UserContext';
import { AjudaInitial, AjudaPayload } from './types';
import { postAjuda } from './actions';


export default function Ajuda() {
    const { user, empresa } = React.useContext(UserContext)
    const [form, setForm] = React.useState<AjudaPayload>(AjudaInitial)
    const [loading, setLoading] = React.useState(false)
    const [warnings, setWarnings] = React.useState<string[]>([])
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState("")

    function cleanAdvises() {
        setWarnings([])
        setError("")
        setSuccess("")
    }

    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
        cleanAdvises()
        setLoading(true)
        evt.preventDefault()
        const e: string[] = []

        if (e.length > 0) {
            setWarnings(e)
        } else {
            const response = await postAjuda(form)
            if (response.Codigo === "OK") {
                setForm(AjudaInitial)
                setSuccess(response.Mensagem)
            } else {
                setError(response.Mensagem || "Houve um erro ao realizar seu cadastro. Em instantes, tente novamente.")
            }

        }

        setLoading(false)
    }

    React.useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            idUsuario: user?.idUsuario || "",
            idEmpresa: empresa?.idEmpresa || "",
        }));
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
            <Image src={Logo} alt='Logo Grupo Santa Joana Negócios' style={{ width: "100%", height: "auto" }} priority/>
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
                    subtitle='Está com dúvidas sobre a utilização do sistema ou seus resultados? Preencha o formulário ao lado e receba a ajuda desejada diretamente em seu e-mail.'
                    title='Central de Ajuda'
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
        >{!loading ? <>
            <Box component={"form"} onSubmit={validateForm}>
                <Typography sx={{ mb: 2 }} variant='h4'>Criar solicitação</Typography>
                <input name='idUsuarioCadastro' value={form.idUsuario} hidden readOnly/>
                <input name='idEmpresa' value={form.idEmpresa} hidden readOnly/>

                <Grid container spacing={2} size={12}>
                    <Grid size={12}>
                        <TextField
                            id="assunto"
                            name='assunto'
                            label="Assunto"
                            fullWidth
                            value={form.assunto}
                            onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            name='mensagem'
                            label="Mensagem"
                            multiline
                            rows={5}
                            fullWidth
                            value={form.mensagem}
                            onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                        />
                    </Grid>

                    <Button variant="contained" type='submit'>Criar Solicitação</Button>
                </Grid>
            </Box>
            <Box sx={{ width: "100%" }}>
                {warnings.map((v, i) => <Alert key={i} severity="warning" sx={{ width: "100%", mt: 1 }}>{v}</Alert>)}
                {!!error && <Alert severity="error" sx={{ width: "100%", mt: 1 }}>{error}</Alert>}
                {!!success && <Alert severity="success" sx={{ width: "100%", mt: 1 }}>{success}</Alert>}
            </Box>
        </>
            : <Skeleton animation='wave' sx={{ height: "100vh", width: "100%" }} />}
        </Grid>
    </Grid>);
}

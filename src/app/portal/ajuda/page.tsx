'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Info from '@/components/Layout/Info';
import Logo from "@/img/logo.png"
import Image from 'next/image';
import { Button, TextField } from '@mui/material';
import { UserContext } from '@/context/UserContext';


export default function Calculadora() {
    const { user, empresa } = React.useContext(UserContext)
    const [result, setResult] = React.useState(false)

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
            <Image src={Logo} alt='Logo Grupo Santa Joana Negócios' style={{width: "100%", height: "auto"}}/>
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
        >
            {result ? <>
                <Typography variant='h4'>Solicitação cadastrada com sucesso</Typography>
            </>
                : <>
                    <div style={{ width: "100%" }}>
                        <Typography sx={{ mb: 2 }} variant='h4'>Criar solicitação</Typography>
                        <input name='idUsuarioCadastro' value={user?.idUsuario} hidden />
                        <input name='idEmpresa' value={empresa?.idEmpresa} hidden />

                        <Grid container spacing={2} size={12}>
                            <Grid size={12}>
                                <TextField
                                    id="assunto"
                                    name='assunto'
                                    label="Assunto"
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Mensagem"
                                    multiline
                                    rows={5}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </div>
                </>}
            <Button onClick={() => setResult(!result)} variant="contained">{result ? "Cadastrar nova Solicitação" : "Criar Solicitação"}</Button>
        </Grid>
    </Grid>);
}

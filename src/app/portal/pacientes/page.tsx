'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Info from '@/components/Layout/Info';
import Logo from "@/img/logo.png"
import Image from 'next/image';
import { Button, TextField } from '@mui/material';
import InputMask from 'react-input-mask';
import { DatePicker } from '@mui/x-date-pickers';


export default function Calculadora() {
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
                    subtitle='Cadastre os pacientes no qual serão feito o calculo de nível de risco.'
                    title='Cadastro de pacientes'
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
            {result ?<>
                <Typography variant='h4'>Paciente cadastrado com sucesso</Typography>
            </> 
            :<>
                <div style={{ width: "100%" }}>
                    <Typography sx={{ mb: 2 }} variant='h4'>Dados Pessoais</Typography>
                    <input name='idUsuarioCadastro'  hidden />
                    <input name='idEmpresa'  hidden />
                    <Grid container spacing={2} size={12}>
                        <Grid size={6}>
                            <TextField
                                id="nomeCompleto"
                                name='nomeCompleto'
                                label="Nome Completo"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                id="email"
                                name='email'
                                label="E-mail"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={4}>
                            <InputMask
                                mask="999.999.999-99"
                            >
                                {/* @ts-expect-error Utilizando plugin externo para máscara de Login */}
                                {(
                                    inputProps: React.InputHTMLAttributes<HTMLInputElement>
                                ) => (
                                    <TextField
                                        id="cpf"
                                        type="text"
                                        name="cpf"
                                        label="CPF"
                                        fullWidth

                                        inputProps={{
                                            ...inputProps,
                                            'aria-label': 'cpf',
                                        }}
                                    />
                                )}
                            </InputMask>
                        </Grid>
                        <Grid size={4}>
                            <DatePicker
                                sx={{ width: "100%" }}
                                label="Data de Nascimento"
                                name='dataNascimento'
                            />
                        </Grid>
                        <Grid size={4}>
                            <InputMask
                                mask="(99) 99999-9999"
                            >
                                {/* @ts-expect-error Utilizando plugin externo para máscara de Login */}
                                {(
                                    inputProps: React.InputHTMLAttributes<HTMLInputElement>
                                ) => (
                                    <TextField
                                        id="telefone"
                                        type="text"
                                        name="telefone"
                                        label="Telefone"
                                        fullWidth

                                        inputProps={{
                                            ...inputProps,
                                            'aria-label': 'telefone',
                                        }}
                                    />
                                )}
                            </InputMask>
                        </Grid>
                    </Grid>
                </div>
            </>}
            <Button onClick={() => setResult(!result)} variant="contained">{result ? "Cadastrar novo paciente" : "Cadastrar Paciente"}</Button>
        </Grid>
    </Grid>);
}

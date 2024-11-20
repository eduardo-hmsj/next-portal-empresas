'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';
import InputMask from 'react-input-mask';
import { EmpresaPayload } from '@/app/portal/empresas/types';

export default function EditEmpresa(props: {
    validateForm: (e: React.FormEvent<HTMLFormElement>) => void
    form: EmpresaPayload,
    setForm: (f: EmpresaPayload) => void,
    confirmPassword: string,
    setConfirmPassword: (e: string) => void
}) {

    console.log(props.form)
    return <Box sx={{ width: "100%" }} component={"form"} onSubmit={props.validateForm}>
        <input name='idUsuarioCadastro' value={props.form.idUsuarioCadastro} hidden readOnly />
        <input name='idEmpresa' value={props.form.idEmpresa} hidden readOnly />
        <input name='idEmpresaPai' value={props.form.idEmpresaPai} hidden readOnly />
        <Typography sx={{ mb: 2 }} variant='h4'>Editar Empresa</Typography>
        <Grid container spacing={2} size={12}>
            <Grid container spacing={2} size={12}>
                <Grid size={8}>
                    <TextField
                        id="nomeEmpresa"
                        name='nomeEmpresa'
                        label="Nome da empresa"
                        value={props.form.nomeEmpresa}
                        fullWidth
                        onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                    />
                </Grid>
                <Grid size={4}>
                    <InputMask
                        mask="99.999.999/9999-99"
                        name="cnpj"
                        value={props.form.cnpj}
                        onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                    >
                        {/* @ts-expect-error Utilizando plugin externo para máscara de Login */}
                        {(
                            inputProps: React.InputHTMLAttributes<HTMLInputElement>
                        ) => (
                            <TextField
                                id="cnpj"
                                type="text"
                                label="Cnpj"
                                fullWidth
                                inputProps={{
                                    ...inputProps,
                                    'aria-label': 'cnpj',
                                }}
                            />
                        )}
                    </InputMask>
                </Grid>
                <Grid size={6}>
                    <InputMask
                        mask="(99) 99999-9999"
                        name="telefone"
                        value={props.form.telefone}
                        onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                    >
                        {/* @ts-expect-error Utilizando plugin externo para máscara de Login */}
                        {(
                            inputProps: React.InputHTMLAttributes<HTMLInputElement>
                        ) => (
                            <TextField
                                id="telefone"
                                type="text"
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
                <Grid size={6}>
                    <TextField
                        id="nomeContato"
                        name='nomeContato'
                        label="Nome do contato"
                        value={props.form.nomeContato}
                        onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid size={6}>
                    <TextField
                        id="endereco"
                        name='endereco'
                        label="Endereço"
                        value={props.form.endereco}
                        onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid size={6}>
                    <TextField
                        id="emailSuporte"
                        name='emailSuporte'
                        label="E-mail do Suporte"
                        value={props.form.emailSuporte}
                        onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Button type='submit' variant="contained">Salvar</Button>
        </Grid>
    </Box>
}
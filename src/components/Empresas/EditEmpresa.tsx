'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';
import { EmpresaPayload } from '@/app/portal/empresas/types';
import { CNPJMask, TelefoneMask } from '@/utils/functions';

export default function EditEmpresa(props: {
    validateForm: (e: React.FormEvent<HTMLFormElement>) => void
    form: EmpresaPayload,
    setForm: (f: EmpresaPayload) => void,
    confirmPassword: string,
    setConfirmPassword: (e: string) => void
}) {
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
                    <Grid size={4}>
                        <TextField
                            id="cnpj"
                            type="text"
                            name="cnpj"
                            label="Cnpj"
                            fullWidth
                            variant="outlined"
                            color="primary"
                            value={props.form.cnpj}
                            onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                            InputProps={{
                                inputComponent: CNPJMask,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid size={6}>
                    <Grid size={4}>
                        <TextField
                            id="telefone"
                            type="text"
                            label="Telefone"
                            fullWidth
                            variant="outlined"
                            name="telefone"
                            color="primary"
                            value={props.form.telefone}
                            onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                            InputProps={{
                                inputComponent: TelefoneMask,
                            }}
                        />
                    </Grid>
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
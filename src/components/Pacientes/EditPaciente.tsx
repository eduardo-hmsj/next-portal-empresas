'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';
import { CPFMask, TelefoneMask } from '@/utils/functions';
import { DatePicker } from '@mui/x-date-pickers';
import { PacientePayload } from '@/app/portal/pacientes/types';
import moment, { Moment } from 'moment';

export default function EditUsuario(props: {
    validateForm: (e: React.FormEvent<HTMLFormElement>) => void
    form: PacientePayload,
    setForm: (f: PacientePayload) => void
}) {
    const handleDateChange = (date: Moment | null) => {
        if (date) {
            const formattedDate = date.format("DD/MM/YYYY"); // Formatar como string
            props.setForm({ ...props.form, dataNascimento: formattedDate });
        } else {
            props.setForm({ ...props.form, dataNascimento: null });
        }
    };

    return <Box sx={{ width: "100%" }} component={"form"} onSubmit={props.validateForm}>
        <input name='idUsuarioCadastro' value={props.form.idUsuarioCadastro} hidden readOnly />
        <input name='idEmpresa' value={props.form.idEmpresa} hidden readOnly />
        <Typography sx={{ mb: 2 }} variant='h4'>Editar Paciente</Typography>
        <Grid container spacing={2} size={12}>
            <Grid size={6}>
                <TextField
                    id="nomeCompleto"
                    name='nomeCompleto'
                    label="Nome Completo"
                    fullWidth
                    value={props.form.nomeCompleto}
                    onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                />
            </Grid>
            <Grid size={6}>
                <TextField
                    id="email"
                    name='email'
                    label="E-mail"
                    fullWidth
                    value={props.form.email}
                    onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                />
            </Grid>
            <Grid size={4}>
                <TextField
                    id="cpf"
                    name='cpf'
                    label="CPF"
                    fullWidth
                    InputProps={{
                        inputComponent: CPFMask,
                    }}
                    value={props.form.cpf}
                    onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                />
            </Grid>
            <Grid size={4}>
                <DatePicker
                    sx={{ width: "100%" }}
                    label="Data de Nascimento"
                    name='dataNascimento'
                    value={props.form.dataNascimento ? moment(props.form.dataNascimento, "DD/MM/YYYY") : null}
                    onChange={handleDateChange}
                />
            </Grid>
            <Grid size={4}>
                <TextField
                    id="telefone"
                    name='telefone'
                    label="Telefone"
                    fullWidth
                    InputProps={{
                        inputComponent: TelefoneMask,
                    }}
                    value={props.form.telefone}
                    onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                />
            </Grid>
            <Button type='submit' variant="contained">Salvar</Button>
        </Grid>
    </Box>
}
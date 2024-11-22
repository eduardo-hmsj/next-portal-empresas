'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { usuarioPayload } from '@/app/portal/usuarios/types';
import { UserContext } from '@/context/UserContext';
import { CPFMask } from '@/utils/functions';

export default function EditUsuario(props: {
    validateForm: (e: React.FormEvent<HTMLFormElement>) => void
    form: usuarioPayload,
    setForm: (f: usuarioPayload) => void,
    confirmPassword: string,
    setConfirmPassword: (e: string) => void
}) {
    const {empresa} = React.useContext(UserContext)

    return <Box sx={{ width: "100%" }} component={"form"} onSubmit={props.validateForm}>
        <input name='idUsuarioCadastro' value={props.form.idUsuarioCadastro} hidden readOnly />
        <input name='idEmpresa' value={props.form.idEmpresa} hidden readOnly />
        <Typography sx={{ mb: 2 }} variant='h4'>Editar Usuário</Typography>
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
                    type="text"
                    name="cpf"
                    label="CPF"
                    placeholder="xxx.xxx.xxx-xx"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    value={props.form.cpf}
                    onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                    InputProps={{
                        inputComponent: CPFMask,
                    }}
                />
            </Grid>
            <Grid size={4}>
                <TextField
                    id="conselho"
                    name='conselho'
                    label="Conselho"
                    value={props.form.conselho}
                    onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                    fullWidth
                />
            </Grid>
            <Grid size={4}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Tipo de Usuário</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Tipo de Usuário"
                        value={props.form.tipoUsuario}
                        name="tipoUsuario"
                        onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                    >
                        <MenuItem value="">Selecione uma opção</MenuItem>
                        <MenuItem value={"MEDICO"}>Médico</MenuItem>
                        <MenuItem value={"ADMINISTRATIVO"}>Administrativo</MenuItem>
                        <MenuItem value={"ENFERMEIRO"}>Enfermeiro</MenuItem>
                        {empresa?.tpUsuario === "MASTER" && <MenuItem value={"MASTER"}>Master</MenuItem>}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={6}>
                <TextField
                    id="senha"
                    name='senha'
                    label="Senha"
                    type='password'
                    fullWidth
                    value={props.form.senha}
                    onChange={e => props.setForm({ ...props.form, [e.target.name]: e.target.value })}
                />
            </Grid>
            <Grid size={6}>
                <TextField
                    id="confirmarSenha"
                    name='confirmarSenha'
                    label="Confirmar Senha"
                    fullWidth
                    type='password'
                    onChange={e => props.setConfirmPassword(e.target.value)}
                    value={props.confirmPassword}
                />
            </Grid>
            <Button type='submit' variant="contained">Salvar</Button>
        </Grid>
    </Box>
}
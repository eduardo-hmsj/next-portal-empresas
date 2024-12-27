'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';
import { PacienteInitial, PacientePayload } from '@/app/portal/pacientes/types';
import { UserContext } from '@/context/UserContext';
import { CPFMask, isValidEmail, TelefoneMask } from '@/utils/functions';
// import { postPaciente } from '@/app/portal/pacientes/actions';
import { DatePicker } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import { postPaciente } from '@/app/portal/pacientes/actions';

export default function CreatePaciente(props: {
    getPacientes: () => void,
    setLoading: (b: boolean) => void,
    setWarnings: (sa: string[]) => void,
    setError: (sa: string) => void,
    setSuccess: (sa: string) => void,
    oldForm: PacientePayload,
    setOldFOrm: (of: PacientePayload) => void
}) {
    const { empresa, user } = React.useContext(UserContext)
    const [form, setForm] = React.useState<PacientePayload>(props.oldForm)

    const handleDateChange = (date: Moment | null) => {
        if (date) {
            const formattedDate = date.format("DD/MM/YYYY"); // Formatar como string
            setForm({ ...form, dataNascimento: formattedDate });
        } else {
            setForm({ ...form, dataNascimento: null });
        }
    };


    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
        props.setLoading(true)
        evt.preventDefault()
        props.setOldFOrm(form)
        props.setWarnings([])
        props.setError("")
        props.setSuccess("")
        const e: string[] = []
        if (form.nomeCompleto === PacienteInitial.nomeCompleto) e.push('Nome necessita estar preenchido!')
        if (form.cpf === PacienteInitial.cpf) e.push('CPF necessita estar preenchido!')
        if (form.dataNascimento === PacienteInitial.dataNascimento) e.push('Data de Nascimento necessita estar preenchido!')
        if (form.email === PacienteInitial.email) e.push('E-mail necessita estar preenchido!')
        if (form.telefone === PacienteInitial.telefone) e.push('Telefone necessita estar preenchido!')
        if (!isValidEmail(form.email)) e.push('E-mail inválido!')

        if (e.length > 0) {
            props.setWarnings(e)
        } else {
            const response = await postPaciente(form)
            if (response.Codigo === "OK") {
                props.getPacientes()
                setForm({
                    ...PacienteInitial,
                    idUsuarioCadastro: user?.idUsuario || "",
                    idEmpresa: empresa?.idEmpresa || ""
                })
                props.setOldFOrm(PacienteInitial)
                props.setSuccess(response.Mensagem)
            } else {
                props.setError(response.Mensagem)
            }
        }

        props.setLoading(false)
    }

    React.useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            idUsuarioCadastro: user?.idUsuario || "",
            idEmpresa: empresa?.idEmpresa || ""
        }))
    }, [empresa, user])

    return <Box sx={{ width: "100%" }} component={"form"} onSubmit={validateForm}>
        <input name='idUsuarioCadastro' value={form.idUsuarioCadastro} hidden readOnly />
        <input name='idEmpresa' value={form.idEmpresa} hidden readOnly />
        <Typography sx={{ mb: 2 }} variant='h4'>Cadastrar Paciente</Typography>
        <Grid container spacing={2} size={12}>
            <Grid size={6}>
                <TextField
                    id="nomeCompleto"
                    name='nomeCompleto'
                    label="Nome Completo"
                    fullWidth
                    value={form.nomeCompleto}
                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                />
            </Grid>
            <Grid size={6}>
                <TextField
                    id="email"
                    name='email'
                    label="E-mail"
                    fullWidth
                    value={form.email}
                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
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
                    value={form.cpf}
                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                />
            </Grid>
            <Grid size={4}>
                <DatePicker
                    sx={{ width: "100%" }}
                    label="Data de Nascimento"
                    name='dataNascimento'
                    value={form.dataNascimento ? moment(form.dataNascimento, "DD/MM/YYYY") : null}
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
                    value={form.telefone}
                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                />
            </Grid>
            <Button type='submit' variant="contained">Salvar</Button>
        </Grid>
    </Box>
}
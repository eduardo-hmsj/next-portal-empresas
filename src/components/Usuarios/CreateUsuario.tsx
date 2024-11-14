'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Alert, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import InputMask from 'react-input-mask';
import { usuarioInitial, usuarioPayload } from '@/app/portal/usuarios/types';
import { UserContext } from '@/context/UserContext';
import { isValidEmail } from '@/utils/functions';
import { postUsuario } from '@/app/portal/usuarios/actions';

export default function CreateUsuario(props: {
    getUsers: () => void,
    setLoading: (b: boolean) => void,
    warnings: string[],
    success: string,
    error: string,
    setWarnings: (sa: string[]) => void,
    setError: (sa: string) => void,
    setSuccess: (sa: string) => void,
}) {
    const {empresa, user} = React.useContext(UserContext)
    const [form, setForm] = React.useState<usuarioPayload>(usuarioInitial)
    const [confirmPassword, setConfirmPassword] = React.useState("")

    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
        props.setLoading(true)
        evt.preventDefault()
        props.setWarnings([])
        props.setError("")
        props.setSuccess("")
        const e: string[] = []
        if (form.nomeCompleto === usuarioInitial.nomeCompleto) e.push('Nome necessita estar preenchido!')
        if (form.senha === usuarioInitial.senha) e.push('Senha necessita estar preenchida!')
        if (form.cpf === usuarioInitial.cpf) e.push('CPF necessita estar preenchido!')
        if (!isValidEmail(form.email)) e.push('E-mail inválido!')
        if (form.tipoUsuario === usuarioInitial.tipoUsuario) e.push('Tipo do usuário necessita estar preenchido!')
        if (form.email === usuarioInitial.email) e.push('E-mail necessita estar preenchido!')
        if (form.senha !== confirmPassword) e.push('Senhas não conferem!')

        if (e.length > 0) {
            props.setWarnings(e)
        } else {
            const response = await postUsuario(form)
            if (response.Codigo === "OK") {
                props.getUsers()
                setForm({
                    ...usuarioInitial,
                    idUsuarioCadastro: user?.idUsuario || "",
                    idEmpresa: empresa?.idEmpresa || ""
                })
                setConfirmPassword("")
                props.setSuccess(response.Mensagem)
            } else {
                props.setError(response.Mensagem)
            }

            console.log(response)
        }

        props.setLoading(false)
    }

    React.useEffect(() => {
        setForm({
            ...form,
            idUsuarioCadastro: user?.idUsuario || "",
            idEmpresa: empresa?.idEmpresa || ""
        })
    }, [empresa, user])

    return <Box sx={{ width: "100%" }} component={"form"} onSubmit={validateForm}>
        <input name='idUsuarioCadastro' value={form.idUsuarioCadastro} hidden readOnly />
        <input name='idEmpresa' value={form.idEmpresa} hidden readOnly />
        <Typography sx={{ mb: 2 }} variant='h4'>Cadastrar Usuário</Typography>
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
                <InputMask
                    mask="999.999.999-99"
                    name="cpf"
                    value={form.cpf}
                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                >
                    {/* @ts-expect-error Utilizando plugin externo para máscara de Login */}
                    {(
                        inputProps: React.InputHTMLAttributes<HTMLInputElement>
                    ) => (
                        <TextField
                            id="cpf"
                            type="text"
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
                <TextField
                    id="conselho"
                    name='conselho'
                    label="Conselho"
                    value={form.conselho}
                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
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
                        value={form.tipoUsuario}
                        name="tipoUsuario"
                        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
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
                    value={form.senha}
                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                />
            </Grid>
            <Grid size={6}>
                <TextField
                    id="confirmarSenha"
                    name='confirmarSenha'
                    label="Confirmar Senha"
                    fullWidth
                    type='password'
                    onChange={e => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                />
            </Grid>
            <Button type='submit' variant="contained">Salvar</Button>
            {props.warnings.map((v, i) => <Alert key={i} severity="warning" sx={{ width: "100%", mt: 1 }}>{v}</Alert>)}
            {!!props.error && <Alert severity="error" sx={{ width: "100%", mt: 1 }}>{props.error}</Alert>}
            {!!props.success && <Alert severity="success" sx={{ width: "100%", mt: 1 }}>{props.success}</Alert>}
        </Grid>
    </Box>
}
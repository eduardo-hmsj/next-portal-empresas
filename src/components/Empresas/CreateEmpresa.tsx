'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';
import { EmpresaInitial, EmpresaPayload } from '@/app/portal/empresas/types';
import { UserContext } from '@/context/UserContext';
import { CNPJMask, isValidEmail, TelefoneMask } from '@/utils/functions';
import { postEmpresa } from '@/app/portal/empresas/actions';

export default function CreateEmpresa(props: {
    getEmpresas: () => void,
    setLoading: (b: boolean) => void,
    setWarnings: (sa: string[]) => void,
    setError: (sa: string) => void,
    setSuccess: (sa: string) => void,
    oldForm: EmpresaPayload,
    setOldFOrm: (of: EmpresaPayload) => void

}) {
    const { empresa, user, refreshUser } = React.useContext(UserContext)
    const [form, setForm] = React.useState<EmpresaPayload>(props.oldForm)

    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
        props.setLoading(true)
        evt.preventDefault()
        props.setOldFOrm(form)
        props.setWarnings([])
        props.setError("")
        props.setSuccess("")
        const e: string[] = []


        if (form.nomeEmpresa === EmpresaInitial.nomeEmpresa) e.push('Nome da empresa necessita estar preenchido!')
        if (form.cnpj === EmpresaInitial.cnpj) e.push('CNPJ necessita estar preenchido!')
        if (form.telefone === EmpresaInitial.telefone) e.push('Telefone necessita estar preenchido!')
        if (form.nomeContato === EmpresaInitial.nomeContato) e.push('Nome do contato necessita estar preenchido!')
        if (form.endereco === EmpresaInitial.endereco) e.push('Endereço necessita estar preenchido!')
        if (form.emailSuporte === EmpresaInitial.emailSuporte) e.push('E-mail do suporte necessita estar preenchido!')
        if (!isValidEmail(form.emailSuporte)) e.push('E-mail inválido!')

        if (e.length > 0) {
            props.setWarnings(e)
        } else {
            const response = await postEmpresa(form)
            if (response.Codigo === "OK") {
                props.getEmpresas()
                setForm({
                    ...EmpresaInitial,
                    idUsuarioCadastro: user?.idUsuario || "",
                })
                refreshUser()
                props.setSuccess(response.Mensagem)
            } else {
                props.setError(response.Mensagem || "Houve um erro ao realizar seu cadastro. Em instantes, tente novamente.")
            }
        }

        props.setLoading(false)
    }

    React.useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            idUsuarioCadastro: user?.idUsuario || "",
            idEmpresaPai: empresa?.idEmpresa || "",
        }))
    }, [empresa, user])

    return <Box sx={{ width: "100%" }} component={"form"} onSubmit={validateForm}>
        <input name='idUsuarioCadastro' value={form.idUsuarioCadastro} hidden readOnly />
        <input name='idEmpresa' value={form.idEmpresa} hidden readOnly />
        <input name='idEmpresaPai' value={form.idEmpresaPai} hidden readOnly />
        <Typography sx={{ mb: 2 }} variant='h4'>Cadastrar Empresa</Typography>
        <Grid container spacing={2} size={12}>
            <Grid container spacing={2} size={12}>
                <Grid size={8}>
                    <TextField
                        id="nomeEmpresa"
                        name='nomeEmpresa'
                        label="Nome da empresa"
                        value={form.nomeEmpresa}
                        fullWidth
                        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                    />
                </Grid>
                <Grid size={4}>
                    <TextField
                        id="cnpj"
                        type="text"
                        name="cnpj"
                        label="Cnpj"
                        fullWidth
                        variant="outlined"
                        color="primary"
                        value={form.cnpj}
                        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                        InputProps={{
                            inputComponent: CNPJMask,
                        }}
                    />
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
                            value={form.telefone}
                            onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
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
                        value={form.nomeContato}
                        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid size={6}>
                    <TextField
                        id="endereco"
                        name='endereco'
                        label="Endereço"
                        value={form.endereco}
                        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid size={6}>
                    <TextField
                        id="emailSuporte"
                        name='emailSuporte'
                        label="E-mail do Suporte"
                        value={form.emailSuporte}
                        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Button type='submit' variant="contained">Salvar</Button>
        </Grid>
    </Box>
}
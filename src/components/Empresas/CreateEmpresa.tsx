'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';
import InputMask from 'react-input-mask';
import { EmpresaInitial, EmpresaPayload} from '@/app/portal/empresas/types';
import { UserContext } from '@/context/UserContext';
import { isValidEmail } from '@/utils/functions';
import { postEmpresa } from '@/app/portal/empresas/actions';

export default function CreateEmpresa(props: {
    getUsers: () => void,
    setLoading: (b: boolean) => void,
    setWarnings: (sa: string[]) => void,
    setError: (sa: string) => void,
    setSuccess: (sa: string) => void,
}) {
    const { empresa, user } = React.useContext(UserContext)
    const [form, setForm] = React.useState<EmpresaPayload>(EmpresaInitial)

    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
        props.setLoading(true)
        evt.preventDefault()
        props.setWarnings([])
        props.setError("")
        props.setSuccess("")
        const e: string[] = []

        if (e.length > 0) {
            props.setWarnings(e)
        } else {
            console.log(form)
            const response = await postEmpresa(form)
            if (response.Codigo === "OK") {
                props.getUsers()
                setForm({
                    ...EmpresaInitial,
                    idUsuarioCadastro: user?.idUsuario || "",
                })
                props.setSuccess(response.Mensagem)
            } else {
                props.setError(response.Mensagem || "Houve um erro ao realizar seu cadastro. Em instantes, tente novamente.")
            }

            console.log(response)
        }

        props.setLoading(false)
    }

    React.useEffect(() => {
        setForm({
            ...form,
            idUsuarioCadastro: user?.idUsuario || "",
            idEmpresaPai: empresa?.idEmpresa || "",
        })
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
                    <InputMask
                        mask="99.999.999/9999-99"
                        name="cnpj"
                        value={form.cnpj}
                        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
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
                        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                        value={form.telefone}
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
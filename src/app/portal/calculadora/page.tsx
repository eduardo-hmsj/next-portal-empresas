'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Info from '@/components/Layout/Info';
import Logo from "@/img/logo.png"
import Image from 'next/image';
import { Alert, Button, Checkbox, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup, Skeleton, TextField } from '@mui/material';
import { UserContext } from '@/context/UserContext';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import SearchIcon from '@mui/icons-material/Search';
import { aplicarMascaraCpfCnpj, calcularIdade, CPFMask, isValidEmail, removeCpfMask, TelefoneMask } from '@/utils/functions';
import { condicoesClinicas, condicoesMedicas, historicoObst, initialCalculadoraValue, intercorrenciasClinicas, situacaoFamiliar } from './types';
import moment, { Moment } from 'moment';
import { getCalculosReturn, getPacienteReturn } from '../pacientes/types';
import { getPacientes } from '../pacientes/actions';
import { postCalculadora, getCalculo as getCaluloApi, updateCalculadora } from './actions';
import { useSearchParams, useRouter } from 'next/navigation';



export default function Calculadora() {
    const { user, empresa } = React.useContext(UserContext)
    const [form, setForm] = React.useState<Record<string, string>>(initialCalculadoraValue);
    const [naoDignoDeNotaSF, setNaoDignoDeNotaSF] = React.useState(false);
    const [naoDignoDeNotaHO, setNaoDignoDeNotaHO] = React.useState(false);
    const [naoDignoDeNotaCM, setNaoDignoDeNotaCM] = React.useState(false);
    const [naoDignoDeNotaIC, setNaoDignoDeNotaIC] = React.useState(false);
    const [naoDignoDeNotaCC, setNaoDignoDeNotaCC] = React.useState(false);
    const [paciente, setPaciente] = React.useState<null | getPacienteReturn>(null)
    const [pacienteFetch, setPacienteFetch] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [warnings, setWarnings] = React.useState<string[]>([])
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState("")
    const searchParams = useSearchParams()
    const cpf = searchParams.get('cpf')
    const idCalculo = searchParams.get('idCalculo')
    const mode = searchParams.get('mode')
    const [result, setResult] = React.useState<null | getCalculosReturn>(null)
    const router = useRouter();

    const resetarCalculador = React.useCallback(() => {
        setForm(initialCalculadoraValue)
        setNaoDignoDeNotaSF(false)
        setNaoDignoDeNotaHO(false)
        setNaoDignoDeNotaCM(false)
        setNaoDignoDeNotaIC(false)
        setNaoDignoDeNotaCC(false)
        setPaciente(null)
        setPacienteFetch(false)
        setWarnings([])
        setError("")
        setSuccess("")
        setResult(null)
        router.replace(window.location.pathname);
    }, [router]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const checked = event.target.checked;

        if (type == "sf") {
            setNaoDignoDeNotaSF(checked);

            if (checked) {
                setForm({
                    ...form,
                    ...situacaoFamiliar.reduce((acc, curr) => ({ ...acc, [curr.name]: "N" }), {})
                });
            }
        }

        if (type == "ho") {
            setNaoDignoDeNotaHO(checked);

            if (checked) {
                setForm({
                    ...form,
                    qtAborto: "",
                    qtNatimorto: "",
                    qtPartoPrematuro: "",
                    ...historicoObst.reduce((acc, curr) => ({ ...acc, [curr.name]: "N" }), {})
                });
            }
        }

        if (type == "cm") {
            setNaoDignoDeNotaCM(checked);

            if (checked) {
                setForm({
                    ...form,
                    ...condicoesMedicas.reduce((acc, curr) => ({ ...acc, [curr.name]: "N" }), {})
                });
            }
        }

        if (type == "ic") {
            setNaoDignoDeNotaIC(checked);

            if (checked) {
                setForm({
                    ...form,
                    ...intercorrenciasClinicas.reduce((acc, curr) => ({ ...acc, [curr.name]: "N" }), {})
                });
            }
        }

        if (type == "cc") {
            setNaoDignoDeNotaCC(checked);

            if (checked) {
                setForm({
                    ...form,
                    ...condicoesClinicas.reduce((acc, curr) => ({ ...acc, [curr.name]: "N" }), {})
                });
            }
        }

    };

    const handleRadioChange = (name: string, value: string) => {
        setForm(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    function calcularIMC(alturaCm: number | undefined, pesoKg: number | undefined): number {
        if (!!pesoKg && !!alturaCm) {
            const alturaM = alturaCm / 100;
            const imc = pesoKg / (alturaM * alturaM);
            return parseFloat(imc.toFixed(2));
        }
        return 0
    }

    const handleDateChange = (date: Moment | null, name: string) => {
        if (date) {
            const formattedDate = date.format("DD/MM/YYYY"); // Formatar como string
            setForm({
                ...form,
                [name]: formattedDate,
                idadeGestante: name === "dataNascimento" ? calcularIdade(moment(formattedDate, formattedDate.includes("-") ? "YYYY-MM-DD" : "DD/MM/YYYY").format("DD/MM/YYYY")).toString() : form.idadeGestante
            });
        } else {
            setForm({ ...form, [name]: "" });
        }
    };

    const handleTimeChange = (date: Moment | null) => {
        if (date) {
            const formattedDate = date.format("HH:MM"); // Formatar como string
            setForm({ ...form, "hrCalculo": formattedDate });
        } else {
            setForm({ ...form, "hrCalculo": "" });
        }
    };

    const getPaciente = React.useCallback(async () => {
        if (!form.cpf) return
        setLoading(true)
        const response = await getPacientes({ cpf: removeCpfMask(form.cpf), idEmpresa: empresa?.idEmpresa })
        setPacienteFetch(true)
        if (response.length > 0) {
            setPaciente(response[0])
            const nascimento = new Date(response[0].dataNascimento)
            setForm((prevForm) => ({
                ...prevForm,
                nomeCompleto: response[0].nomeCompleto,
                cpf: aplicarMascaraCpfCnpj(response[0].cpf),
                dataNascimento: nascimento.toLocaleDateString('pt-BR'),
                telefone: response[0].telefone,
                email: response[0].email,
                idPaciente: response[0].idPaciente,
                idadeGestante: calcularIdade(moment(nascimento.toLocaleDateString('pt-BR'), nascimento.toLocaleDateString('pt-BR').includes("-") ? "YYYY-MM-DD" : "DD/MM/YYYY").format("DD/MM/YYYY")).toString()
            }));
        }

        setLoading(false)
    }, [form.cpf, empresa]);

    const getCalculo = React.useCallback(async () => {
        setLoading(true)
        const response = await getCaluloApi({
            idEmpresa: empresa?.idEmpresa || "",
            idCalculo: idCalculo || ""
        })
        setForm({
            ...response,
            dtCalculo: moment(response.dtCalculo, "YYYY-MM-DD").format("DD-MM-YYYY"),
            cpf: aplicarMascaraCpfCnpj(response.cpf),
            dataNascimento: moment(response.dataNascimento, "YYYY-MM-DD").format("DD-MM-YYYY"),
            idadeGestante: calcularIdade(moment(response.dataNascimento, response.dataNascimento.includes("-") ? "YYYY-MM-DD" : "DD/MM/YYYY").format("DD/MM/YYYY")).toString()
        })
        setLoading(false)
    }, [idCalculo, empresa]);

    async function validateForm(evt: React.FormEvent<HTMLFormElement>) {
        setLoading(true)
        evt.preventDefault()
        setWarnings([])
        setError("")
        setSuccess("")
        const e: string[] = []
        if (form.nomeCompleto === initialCalculadoraValue.nomeCompleto) e.push('Nome necessita estar preenchido!')
        if (form.cpf === initialCalculadoraValue.cpf) e.push('CPF necessita estar preenchido!')
        if (form.dataNascimento === initialCalculadoraValue.dataNascimento) e.push('Data de Nascimento necessita estar preenchido!')
        if (form.email === initialCalculadoraValue.email) e.push('E-mail necessita estar preenchido!')
        if (form.telefone === initialCalculadoraValue.telefone) e.push('Telefone necessita estar preenchido!')
        if (form.idadeGestante === initialCalculadoraValue.idadeGestante) e.push('Idade da gestante necessita estar preenchido!')
        if (form.alturaGestante === initialCalculadoraValue.alturaGestante) e.push('Altura da gestante necessita estar preenchido!')
        if (form.pesoKg === initialCalculadoraValue.pesoKg) e.push('Peso da gestante necessita estar preenchido!')
        if (Number(form.IdadeGestacionalSemanas) > 44) e.push('Idade gestacional (semanas) não pode ultrapassar 44!')
        if (Number(form.IdadeGestacionalDias) > 6) e.push('Idade gestacional (dias) não pode ultrapassar 6!')
        if (Number(form.IdadeGestacionalSemanas) < 4) e.push('Idade gestacional (semanas) não pode ser menor que 4!')
        if (mode === 'edit' && !form.dsMotivo) e.push('Motivo da edição necessita estar preenchido!')
        if (!isValidEmail(form.email)) e.push('E-mail inválido!')

        if (e.length > 0) {
            setWarnings(e)
        } else {
            const response = await (mode === 'edit' ? updateCalculadora({ ...form, cpf: removeCpfMask(form.cpf) }) : postCalculadora({ ...form, cpf: removeCpfMask(form.cpf) }))
            if (response.Codigo === "OK") {
                if (Array.isArray(response.Dados) && response.Dados.length > 0) {
                    setResult(response.Dados[0])
                }
                setSuccess(response.Mensagem)
            } else {
                setError(response.Mensagem)
            }
        }

        setLoading(false)
    }


    React.useEffect(() => {
        if (empresa?.tpUsuario === "ADMINISTRATIVO") {
            router.replace("/portal/usuarios");
        }
        

        setForm((prevForm) => {
            if (!!empresa?.idEmpresa && empresa?.idEmpresa !== prevForm.idEmpresa && pacienteFetch) {
                resetarCalculador()
                return {
                    ...initialCalculadoraValue,
                    dtCalculo: moment().format("DD/MM/YYYY"),
                    hrCalculo: moment().format("hh:mm"),
                    idUsuario: user?.idUsuario || "",
                    idEmpresa: empresa?.idEmpresa || "",
                }
            }

            return {
                ...prevForm,
                dtCalculo: moment().format("DD/MM/YYYY"),
                hrCalculo: moment().format("hh:mm"),
                idUsuario: user?.idUsuario || "",
                idEmpresa: empresa?.idEmpresa || "",
            }
        });

        if (mode === 'edit') {
            setForm((prevForm) => ({
                ...prevForm,
                dsMotivo: "",
                idCalculo: idCalculo || ""
            }));
        }

        if (idCalculo) getCalculo()

        if (!!empresa?.idEmpresa && cpf && !pacienteFetch) {
            setForm((prevForm) => ({
                ...prevForm,
                cpf: aplicarMascaraCpfCnpj(cpf)
            }));
            getPaciente()
        }
    }, [cpf, pacienteFetch, getPaciente, idCalculo, user, empresa, mode, getCalculo, router, resetarCalculador])

    React.useEffect(() => {
        if (pacienteFetch && paciente) {
            if (removeCpfMask(form.cpf) !== removeCpfMask(paciente?.cpf || "")) {
                setPacienteFetch(false)
                setPaciente(null)
                setForm((prevForm) => ({
                    ...prevForm,
                    nomeCompleto: "",
                    dataNascimento: "",
                    telefone: "",
                    email: "",
                    idPaciente: "",
                }));
            }
        }
    }, [form.cpf, paciente, pacienteFetch])

    React.useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            imc: calcularIMC(Number(form.alturaGestante), Number(form.pesoKg)).toString()
        }));
    }, [form.alturaGestante, form.pesoKg])

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
            <Image src={Logo} alt='Logo Grupo Santa Joana Negócios' style={{ width: "100%", height: "auto" }} priority />
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
                    subtitle='Por meio de análise precisa de dados clínicos e histórico da gestante, a calculadora identifica os riscos associados à gestação, permitindo intervenções mais assertivas e personalizadas. Caso necessário, o profissional médico poderá solicitar uma interconsulta com nossos especialistas e juntos construir metas terapêuticas para a gestante ou até mesmo encaminhar a paciente para nossos especialistas em alto risco gestacional.'
                    title='Calculadora de Risco Gestacional do Grupo Santa Joana'
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
            {loading ?
                <Skeleton animation='wave' sx={{ height: "100vh", width: "100%" }} />
                : <Box sx={{ width: "100%", gap: 5, display: "flex", flexDirection: "column" }} component={"form"} onSubmit={validateForm}>
                    {!!success && <Alert severity="success" sx={{ width: "100%", mt: 1 }}>{success}</Alert>}
                    {!!error && <Alert severity="error" sx={{ width: "100%", mt: 1 }}>{error}</Alert>}
                    {!!result &&
                        <>
                            <Alert severity='info' sx={{ width: "100%", mt: 1 }}>
                                <Typography sx={{ mb: 1 }} variant='h6'>Seu resultado de risco gestacional foi:</Typography>
                                <Typography><strong>Pontos: </strong>{result.pontos}</Typography>
                                <Typography><strong>Risco: </strong>{result.risco}</Typography>
                            </Alert>
                            <Button fullWidth variant='contained' onClick={resetarCalculador}>Novo Cálculo</Button>
                        </>}
                    <div style={{ width: "100%" }}>
                        <Typography sx={{ mb: 2 }} variant='h4'>Dados Pessoais</Typography>
                        <input name='idUsuario' value={form.idUsuario} hidden readOnly />
                        <input name='idEmpresa' value={form.idEmpresa} hidden readOnly />
                        <Grid container spacing={2} size={12}>
                            <Grid size={4}>
                                <FormControl variant="outlined" sx={{ width: "100%" }}>
                                    <InputLabel htmlFor="outlined-adornment-password">CPF</InputLabel>
                                    <OutlinedInput
                                        id="cpf"
                                        type="text"
                                        name="cpf"
                                        value={form.cpf}
                                        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                        label="CPF"
                                        fullWidth
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={'display the password'}
                                                    edge="end"
                                                    onClick={() => getPaciente()}
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        inputComponent={CPFMask}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={8}>
                                <TextField
                                    id="nomeCompleto"
                                    name='nomeCompleto'
                                    label="Nome Completo"
                                    value={form.nomeCompleto}
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                    fullWidth
                                    disabled={!pacienteFetch || !!paciente?.idPaciente}
                                />
                            </Grid>
                            <Grid size={4}>
                                <TextField
                                    id="email"
                                    name='email'
                                    label="E-mail"
                                    fullWidth
                                    value={form.email}
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                    disabled={!pacienteFetch || !!paciente?.idPaciente}
                                />
                            </Grid>
                            <Grid size={4}>
                                <DatePicker
                                    sx={{ width: "100%" }}
                                    label="Data de Nascimento"
                                    name='dataNascimento'
                                    value={form.dataNascimento ? moment(form.dataNascimento, "DD/MM/YYYY") : null}
                                    onChange={d => handleDateChange(d, 'dataNascimento')}
                                    disabled={!pacienteFetch || !!paciente?.idPaciente}
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
                                    disabled={!pacienteFetch || !!paciente?.idPaciente}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <div style={{ width: "100%" }}>
                        <Typography sx={{ mb: 2 }} variant='h4'>Dados da Gestante</Typography>
                        <Grid container spacing={2} size={12}>
                            <Grid size={4}>
                                <TextField
                                    label="Idade Gestante"
                                    id="idadeGestante"
                                    name='idadeGestante'
                                    type='number'
                                    fullWidth
                                    value={form.idadeGestante}
                                    disabled
                                    aria-readonly
                                    inputProps={{ step: 1, min: 0 }}
                                />
                            </Grid>
                            <Grid size={4}>
                                <TextField
                                    label="Altura Gestante"
                                    id="alturaGestante"
                                    name='alturaGestante'
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                                        },
                                    }}
                                    fullWidth
                                    value={form.alturaGestante}
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                />
                            </Grid>
                            <Grid size={4}>
                                <TextField
                                    label="Peso"
                                    id="pesoKg"
                                    type='number'
                                    value={form.pesoKg}
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                    name='pesoKg'
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                                        },
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={4}>
                                <TextField
                                    label="IMC"
                                    id="imc"
                                    value={Number(form.imc)}
                                    name='imc'
                                    type='number'
                                    fullWidth
                                    disabled
                                    aria-readonly="true"
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                />
                            </Grid>
                            <Grid size={4}>
                                <DatePicker
                                    sx={{ width: "100%" }}
                                    label="Data de Cálculo"
                                    name='dtCalculo'
                                    value={form.dtCalculo ? moment(form.dtCalculo, "DD/MM/YYYY") : null}
                                    onChange={d => handleDateChange(d, 'dtCalculo')}
                                />
                            </Grid>
                            <Grid size={4}>
                                <TimePicker
                                    sx={{ width: "100%" }}
                                    label="Hora de Cálculo"
                                    name='hrCalculo'
                                    value={form.hrCalculo ? moment(form.hrCalculo, "hh:mm") : null}
                                    onChange={handleTimeChange}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Idade Gestacional"
                                    id="IdadeGestacionalSemanas"
                                    name='IdadeGestacionalSemanas'
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start">semanas</InputAdornment>,
                                        },
                                    }}
                                    fullWidth
                                    type='number'
                                    value={form.IdadeGestacionalSemanas}
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                    inputProps={{ step: 1, min: 0, max: 44 }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Idade Gestacional"
                                    id="IdadeGestacionalDias"
                                    name='IdadeGestacionalDias'
                                    type='number'
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start">dias</InputAdornment>,
                                        },
                                    }}
                                    fullWidth
                                    value={form.IdadeGestacionalDias}
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                    inputProps={{ step: 1, min: 0, max: 6 }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <div style={{ width: "100%" }}>
                        <Typography sx={{ mb: 2 }} variant='h4'>Situação Familiar e Social</Typography>
                        <Grid container spacing={2} size={12}>
                            <Grid size={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={naoDignoDeNotaSF}
                                            onChange={e => handleCheckboxChange(e, "sf")}
                                            color="primary"
                                        />
                                    }
                                    label="Nada digno de nota"
                                />
                            </Grid>
                            {situacaoFamiliar.map((v, i) => <Grid size={6} key={i}>
                                <FormControl fullWidth>
                                    <FormLabel>{v.label}</FormLabel>
                                    <RadioGroup
                                        row
                                        name={v.name}
                                        value={form[v.name]}
                                        onChange={(e) => handleRadioChange(v.name, e.target.value)}
                                    >
                                        <FormControlLabel value="S" control={<Radio />} label="Sim" disabled={naoDignoDeNotaSF} />
                                        <FormControlLabel value="N" control={<Radio />} label="Não" disabled={naoDignoDeNotaSF} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>)}
                        </Grid>
                    </div>
                    <div style={{ width: "100%" }}>
                        <Typography sx={{ mb: 2 }} variant='h4'>Antecedentes Obstétricos</Typography>
                        <Grid container spacing={2} size={12}>
                            <Grid size={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={naoDignoDeNotaHO}
                                            onChange={e => handleCheckboxChange(e, "ho")}
                                            color="primary"
                                        />
                                    }
                                    label="Nada digno de nota"
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Qtd Abortos"
                                    id="qtAborto"
                                    value={form.qtAborto}
                                    name='qtAborto'
                                    type='number'
                                    fullWidth
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                    disabled={naoDignoDeNotaHO}
                                    inputProps={{ step: 1, min: 0 }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Qtd Natimorto - Óbito Fetal"
                                    id="qtNatimorto"
                                    value={form.qtNatimorto}
                                    name='qtNatimorto'
                                    type='number'
                                    fullWidth
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                    disabled={naoDignoDeNotaHO}
                                    inputProps={{ step: 1, min: 0 }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Qtd Parto Prematuro"
                                    id="qtPartoPrematuro"
                                    value={form.qtPartoPrematuro}
                                    name='qtPartoPrematuro'
                                    type='number'
                                    fullWidth
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                    disabled={naoDignoDeNotaHO}
                                    inputProps={{ step: 1, min: 0 }}
                                />
                            </Grid>
                            <Grid size={6}></Grid>
                            {historicoObst.map((v, i) => <Grid size={6} key={i}>
                                <FormControl fullWidth>
                                    <FormLabel>{v.label}</FormLabel>
                                    <RadioGroup
                                        row
                                        name={v.name}
                                        value={form[v.name]}
                                        onChange={(e) => handleRadioChange(v.name, e.target.value)}
                                    >
                                        <FormControlLabel value="S" control={<Radio />} label="Sim" disabled={naoDignoDeNotaHO} />
                                        <FormControlLabel value="N" control={<Radio />} label="Não" disabled={naoDignoDeNotaHO} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>)}
                        </Grid>
                    </div>
                    <div style={{ width: "100%" }}>
                        <Typography sx={{ mb: 2 }} variant='h4'>Fatores de risco atuais - Obstétricos e Ginecológicos </Typography>
                        <Grid container spacing={2} size={12}>
                            <Grid size={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={naoDignoDeNotaCM}
                                            onChange={e => handleCheckboxChange(e, "cm")}
                                            color="primary"
                                        />
                                    }
                                    label="Nada digno de nota"
                                />
                            </Grid>
                            {condicoesMedicas.map((v, i) => <Grid size={6} key={i}>
                                <FormControl fullWidth>
                                    <FormLabel>{v.label}</FormLabel>
                                    <RadioGroup
                                        row
                                        name={v.name}
                                        value={form[v.name]}
                                        onChange={(e) => handleRadioChange(v.name, e.target.value)}
                                    >
                                        <FormControlLabel value="S" control={<Radio />} label="Sim" disabled={naoDignoDeNotaCM} />
                                        <FormControlLabel value="N" control={<Radio />} label="Não" disabled={naoDignoDeNotaCM} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>)}
                        </Grid>
                    </div>
                    <div style={{ width: "100%" }}>
                        <Typography sx={{ mb: 2 }} variant='h4'>Condições Clínicas Preexistentes</Typography>
                        <Grid container spacing={2} size={12}>
                            <Grid size={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={naoDignoDeNotaCC}
                                            onChange={e => handleCheckboxChange(e, "cc")}
                                            color="primary"
                                        />
                                    }
                                    label="Nada digno de nota"
                                />
                            </Grid>
                            {condicoesClinicas.map((v, i) => <Grid size={6} key={i}>
                                <FormControl fullWidth>
                                    <FormLabel>{v.label}</FormLabel>
                                    <RadioGroup
                                        row
                                        name={v.name}
                                        value={form[v.name]}
                                        onChange={(e) => handleRadioChange(v.name, e.target.value)}
                                    >
                                        <FormControlLabel value="S" control={<Radio />} label="Sim" disabled={naoDignoDeNotaCC} />
                                        <FormControlLabel value="N" control={<Radio />} label="Não" disabled={naoDignoDeNotaCC} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>)}
                        </Grid>
                    </div>
                    <div style={{ width: "100%" }}>
                        <Typography sx={{ mb: 2 }} variant='h4'>Intercorrências Clínicas</Typography>
                        <Grid container spacing={2} size={12}>
                            <Grid size={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={naoDignoDeNotaIC}
                                            onChange={e => handleCheckboxChange(e, "ic")}
                                            color="primary"
                                        />
                                    }
                                    label="Nada digno de nota"
                                />
                            </Grid>
                            {intercorrenciasClinicas.map((v, i) => <Grid size={6} key={i}>
                                <FormControl fullWidth>
                                    <FormLabel>{v.label}</FormLabel>
                                    <RadioGroup
                                        row
                                        name={v.name}
                                        value={form[v.name]}
                                        onChange={(e) => handleRadioChange(v.name, e.target.value)}
                                    >
                                        <FormControlLabel value="S" control={<Radio />} label="Sim" disabled={naoDignoDeNotaIC} />
                                        <FormControlLabel value="N" control={<Radio />} label="Não" disabled={naoDignoDeNotaIC} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>)}
                        </Grid>
                    </div>
                    {mode === "edit" && <TextField
                        label="Motivo da edição"
                        id="dsMotivo"
                        value={form.dsMotivo}
                        name='dsMotivo'
                        type='string'
                        fullWidth
                        onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                    />}
                    <Button type='submit' variant="contained">{mode === "edit" ? 'Editar Cálculo' : 'Gerar cálculo'}</Button>
                    {warnings.map((v, i) => <Alert key={i} severity="warning" sx={{ width: "100%", mt: 0 }}>{v}</Alert>)}
                </Box>}
        </Grid>
    </Grid>);
}

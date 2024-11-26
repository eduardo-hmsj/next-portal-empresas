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
import { aplicarMascaraCpfCnpj, CPFMask, isValidEmail, removeCpfMask, TelefoneMask } from '@/utils/functions';
import { condicoesMedicas, historicoObst, initialCalculadoraValue, situacaoFamiliar } from './types';
import moment, { Moment } from 'moment';
import { getCalculosReturn, getPacienteReturn } from '../pacientes/types';
import { getPacientes } from '../pacientes/actions';
import { postCalculadora, getCalculo as getCaluloApi } from './actions';
import { useSearchParams } from 'next/navigation';


export default function Calculadora() {
    const { user, empresa } = React.useContext(UserContext)
    const [form, setForm] = React.useState<Record<string, string>>(initialCalculadoraValue);
    const [naoDignoDeNotaSF, setNaoDignoDeNotaSF] = React.useState(false);
    const [naoDignoDeNotaHO, setNaoDignoDeNotaHO] = React.useState(false);
    const [naoDignoDeNotaCM, setNaoDignoDeNotaCM] = React.useState(false);
    const [paciente, setPaciente] = React.useState<null | getPacienteReturn>(null)
    const [pacienteFetch, setPacienteFetch] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [warnings, setWarnings] = React.useState<string[]>([])
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState("")
    const searchParams = useSearchParams()
    const cpf = searchParams.get('cpf')
    const idCalculo = searchParams.get('idCalculo')
    const [result, setResult] = React.useState<null | getCalculosReturn>(null)

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
                    qtAborto: "0",
                    qtNatimorto: "0",
                    qtPartoPrematuro: "0",
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
            setForm({ ...form, [name]: formattedDate });
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
        setLoading(true)
        const response = await getPacientes({ cpf: removeCpfMask(form.cpf) })
        setPaciente(response.length > 0 ? response[0] : null)
        setPacienteFetch(true)
        setLoading(false)
    }, [form.cpf]);

    const getCalculo = React.useCallback(async () => {
        setLoading(true)
        const response = await getCaluloApi({
            idEmpresa: empresa?.idEmpresa || "",
            idCalculo: idCalculo || ""
        })
        setForm({...response, dtCalculo: moment(response.dtCalculo, "YYYY-MM-DD").format("DD-MM-YYYY")})
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
        if (!isValidEmail(form.email)) e.push('E-mail inválido!')

        if (e.length > 0) {
            setWarnings(e)
        } else {
            const response = await postCalculadora({...form, cpf: removeCpfMask(form.cpf)})
            if (response.Codigo === "OK") {
                if(Array.isArray(response.Dados) && response.Dados.length > 0){
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
        setForm((prevForm) => ({
            ...prevForm,
            dtCalculo: moment().format("DD/MM/YYYY"),
            hrCalculo: moment().format("hh:mm"),
            idUsuario: user?.idUsuario || "",
            idEmpresa: empresa?.idEmpresa || "",
        }));

        if(cpf && !pacienteFetch) getPaciente()
    }, [empresa, user, cpf, pacienteFetch, getPaciente])

    React.useEffect(() => {
        if (pacienteFetch && paciente) {
            if (removeCpfMask(form.cpf) !== removeCpfMask(paciente?.cpf || "")) {
                setPacienteFetch(false)
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

    React.useEffect(() => {
        if (paciente) {
            setForm((prevForm) => ({
                ...prevForm,
                nomeCompleto: paciente.nomeCompleto,
                cpf: aplicarMascaraCpfCnpj(paciente.cpf),
                dataNascimento: moment(new Date(paciente.dataNascimento)).format("DD/MM/YYYY"),
                telefone: paciente.telefone,
                email: paciente.email,
                idPaciente: paciente.idPaciente,
            }));
        }
    }, [paciente])

    React.useEffect(() => {
        if(idCalculo) getCalculo()
    }, [idCalculo, getCalculo])

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
                    subtitle='Preencha os campos abaixo para obter uma análise personalizada do seu risco. Essa calculadora foi desenvolvida para fornecer uma estimativa rápida e confiável, ajudando você a tomar decisões informadas. Basta inserir as informações solicitadas e visualizar o resultado imediatamente.'
                    title='Calcule o Seu Nível de Risco com Facilidade'
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
                    {!!result && <Alert severity='info' sx={{ width: "100%", mt: 1 }}>
                        <Typography sx={{ mb: 1 }} variant='h6'>Seu resultado de risco gestacional foi:</Typography>
                        <Typography><strong>Pontos: </strong>{result.pontos}</Typography>
                        <Typography><strong>Risco: </strong>{result.risco}</Typography>
                    </Alert>}
                    <div style={{ width: "100%" }}>
                        <Typography sx={{ mb: 2 }} variant='h4'>Dados Pessoais</Typography>
                        <input name='idUsuario' value={form.idUsuario} hidden readOnly />
                        <input name='idEmpresa' value={form.idEmpresa} hidden readOnly />
                        <Grid container spacing={2} size={12}>
                            <Grid size={4}>
                                <FormControl variant="outlined">
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
                                    value={form.dataNascimento ? moment(form.dataNascimento, "YYYY-MM-YY") : null}
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
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
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
                                    value={form.IdadeGestacionalSemanas}
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Idade Gestacional"
                                    id="IdadeGestacionalDias"
                                    name='IdadeGestacionalDias'
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start">dias</InputAdornment>,
                                        },
                                    }}
                                    fullWidth
                                    value={form.IdadeGestacionalDias}
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
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
                                    label="Não digno de nota"
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
                        <Typography sx={{ mb: 2 }} variant='h4'>Histórico Obstétrico</Typography>
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
                                    label="Não digno de nota"
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Qtd Abortos"
                                    id="qtAborto"
                                    value={Number(form.qtAborto)}
                                    name='qtAborto'
                                    type='number'
                                    fullWidth
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                    disabled={naoDignoDeNotaHO}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Qtd Natimorto Fetal"
                                    id="qtNatimorto"
                                    value={Number(form.qtNatimorto)}
                                    name='qtNatimorto'
                                    type='number'
                                    fullWidth
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                    disabled={naoDignoDeNotaHO}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Qtd Parto Prematuro"
                                    id="qtPartoPrematuro"
                                    value={Number(form.qtPartoPrematuro)}
                                    name='qtPartoPrematuro'
                                    type='number'
                                    fullWidth
                                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                                    disabled={naoDignoDeNotaHO}
                                />
                            </Grid>

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
                        <Typography sx={{ mb: 2 }} variant='h4'>Condições Médicas</Typography>
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
                                    label="Não digno de nota"
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
                    <Button type='submit' variant="contained">Gerar cálculo</Button>
                    {warnings.map((v, i) => <Alert key={i} severity="warning" sx={{ width: "100%", mt: 1 }}>{v}</Alert>)}
                    {!!error && <Alert severity="error" sx={{ width: "100%", mt: 1 }}>{error}</Alert>}
                </Box>}
        </Grid>
    </Grid>);
}

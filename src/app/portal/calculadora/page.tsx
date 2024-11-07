'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Info from '@/components/Layout/Info';
import Logo from "@/img/logo.png"
import Image from 'next/image';
import { Button, FormControl, FormControlLabel, FormLabel, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material';
import { UserContext } from '@/context/UserContext';
import InputMask from 'react-input-mask';
import { DatePicker } from '@mui/x-date-pickers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';


export default function Calculadora() {
    const { user, empresa } = React.useContext(UserContext)
    const [result, setResult] = React.useState(false)

    const situacaoFamiliar = [
        { "name": "situacaoFamiliar", "label": "Situação Familiar Instável", "type": "boolean" },
        { "name": "aceitacaoGravidez", "label": "Aceitação da Gravidez", "type": "boolean" },
        { "name": "sabeLer", "label": "Sabe Ler", "type": "boolean" },
        { "name": "fumante", "label": "Fumante", "type": "boolean" },
        { "name": "dependenteDrogas", "label": "Dependente de Drogas", "type": "boolean" },
        { "name": "expostaRiscoOcupacional", "label": "Exposta a Risco Ocupacional", "type": "boolean" },
        { "name": "expostaCondAmbientais", "label": "Exposta a Condições Ambientais", "type": "boolean" }
    ]

    const historicoObst = [
        { "name": "ate2Abortos", "label": "Até 2 Abortos", "type": "boolean" },
        { "name": "maisde2Abortos", "label": "Mais de 2 Abortos", "type": "boolean" },
        { "name": "natimortoFetal", "label": "Natimorto Fetal", "type": "boolean" },
        { "name": "partoPrematuro", "label": "Parto Prematuro", "type": "boolean" },
        { "name": "histRnCrescimento", "label": "Histórico de RN com Crescimento", "type": "boolean" },
        { "name": "intervaloInterpartal", "label": "Intervalo Interpartal", "type": "boolean" },
        { "name": "eclampsia", "label": "Eclampsia", "type": "boolean" },
        { "name": "preEclampsia", "label": "Pré-eclampsia", "type": "boolean" },
        { "name": "placentaPrevia", "label": "Placenta Prévia", "type": "boolean" },
        { "name": "insuficienciaIstmoCervical", "label": "Insuficiência de Istmo Cervical", "type": "boolean" },
        { "name": "cesarea12", "label": "Cesariana (1-2)", "type": "boolean" },
        { "name": "cesarea3Mais", "label": "Cesariana (3 ou mais)", "type": "boolean" },
        { "name": "ultimoPartoMenos12", "label": "Último Parto Menos de 12 meses", "type": "boolean" },
        { "name": "diabetesGestacional", "label": "Diabetes Gestacional", "type": "boolean" },
        { "name": "nuliparidadeMultiparidade", "label": "Nuliparidade / Multiparidade", "type": "boolean" },
        { "name": "placentaPreviaAtual", "label": "Placenta Prévia Atual", "type": "boolean" },
        { "name": "acrestismoPlacentario", "label": "Acrestismo Placentário", "type": "boolean" },
        { "name": "aloimunizacao", "label": "Aloimunização", "type": "boolean" },
        { "name": "esterilidadeTratada", "label": "Esterilidade Tratada", "type": "boolean" },
        { "name": "malformacoesCongenitas", "label": "Malformações Congênitas", "type": "boolean" },
        { "name": "ciur", "label": "CIUR", "type": "boolean" },
        { "name": "polidramnioOligodramnio", "label": "Polidrâmnio / Oligodrâmnio", "type": "boolean" },
        { "name": "citologiaCervicalAnormal", "label": "Citologia Cervical Anormal", "type": "boolean" },
        { "name": "diabetesGestacionalTrat", "label": "Diabetes Gestacional Tratada", "type": "boolean" },
        { "name": "diabetesGestacionalInsul", "label": "Diabetes Gestacional Insulino", "type": "boolean" },
        { "name": "gestacaoDicorionica", "label": "Gestação Dicoriónica", "type": "boolean" },
        { "name": "gestacaoMonocorionica", "label": "Gestação Monocoriónica", "type": "boolean" },
        { "name": "insufIstmoCervicalAtual", "label": "Insuficiência de Istmo Cervical Atual", "type": "boolean" },
        { "name": "trabalhoPartoPrematuro", "label": "Trabalho de Parto Prematuro", "type": "boolean" }
    ]

    const condicoesMedicas = [
        { "name": "tromboembolismoGestacao", "label": "Tromboembolismo na Gestação", "type": "boolean" },
        { "name": "preEclampsiaAtual", "label": "Pré-eclampsia Atual", "type": "boolean" },
        { "name": "aneurisma", "label": "Aneurisma", "type": "boolean" },
        { "name": "aterosclerose", "label": "Aterosclerose", "type": "boolean" },
        { "name": "alteracoesOsteo", "label": "Alterações Ósteas", "type": "boolean" },
        { "name": "varizesAcentuadas", "label": "Varizes Acentuadas", "type": "boolean" },
        { "name": "cardiopatias", "label": "Cardiopatias", "type": "boolean" },
        { "name": "cirurgiaUterina", "label": "Cirurgia Uterina", "type": "boolean" },
        { "name": "diabetesInsulino", "label": "Diabetes Insulino", "type": "boolean" },
        { "name": "diabetesMellitus", "label": "Diabetes Mellitus", "type": "boolean" },
        { "name": "doencasAutoImunesFora", "label": "Doenças Autoimunes (Fora)", "type": "boolean" },
        { "name": "doencasAutoImunesTrat", "label": "Doenças Autoimunes (Tratadas)", "type": "boolean" },
        { "name": "tireoidopatias", "label": "Tireoidopatias", "type": "boolean" },
        { "name": "endometriose", "label": "Endometriose", "type": "boolean" },
        { "name": "epilepsiaNeurologica", "label": "Epilepsia Neurológica", "type": "boolean" },
        { "name": "ginecopatias", "label": "Ginecopatias", "type": "boolean" }
    ]



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
            <Image src={Logo} alt='Logo Grupo Santa Joana Negócios' />
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
            {result ?<>
                <Typography variant='h4'>Resultado do cálculo:</Typography>

                <div style={{ width: "100%" }}>
                    <Grid container sx={{alignItems: "center", mb: 2}}><CheckCircleIcon sx={{mr: 2}}/><Typography variant='body1'>Cálculo gerado com sucesso.</Typography></Grid>
                    <Grid container sx={{alignItems: "center", mb: 2}}><SportsScoreIcon sx={{mr: 2}}/><Typography variant='body1'><strong>Pontos: </strong>217</Typography></Grid>
                    <Grid container sx={{alignItems: "center", mb: 2}}><AccessibilityIcon sx={{mr: 2}}/><Typography variant='body1'><strong>IMC: </strong>19.59</Typography></Grid>
                    <Grid container sx={{alignItems: "center", mb: 2}}><GppMaybeIcon sx={{mr: 2}}/><Typography variant='body1'><strong>Risco: </strong>RISCO MUITO ALTO</Typography></Grid>
                </div>
            </> 
            :<>
                <div style={{ width: "100%" }}>
                    <Typography sx={{ mb: 2 }} variant='h4'>Dados Pessoais</Typography>
                    <input name='idUsuario' value={user?.idUsuario} hidden />
                    <input name='idEmpresa' value={empresa?.idEmpresa} hidden />
                    <Grid container spacing={2} size={12}>
                        <Grid size={12}>
                            <TextField
                                id="nomeCompleto"
                                name='nomeCompleto'
                                label="Nome Completo"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                id="abrevNome"
                                name='abrevNome'
                                label="Nome Abreviado"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                id="email"
                                name='email'
                                label="E-mail"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={4}>
                            <InputMask
                                mask="999.999.999-99"
                            >
                                {/* @ts-expect-error Utilizando plugin externo para máscara de Login */}
                                {(
                                    inputProps: React.InputHTMLAttributes<HTMLInputElement>
                                ) => (
                                    <TextField
                                        id="cpf"
                                        type="text"
                                        name="cpf"
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
                            <DatePicker
                                sx={{ width: "100%" }}
                                label="Data de Nascimento"
                                name='dataNascimento'
                            />
                        </Grid>
                        <Grid size={4}>
                            <InputMask
                                mask="(99) 99999-9999"
                            >
                                {/* @ts-expect-error Utilizando plugin externo para máscara de Login */}
                                {(
                                    inputProps: React.InputHTMLAttributes<HTMLInputElement>
                                ) => (
                                    <TextField
                                        id="telefone"
                                        type="text"
                                        name="telefone"
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
                    </Grid>
                </div>
                <div style={{ width: "100%" }}>
                    <Typography sx={{ mb: 2 }} variant='h4'>Dados da Gestante</Typography>
                    <input name='idGestante' value={1} hidden />
                    <Grid container spacing={2} size={12}>
                        <Grid size={4}>
                            <TextField
                                label="Idade Gestante"
                                id="idadeGestante"
                                name='idadeGestante'
                                type='number'
                                fullWidth
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
                            />
                        </Grid>
                        <Grid size={4}>
                            <TextField
                                label="Altura Nutricional"
                                id="alturaNutr"
                                name='alturaNutr'
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                                    },
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={4}>
                            <TextField
                                label="Peso"
                                id="pesoKg"
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
                                name='imc'
                                type='number'
                                fullWidth
                            />
                        </Grid>
                        <Grid size={4}>
                            <DatePicker
                                sx={{ width: "100%" }}
                                label="Data de Cálculo"
                                name='dtcálculo'
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
                            />
                        </Grid>
                    </Grid>
                </div>
                <div style={{ width: "100%" }}>
                    <Typography sx={{ mb: 2 }} variant='h4'>Situação Familiar e Social</Typography>
                    <Grid container spacing={2} size={12}>
                        {situacaoFamiliar.map((v, i) => <Grid size={6} key={i}>
                            <FormControl fullWidth>
                                <FormLabel>{v.label}</FormLabel>
                                <RadioGroup
                                    row
                                    name={v.name}
                                >
                                    <FormControlLabel value="S" control={<Radio />} label="Sim" />
                                    <FormControlLabel value="N" control={<Radio />} label="Não" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>)}
                    </Grid>
                </div>
                <div style={{ width: "100%" }}>
                    <Typography sx={{ mb: 2 }} variant='h4'>Histórico Obstétrico</Typography>
                    <Grid container spacing={2} size={12}>
                        {historicoObst.map((v, i) => <Grid size={6} key={i}>
                            <FormControl fullWidth>
                                <FormLabel>{v.label}</FormLabel>
                                <RadioGroup
                                    row
                                    name={v.name}
                                >
                                    <FormControlLabel value="S" control={<Radio />} label="Sim" />
                                    <FormControlLabel value="N" control={<Radio />} label="Não" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>)}
                    </Grid>
                </div>
                <div style={{ width: "100%" }}>
                    <Typography sx={{ mb: 2 }} variant='h4'>Condições Médicas</Typography>
                    <Grid container spacing={2} size={12}>
                        {condicoesMedicas.map((v, i) => <Grid size={6} key={i}>
                            <FormControl fullWidth>
                                <FormLabel>{v.label}</FormLabel>
                                <RadioGroup
                                    row
                                    name={v.name}
                                >
                                    <FormControlLabel value="S" control={<Radio />} label="Sim" />
                                    <FormControlLabel value="N" control={<Radio />} label="Não" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>)}
                    </Grid>
                </div>
            </>}
            <Button onClick={() => setResult(!result)} variant="contained">{result ? "Gerar novo cálculo" : "Gerar cálculo"}</Button>
        </Grid>
    </Grid>);
}

"use client";
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Logo from "@/img/logo.png"
import Image from 'next/image';
import { Box, Button, FormControl, Skeleton, Typography } from '@mui/material';
import Info from '@/components/Layout/Info';
import { PieChart } from '@mui/x-charts/PieChart';
import { DatePicker } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import { UserContext } from '@/context/UserContext';
import { getGrafico as getGraficoApi, getRelatorio } from './actions';
import { getGraficoReturn, relatorioType } from './types';
import { DefaultizedPieValueType } from '@mui/x-charts';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { exportToCsv } from '@/utils/functions';

export default function Dashboard() {
    const [loading, setLoading] = useState(false)
    const { empresa, user } = useContext(UserContext)
    const [data, setData] = useState<getGraficoReturn[]>([])
    const TOTAL = useMemo(() => data?.map((item) => item.value).reduce((a, b) => Number(a) + Number(b), 0), [data]);
    const [form, setForm] = useState({
        idEmpresa: empresa?.idEmpresa || "",
        dataInicio: moment().startOf("month").format("DD/MM/YYYY"),
        dataFim: moment().endOf("month").format("DD/MM/YYYY"),
    });
    const [currentForm, setCurrentForm] = useState({
        dataInicioCalculo: moment().startOf("month").format("YYYY-MM-DD"),
        dataFimCalculo: moment().startOf("month").format("YYYY-MM-DD")
    })

    const handleDateChange = (name: string, value: Moment | null) => {
        setForm((prev) => ({
            ...prev,
            [name]: moment(value).format("DD/MM/YYYY")
        }));
    };

    const getGrafico = useCallback(async () => {
        setLoading(true)
        setCurrentForm({
            dataFimCalculo: moment(form.dataFim, "DD/MM/YYYY").format("YYYY-MM-DD"),
            dataInicioCalculo: moment(form.dataInicio, "DD/MM/YYYY").format("YYYY-MM-DD"),
        })
        const response = await getGraficoApi({ ...form, idEmpresa: empresa?.idEmpresa || "", idUsuario: "" })
        setData(response)
        setLoading(false)
    }, [form, empresa, user]);

    useEffect(() => {
        if (empresa) getGrafico()
    }, [empresa, getGrafico])


    const getArcLabel = (params: DefaultizedPieValueType) => {
        const percent = params.value / TOTAL;
        return `${(percent * 100).toFixed(0)}%`;
    };

    const handleExport = async (type: relatorioType) => {
        setLoading(true)
        const nomeRelatorio = `Relatorio_${type}_${empresa?.nomeEmpresa.replace(/ /g, "_")}_de_${currentForm.dataInicioCalculo}_ate_${currentForm.dataFimCalculo}`
        const response = await getRelatorio({
            nomeRelatorio,
            ...currentForm,
            idEmpresa: empresa?.idEmpresa || "",
            tipoRelatorio: type
        })
        exportToCsv({ data: response, fileName: nomeRelatorio });
        setLoading(false)
    };


    return <Grid container sx={{ height: { xs: '100%', sm: '100%' } }}>
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
                    subtitle='Verifique de forma gráfica os resultados dos cáculos feitos por um período.'
                    title='Consulta de Gráficos'
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
                gap: { xs: 4, md: 4 },
            }}
        >
            {!loading ? <>
                <Box sx={{ width: "100%" }}>
                    <Typography variant='h4' sx={{ mb: 3 }}>Gráfico de Risco por Equipe</Typography>
                    <Grid container spacing={2} size={12} mb={5} component={"form"} onSubmit={evt => {
                        evt.preventDefault()
                        getGrafico()
                    }}>
                        <FormControl sx={{ flex: 1 }}>
                            <DatePicker
                                sx={{ width: "100%" }}
                                label="Data Inicial"
                                name='dataInicio'
                                value={moment(form.dataInicio, "DD/MM/YYYY")}
                                onChange={(value) => handleDateChange("dataInicio", value)}
                            />
                        </FormControl>
                        <FormControl sx={{ flex: 1 }}>
                            <DatePicker
                                sx={{ width: "100%" }}
                                label="Data Final"
                                name='dataFim'
                                value={moment(form.dataFim, "DD/MM/YYYY")}
                                onChange={(value) => handleDateChange("dataFim", value)}
                            />
                        </FormControl>
                        <Button variant="contained" size="large" type="submit">Pesquisar</Button>
                    </Grid>
                    {data?.length > 0 &&
                        <>
                            <PieChart
                                series={[
                                    {
                                        data,
                                        arcLabel: getArcLabel,
                                    },
                                ]}
                                width={600}
                                height={250}
                            />

                            <Grid container alignContent={'stretch'} gap={2} justifyContent={'space-between'} mt={5}>
                                <Button color='info' variant='contained' style={{ flex: 1 }} onClick={() => handleExport(relatorioType.resumido)}><DownloadForOfflineIcon /> Exportar Relatório Resumido</Button>
                                <Button color='secondary' style={{ flex: 1 }} variant='contained' onClick={() => handleExport(relatorioType.total)}><DownloadForOfflineIcon /> Exportar Relatório Completo</Button>
                            </Grid>
                        </>}
                </Box>
            </>
                : <Skeleton animation='wave' sx={{ height: "100vh", width: "100%" }} />}
        </Grid>
    </Grid>
}
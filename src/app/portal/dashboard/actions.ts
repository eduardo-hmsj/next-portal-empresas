"use server";

import api from "@/services/api";
import { getGraficoReturn, relatorioType } from "./types";

export async function getGrafico(props: {
    idEmpresa: string,
    idUsuario: string,
    dataInicio: string,
    dataFim: string,
}): Promise<getGraficoReturn[]> {
    try {
        const { data, status } = await api.post("/GraficoPE", props)
        if (status === 200 && Array.isArray(data.Dados)) {
            const g: getGraficoReturn[] = []
            data.Dados.forEach((element: { risco: string, total: number, hexa: string }, index: number) => {
                g.push({
                    id: index,
                    value: element.total,
                    label: `${element.risco}: ${element.total}`,
                    color: element.hexa
                })
            });
            return g
        }
    } catch (error) {
        console.log(error)
    }
    return []
}

export async function getRelatorio(props: {
    nomeRelatorio: string
    dataInicioCalculo: string
    dataFimCalculo: string
    idEmpresa: string,
    tipoRelatorio: relatorioType | ""
}) {
    try {
        const { data } = await api.post("/RelatorioPE", props)
        if(data.Dados.length > 0){
            return data.Dados
        }
    } catch (error) {
        console.log(error)
    }

    return []
}
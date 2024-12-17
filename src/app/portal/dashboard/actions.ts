"use server";

import api from "@/services/api";
import { getGraficoReturn } from "./types";

export async function getGrafico(props: {
    idEmpresa: string,
    idUsuario:string,
    dataInicio: string,
    dataFim: string,
}): Promise<getGraficoReturn[]> {
    try {
        const { data, status } = await api.post("/GraficoPE", props)
        if (status === 200 && Array.isArray(data.Dados)) {
            const g: getGraficoReturn[] = []
            data.Dados.forEach((element: {risco: string, total: number}, index: number) => {
                g.push({
                    id: index,
                    value: element.total,
                    label: `${element.risco}: ${element.total}`
                })
            });
            return g
        }
    } catch (error) {
        console.log(error)
    }
    return []
}



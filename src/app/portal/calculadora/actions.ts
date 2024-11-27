"use server"
import api from "@/services/api"
import { initialCalculadoraValue } from "./types"

export async function postCalculadora(props: Record<string, string>) {
    try {
        const { data } = await api.post("/InserirDadosGestante", props)
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function updateCalculadora(props: Record<string, string>) {
    try {
        const { data } = await api.post("/AlterarDadosGestante", props)
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function getCalculo(props: {
    idCalculo: string
    idEmpresa: string
}): Promise<Record<string, string>> {
    try {
        const { data, status } = await api.post("/ConsultaCalculoPE", props)
        if (status === 200 && Array.isArray(data.Dados) && data.Dados.length > 0) return data.Dados[0]
    } catch (error) {
        console.log(error)
    }
    return initialCalculadoraValue
}
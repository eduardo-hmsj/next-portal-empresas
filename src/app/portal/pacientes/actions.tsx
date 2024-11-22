"use server"
import api from "@/services/api"
import { getPacienteReturn, PacientePayload } from "./types"
import { getUsuariosProps } from "../usuarios/types"
import { removeCpfMask } from "@/utils/functions"

export async function getPacientes(props: getUsuariosProps): Promise<getPacienteReturn[]> {
    try {
        const { data, status } = await api.post("/ConsultaPacientePE", props)
        if (status === 200 && Array.isArray(data.Dados)) return data.Dados
    } catch (error) {
        console.log(error)
    }
    return []
}


export async function postPaciente(props: PacientePayload) {
    try {
        const { data } = await api.post("/CadastroPacientePE", {
            ...props,
            cpf: removeCpfMask(props.cpf)
        })
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function updatePaciente(props: PacientePayload) {
    try {
        const { data } = await api.post("/AlterarPacientePE", {
            ...props,
            cpf: removeCpfMask(props.cpf)
        })
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function intativaPaciente(props: {
    idPaciente: string
    idUsuarioCadastro: string
}) {
    try {
        const { data } = await api.post("/InativarPacientePE", props)
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function activatePaciente(props: {
    idPaciente: string
    idUsuarioCadastro: string
}) {
    try {
        const { data } = await api.post("/AtivarPacientePE", props)
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}
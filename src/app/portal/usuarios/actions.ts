"use server"

import api from "@/services/api";
import { getUsuarioReturn, getUsuariosProps, usuarioPayload } from "./types";
import { removeCpfMask } from "@/utils/functions";

export async function getUsuarios(props: getUsuariosProps): Promise<getUsuarioReturn[]> {
    try {
        const { data, status } = await api.post("/ConsultaUsuarioPE", props)
        if (status === 200 && Array.isArray(data.Dados)) return data.Dados
    } catch (error) {
        console.log(error)
    }
    return []
}


export async function postUsuario(props: usuarioPayload) {
    try {
        const { data } = await api.post("/CadastroUsuarioPE", {
            ...props,
            cpf: removeCpfMask(props.cpf)
        })
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function updateUsuario(props: usuarioPayload) {
    try {
        const { data } = await api.post("/AlterarUsuarioPE", {
            ...props,
            cpf: removeCpfMask(props.cpf)
        })
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function intativaUsuario(props: {
    idUsuario: string
    idEmpresa: string
    idUsuarioCadastro: string
}) {
    try {
        const { data } = await api.post("/InativarUsuarioPE", props)
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function activateUsuario(props: {
    idUsuario: string
    idEmpresa: string
    idUsuarioCadastro: string
}) {
    try {
        const { data } = await api.post("/AtivarUsuarioPE", props)
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}
"use server"

import api from "@/services/api";
import { getEmpresaReturn, getEmpresasProps, EmpresaPayload } from "./types";
import { removeCpfMask } from "@/utils/functions";

export async function getEmpresas(props: getEmpresasProps): Promise<getEmpresaReturn[]> {
    try {
        const { data, status } = await api.post("/ConsultaEmpresaPE", props)
        if (status === 200 && Array.isArray(data.Dados)) return data.Dados
    } catch (error) {
        console.log(error)
    }
    return []
}


export async function postEmpresa(props: EmpresaPayload) {
    try {
        const { data } = await api.post("/CadastroEmpresaPE", {
            ...props,
            cnpj: removeCpfMask(props.cnpj)
        })
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function updateEmpresa(props: EmpresaPayload) {
    try {
        const { data } = await api.post("/AlterarEmpresaPE", {
            ...props,
            cnpj: removeCpfMask(props.cnpj)
        })
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function intativaEmpresa(props: {
    idEmpresa: string
    idUsuarioCadastro: string
}) {
    try {
        const { data } = await api.post("/InativarEmpresaPE", props)
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function activateEmpresa(props: {
    idEmpresa: string
    idUsuarioCadastro: string
}) {
    try {
        const { data } = await api.post("/AtivarEmpresaPE", props)
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}

export async function deleteEmpresa(props: {
    idEmpresa: string
    idUsuarioCadastro: string
}) {
    try {
        const { data } = await api.post("/ApagarEmpresaPE", props)
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}
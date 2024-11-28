"use server"

import { UserProps } from "@/context/UserContext/types"
import api from "@/services/api"
import { cookies } from 'next/headers'
import { LoginPayload } from "./types"
import { removeCpfMask } from "@/utils/functions"

export async function Login(props: LoginPayload) {
    const cookieStore = await cookies()
    try {
        const response = await api.post('/LoginPE', {...props, cpf: removeCpfMask(props.cpf)})

        const dados: UserProps[] | undefined = response.data.User?.empresas

        if (dados !== undefined && dados.length > 0) {
            cookieStore.set('usuario', JSON.stringify(response.data.User))
            if (dados.length === 1) cookieStore.set('empresa', JSON.stringify(dados[0]))
        }
        return response.data
    } catch (error) {
        console.log(error)
        return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
    }
}

export async function RedefinirSenha(props: {cpf: string}) {
    try {
        const response = await api.post('/EsqueciSenhaPE', {...props, cpf: removeCpfMask(props.cpf)})
        return response.data
    } catch (error) {
        console.log(error)
        return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
    }
}
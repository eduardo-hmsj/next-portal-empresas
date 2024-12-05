"use server";

import { cookies } from "next/headers";
import { EmpresaProps, UserProps } from "./types";
import api from "@/services/api";


export async function getEmpresaByCookie(): Promise<EmpresaProps | null> {
    const cookieStore = cookies();
    const empresa = await cookieStore.get('empresa')?.value;
    return empresa ? JSON.parse(empresa) : null;
}


export async function getUsuarioByCookie(): Promise<UserProps | null> {
    const cookieStore = cookies();
    const usuario = await cookieStore.get('usuario')?.value;
    return usuario ? JSON.parse(usuario) : null;
}

export async function deleteAllCookies() {
    const cookieStore = cookies();
    cookieStore.delete('empresa')
    cookieStore.delete('usuario')
}

export async function updateEmpresaCookies(emp: EmpresaProps) {
    const cookieStore = cookies();
    cookieStore.delete('empresa')
    cookieStore.set('empresa', JSON.stringify(emp))
}

export async function refreshLogin(props: {idUsuario: string}) {
    const cookieStore = await cookies()
    try {
        const response = await api.post('/RefreshLoginPE', props)

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

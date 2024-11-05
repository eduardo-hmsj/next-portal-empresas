"use server"

import { UserProps } from "@/context/UserContext/types"
import api from "@/services/api"
import { cookies } from 'next/headers'
import { redirect } from "next/navigation"

export default async function Login(prev: string, formData: FormData) {
    const cookieStore = await cookies()
    try {
        const response = await api.post('/LoginPE', {
            cpf: formData.get("cpf")?.toString().replace(/\D/g, ''),
            senha: formData.get("senha")
        })

        const dados: UserProps[] | undefined = response.data.User.empresas

        if (dados !== undefined && dados.length > 0) {
            cookieStore.set('usuario', JSON.stringify(response.data.User))
            if (dados.length === 1) cookieStore.set('empresa', JSON.stringify(dados[0]))
                console.log("cheguei")
            redirect("/portal/calculadora")
            return "true"
        }
        console.log("cheguei 1")
        return "false"
    } catch (error) {
        console.log(error)
        return "false"
    }
}
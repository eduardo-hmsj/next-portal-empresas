"use server"

import { getUsuarioByCookie } from "@/context/UserContext/actions"
import { cookies } from "next/headers"

export const chooseEmpresa = async (e: string) => {
    const cookieStore = await cookies()
    const usuario = await getUsuarioByCookie()
    if(!usuario) return false
    const empresa = usuario.empresas.find(emp => emp.idEmpresa === e)
    if(!empresa) return false
    cookieStore.set('empresa', JSON.stringify(empresa))
    return true
}
"use server";

import { cookies } from "next/headers";
import { EmpresaProps, UserProps } from "./types";


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


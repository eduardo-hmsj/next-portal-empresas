"use client";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { deleteAllCookies, getEmpresaByCookie, getUsuarioByCookie, refreshLogin, updateEmpresaCookies } from "./actions";
import { ContextType, EmpresaProps, UserProps } from "./types";
import { useRouter } from "next/navigation";

export const UserContext = createContext<ContextType>({
    user: null,
    empresa: null,
    logout: () => { },
    refreshUser: () => { },
    chooseEmpresa: (v: string) => { if(v) return }
});

export default function UserProvider(props: PropsWithChildren) {
    const [user, setUser] = useState<UserProps | null>(null);
    const [empresa, setEmpresa] = useState<EmpresaProps | null>(null);
    const route = useRouter()

    async function updateStatus() {
        const e = await getEmpresaByCookie()
        const u = await getUsuarioByCookie()
        if (e) setEmpresa(e)
        if (u) setUser(u)
    }

    async function logout() {
        await deleteAllCookies()
        route.push("/")
    }

    async function chooseEmpresa(emp: string) {
        const e = user?.empresas.find(v => v.idEmpresa === emp)
        if(e){
            setEmpresa(e)
            await updateEmpresaCookies(e)
        }
    }

    async function refreshUser(){
        const response = await refreshLogin({idUsuario: user?.idUsuario || ""})
        if (response.Codigo === "OK") {
            updateStatus()
        }
    }

    useEffect(() => {
        updateStatus()
    }, [])

    return <UserContext.Provider value={{ user, empresa, logout, chooseEmpresa, refreshUser }}>
        {props.children}
    </UserContext.Provider>

}
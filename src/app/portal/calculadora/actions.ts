"use server"
import api from "@/services/api"

export async function postCalculadora(props: Record<string, string>) {
    try {
        const { data } = await api.post("/InserirDadosGestante", props)
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}
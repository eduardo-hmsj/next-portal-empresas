"use server"
import api from "@/services/api"
import { AjudaPayload } from "./types"

export async function postAjuda(props: AjudaPayload) {
    try {
        const { data } = await api.post("/CadastroAjudaPE", props)
        return data
    } catch (error) {
        console.log(error)
    }

    return { Codigo: 'NOK', Mensagem: 'Houve um erro a responder requisição.' }
}
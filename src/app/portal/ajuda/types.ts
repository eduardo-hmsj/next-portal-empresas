export interface AjudaPayload {
    idUsuario: string
    idEmpresa: string
    assunto: string
    mensagem: string
}

export const AjudaInitial = {
    idUsuario: "",
    idEmpresa: "",
    assunto: "",
    mensagem: "",
    origem: "Calculadora"
}

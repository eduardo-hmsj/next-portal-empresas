export interface PacientePayload {
    idUsuarioCadastro: string
    nomeCompleto: string
    cpf: string
    dataNascimento: string | null
    telefone: string
    email: string
    idEmpresa: string,
    idPaciente?: string
    log?: string
}

export interface getPacienteReturn {
    idUsuario: string
    idPaciente: string
    nomeCompleto: string
    cpf: string
    email: string
    dataNascimento: string
    status: string
    idEmpresa: string,
    telefone: string,
}

export interface getCalculosReturn {
    idPaciente: string,
    nomeCompleto: string,
    pontos: string,
    risco: string,
    dtCalculo: string,
    idCalculo: string,
    idEmpresa: string,
}

export interface getPacientesProps {
    idEmpresa: string
}

export const PacienteInitial = {
    idUsuarioCadastro: "",
    nomeCompleto: "",
    cpf: "",
    dataNascimento: null,
    telefone: "",
    email: "",
    idEmpresa: ""
}

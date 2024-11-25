export interface getUsuariosProps {
    nomeCompleto?: string,
    cpf?: string,
    idEmpresa?: string
}

export interface getUsuarioReturn {
    idUsuario: string
    nomeCompleto: string
    cpf: string
    email: string
    nrConselho: string
    status: string
    idEmpresa: string
    nomeEmpresa: string
    tipoUsuario: string
}

export interface usuarioPayload {
    nomeCompleto: string
    cpf: string
    email: string
    senha: string
    idEmpresa: string
    idUsuarioCadastro: string
    tipoUsuario: string
    conselho: string
    idUsuario?: string
}

export interface ativarUsuarioEmpresaPayload {
    idUsuario: string
    idEmpresa: string
    idUsuarioCadastro: string
    tpUsuario: string
}

export const usuarioInitial = {
    nomeCompleto: "",
    cpf: "",
    email: "",
    senha: "",
    idEmpresa: "",
    idUsuarioCadastro: "",
    tipoUsuario: "",
    conselho: "",
}

export const ativarUsuarioEmpresaInitial = {
    idUsuario: "",
    idEmpresa: "",
    idUsuarioCadastro: "",
    tpUsuario: "",
}
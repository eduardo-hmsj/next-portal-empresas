export interface getEmpresasProps {
    nomeEmpresa?: string,
    idEmpresa?: string
}

export interface getEmpresaReturn {
    idEmpresa: string,
    nomeEmpresa: string,
    cnpj: string,
    endereco: string,
    telefone: string,
    nomeContato: string,
    emailSuporte: string
    idUsuarioCadastro: string
    status: string
}

export interface EmpresaPayload {
    nomeEmpresa: string,
    cnpj: string,
    endereco: string,
    telefone: string,
    idUsuarioCadastro: string,
    nomeContato: string,
    emailSuporte: string,
    idEmpresaPai: string,
    idEmpresa?: string
}

export const EmpresaInitial = {
    nomeEmpresa: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    idUsuarioCadastro: "",
    nomeContato: "",
    idEmpresaPai: "",
    emailSuporte: ""
}


import { GridColDef } from "@mui/x-data-grid"

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

export const columns: GridColDef<(getUsuarioReturn[])[number]>[] = [
    { field: 'idUsuario', headerName: 'ID', width: 50 },
    {
        field: 'nomeCompleto',
        headerName: 'Nome Completo',
        width: 170,
    },
    {
        field: 'cpf',
        headerName: 'CPF',
        width: 80,
    },
    {
        field: 'email',
        headerName: 'E-mail',
        width: 250,
    },
    {
        field: 'tipoUsuario',
        headerName: 'Permissão',
        width: 220,
    },
];

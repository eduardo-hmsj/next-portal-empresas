export interface UserProps {
    nome: string;
    idUsuario: string;
    senha: string;
    cpf: string;
    accessToken: string;
    empresas: EmpresaProps[];
}
export interface EmpresaProps {
    idEmpresa: string;
    nomeEmpresa: string;
    tpUsuario: string;
}

export interface ContextType{
    user: UserProps | null,
    empresa: EmpresaProps | null,
    logout: () => void,
    refreshUser: () => void,
    refreshUserWithId: (id: string) => void,
    chooseEmpresa: (v: string) => void
}

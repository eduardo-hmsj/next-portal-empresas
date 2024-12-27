import { forwardRef } from "react";
import { InputMask, type InputMaskProps } from '@react-input/mask';

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function removeCpfMask(cpf: string): string {
    return cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
}

export const CPFMask = forwardRef<HTMLInputElement, InputMaskProps>((props, forwardedRef) => {
    return <InputMask mask="___.___.___-__" replacement={{ _: /\d/ }} showMask separate ref={forwardedRef} {...props} />;
});
CPFMask.displayName = 'CPFMask'

export const CNPJMask = forwardRef<HTMLInputElement, InputMaskProps>((props, forwardedRef) => {
    return <InputMask mask="__.___.___/____-__" replacement={{ _: /\d/ }} showMask separate ref={forwardedRef} {...props} />;
});
CNPJMask.displayName = 'CNPJMask';

export const TelefoneMask = forwardRef<HTMLInputElement, InputMaskProps>((props, forwardedRef) => {
    return <InputMask mask="(__) ____-____" replacement={{ _: /\d/ }} showMask separate ref={forwardedRef} modify={telefoneModify} {...props} />;
});
TelefoneMask.displayName = 'TelefoneMask';

const telefoneModify = (input: string) => {
    return { mask: input[2] === "9" ? '(__) _ ____-____' : undefined };
};

export function aplicarMascaraCpfCnpj(valor: string): string {
    valor = valor.replace(/\D/g, "");
    if (valor.length <= 11) {
        return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
        return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
}

export function aplicarMascaraTelefone(valor: string): string {
    valor = valor.replace(/\D/g, "");
    if (valor.length === 10) {
        return valor.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (valor.length === 11) {
        return valor.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
    } else {
        return valor;
    }
}

export function calcularIdade(dataNascimento: string): number {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dataNascimento)) {
        return 0
    }

    const [dia, mes, ano] = dataNascimento.split('/').map(Number);

    const dataNasc = new Date(ano, mes - 1, dia);

    if (dataNasc.getDate() !== dia || dataNasc.getMonth() !== mes - 1 || dataNasc.getFullYear() !== ano) {
        return 0
    }

    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();

    if (
        hoje.getMonth() < dataNasc.getMonth() ||
        (hoje.getMonth() === dataNasc.getMonth() && hoje.getDate() < dataNasc.getDate())
    ) {
        idade--;
    }

    return idade;
}


export const exportToCsv = ({ data, fileName }: {
    data: Record<string, string>[];
    fileName: string;
}) => {
    if (!data || data.length === 0) {
        return;
    }
    
    const headers = Object.keys(data[0]);

    const csvContent = [
        headers.join(","),
        ...data.map(row =>
            headers.map(header => JSON.stringify(row[header] || "")).join(",")
        ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(url);
    link.remove();
};

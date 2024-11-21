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
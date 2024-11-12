export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function removeCpfMask(cpf: string): string {
    return cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
}
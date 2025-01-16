"use server";

import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.CRIPTO_SECRET || 'default-key', 'hex');
const iv = crypto.randomBytes(16);

export async function encryptId(id: string): Promise<string> {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(id, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${process.env.CALCULADORA_URL}/fromportal/${iv.toString('hex')}:${encrypted}`;
}

export async function decryptId(encrypted: string): Promise<string> {
    const decodedEncrypted = decodeURIComponent(encrypted); // Decodifica %3A para :
    
    if (!decodedEncrypted.includes(':')) {
        throw new Error('Invalid encrypted string format.');
    }

    const [ivHex, encryptedId] = decodedEncrypted.split(':');
    if (!ivHex || !encryptedId) {
        throw new Error('Invalid encrypted data.');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encryptedId, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

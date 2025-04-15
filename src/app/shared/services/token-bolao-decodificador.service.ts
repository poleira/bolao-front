import * as CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('bol4o-da-cops-32-chavos0');
const iv = CryptoJS.enc.Utf8.parse('vet0r-da-cop416!');

export function decryptAES(encryptedText: string): string {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
// Create a new file for password management
import CryptoJS from 'crypto-js';

export const encryptData = (data, password) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
};

export const decryptData = (encryptedData, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return null;
  }
};
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- KAWAI Auth AES-GCM helpers ---
export function getKawaiiSecret() {
  return process.env.NEXT_ELEMENTS || 'dev-secret';
}
export function getKawaiiBlockhash() {
  return process.env.NEXT_BLOCKHASH || 'dev-blockhash';
}

export async function getAesKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  // Derive a 256-bit AES-GCM key from the secret
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('kawaii-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptKawaiiSession(): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getAesKey(getKawaiiSecret());
  const encoded = new TextEncoder().encode(getKawaiiBlockhash());
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  // Return base64(iv + ciphertext)
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

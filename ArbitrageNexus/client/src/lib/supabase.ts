import { createClient } from '@supabase/supabase-js';

// Set default values for env variables in development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Helper function to encrypt sensitive data client-side before sending to server
export async function encryptData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData
  );
  
  const encryptedArray = new Uint8Array(encryptedData);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);
  
  return btoa(Array.from(combined, byte => String.fromCharCode(byte)).join(''));
}

// Helper function to handle API key rotation
export async function rotateApiKey(apiKeyId: string): Promise<void> {
  const { data: apiKey, error: fetchError } = await supabase
    .from('exchange_api_keys')
    .select('*')
    .eq('id', apiKeyId)
    .single();
    
  if (fetchError || !apiKey) {
    throw new Error('Failed to fetch API key');
  }
  
  // Here you would implement the exchange-specific logic to rotate the API key
  // This is just a placeholder that updates the rotation date
  const { error: updateError } = await supabase
    .from('exchange_api_keys')
    .update({
      rotation_due_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    })
    .eq('id', apiKeyId);
    
  if (updateError) {
    throw new Error('Failed to update API key rotation date');
  }
}

// Helper function to check if an API key needs rotation
export function needsRotation(lastRotation: string): boolean {
  const rotationDate = new Date(lastRotation);
  const daysUntilRotation = Math.floor(
    (rotationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilRotation <= 7; // Warn if rotation is due within 7 days
}

// Rate limiting helper
const rateLimits = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(userId: string, limit: number = 100): boolean {
  const now = Date.now();
  const userRateLimit = rateLimits.get(userId);
  
  if (!userRateLimit || now > userRateLimit.resetTime) {
    rateLimits.set(userId, {
      count: 1,
      resetTime: now + 60000 // Reset after 1 minute
    });
    return true;
  }
  
  if (userRateLimit.count >= limit) {
    return false;
  }
  
  userRateLimit.count++;
  return true;
}
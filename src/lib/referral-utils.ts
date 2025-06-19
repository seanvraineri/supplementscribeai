/**
 * Referral system utilities for SupplementScribe AI
 */

/**
 * Generate a unique referral code
 * Format: SUPP + 4 random alphanumeric characters (e.g., SUPP87A9)
 */
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SUPP';
  
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  const referralCodeRegex = /^SUPP[A-Z0-9]{4}$/;
  return referralCodeRegex.test(code);
}

/**
 * Generate short URL for referrals
 */
export function generateReferralUrl(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://supplementscribe.ai';
  return `${baseUrl}/s/${code}`;
}

/**
 * Generate full signup URL with referral code
 */
export function generateSignupUrl(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://supplementscribe.ai';
  return `${baseUrl}/auth/signup?ref=${code}`;
}

/**
 * Extract referral code from URL parameters
 */
export function extractReferralFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');
  
  if (ref && isValidReferralCode(ref)) {
    return ref;
  }
  
  return null;
}

/**
 * Store referral code in localStorage for later use
 */
export function storeReferralCode(code: string): void {
  if (typeof window === 'undefined') return;
  
  if (isValidReferralCode(code)) {
    localStorage.setItem('referral_code', code);
  }
}

/**
 * Get stored referral code from localStorage
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null;
  
  const code = localStorage.getItem('referral_code');
  
  if (code && isValidReferralCode(code)) {
    return code;
  }
  
  return null;
}

/**
 * Clear stored referral code
 */
export function clearStoredReferralCode(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('referral_code');
} 
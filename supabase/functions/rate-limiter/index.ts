// Simple rate limiter for edge functions
// Uses in-memory storage with automatic cleanup

interface RateLimit {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimit>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, limit] of rateLimitStore.entries()) {
    if (now > limit.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 30, 
  windowMinutes: number = 5
): { allowed: boolean; remainingRequests: number; resetTime: number } {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  
  const existing = rateLimitStore.get(identifier);
  
  if (!existing || now > existing.resetTime) {
    // First request or window expired
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { 
      allowed: true, 
      remainingRequests: maxRequests - 1, 
      resetTime 
    };
  }
  
  if (existing.count >= maxRequests) {
    // Rate limit exceeded
    return { 
      allowed: false, 
      remainingRequests: 0, 
      resetTime: existing.resetTime 
    };
  }
  
  // Increment count
  existing.count++;
  rateLimitStore.set(identifier, existing);
  
  return { 
    allowed: true, 
    remainingRequests: maxRequests - existing.count, 
    resetTime: existing.resetTime 
  };
}

export function getRateLimitHeaders(
  remainingRequests: number, 
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remainingRequests.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  };
} 
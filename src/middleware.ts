import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/auth/signup', '/auth/callback', '/onboarding']
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

  // Skip middleware for API routes - they handle their own authentication
  if (isApiRoute) {
    return response
  }

  // if user is not signed in and trying to access protected route, redirect to login
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // if user is signed in and trying to access login page, redirect to dashboard
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // NEW USER ONBOARDING CHECK: Only redirect to onboarding if user is brand new
  // (has no profile at all) and trying to access dashboard
  if (user && request.nextUrl.pathname === '/dashboard') {
    // Check if this is a redirect from onboarding completion (don't redirect back)
    const referer = request.headers.get('referer')
    const isFromOnboarding = referer && referer.includes('/onboarding')
    
    // Also check for onboarding completion cookie (set by the app)
    const onboardingCompleted = request.cookies.get('onboarding_completed')?.value === 'true'
    
    // CRITICAL: NEVER REDIRECT BACK TO ONBOARDING IF USER IS COMING FROM ONBOARDING
    // If coming from onboarding or just completed onboarding, let them through
    if (isFromOnboarding || onboardingCompleted) {
      console.log('🚫 PREVENTING ONBOARDING REDIRECT - User coming from onboarding or just completed')
      // Clear the completion cookie after use
      if (onboardingCompleted) {
        response.cookies.delete('onboarding_completed')
      }
      return response
    }
    
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single()
      
      // If no profile exists at all (brand new user), redirect to onboarding
      // If profile exists but incomplete, let them see dashboard with banner
      if (error && error.code === 'PGRST116') { // No rows returned
        console.log('🔄 Redirecting to onboarding - No profile found for new user')
        return NextResponse.redirect(new URL('/onboarding', request.url))
      } else {
        console.log('✅ Profile found - Allowing dashboard access')
      }
    } catch (error) {
      // If there's any error checking profile, let them through to dashboard
      // The dashboard will handle showing the onboarding banner
      console.warn('Profile check failed in middleware:', error)
      console.log('✅ Profile check failed - Allowing dashboard access anyway')
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 
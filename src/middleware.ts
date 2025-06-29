import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get the pathname first to make early decisions
  const pathname = request.nextUrl.pathname
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/', 
    '/login', 
    '/auth/signup', 
    '/auth/callback', 
    '/onboarding',
    '/how-it-works',
    '/science', 
    '/for-everyone',
    '/content',
    '/design-preview',
    '/light-preview'
  ]
  
  // Check if this is a public route or static asset
  const isContentPage = pathname.startsWith('/content/')
  const isPublicRoute = publicRoutes.includes(pathname) || isContentPage
  const isApiRoute = pathname.startsWith('/api/')
  const isStaticAsset = pathname.startsWith('/_next/') || 
                       pathname.startsWith('/favicon.ico') ||
                       pathname.startsWith('/site.webmanifest') ||
                       pathname.includes('.') && (
                         pathname.endsWith('.svg') ||
                         pathname.endsWith('.png') ||
                         pathname.endsWith('.jpg') ||
                         pathname.endsWith('.jpeg') ||
                         pathname.endsWith('.gif') ||
                         pathname.endsWith('.webp') ||
                         pathname.endsWith('.ico') ||
                         pathname.endsWith('.css') ||
                         pathname.endsWith('.js') ||
                         pathname.endsWith('.woff') ||
                         pathname.endsWith('.woff2') ||
                         pathname.endsWith('.ttf') ||
                         pathname.endsWith('.otf')
                       )

  // EARLY RETURN: Skip middleware entirely for public routes, API routes, and static assets
  // This prevents any authentication checks on public pages like the homepage
  if (isPublicRoute || isApiRoute || isStaticAsset) {
    return NextResponse.next()
  }

  // Only create Supabase client and check auth for protected routes
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

  // Only redirect to login if user is not signed in AND trying to access protected route
  if (!user) {
    console.log(`🚫 Redirecting to login: ${pathname}`)
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
    
    // Check for query parameter bypass (mobile redirect compatibility)
    const fromOnboardingComplete = request.nextUrl.searchParams.get('from') === 'onboarding-complete'
    
    // Also check for onboarding completion cookie (set by the app)
    const onboardingCompleted = request.cookies.get('onboarding_completed')?.value === 'true'
    
    // Check for dashboard access cookie (set by dashboard page)
    const dashboardAccessed = request.cookies.get('dashboard_accessed')?.value === 'true'
    
    // CRITICAL: NEVER REDIRECT BACK TO ONBOARDING IF USER IS COMING FROM ONBOARDING
    // If coming from onboarding or just completed onboarding, let them through
    if (isFromOnboarding || onboardingCompleted || fromOnboardingComplete || dashboardAccessed) {
      console.log('🚫 PREVENTING ONBOARDING REDIRECT - User coming from onboarding or just completed')
      // Don't clear cookies immediately - let the dashboard page handle it
      return response
    }
    
    // Skip profile check if user recently completed onboarding
    // This prevents race conditions where profile might not be fully created yet
    if (!isFromOnboarding && !onboardingCompleted && !fromOnboardingComplete && !dashboardAccessed) {
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
    } else {
      console.log('✅ Skipping profile check - User recently completed onboarding')
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
     * - Any file extensions (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)$).*)',
  ],
} 
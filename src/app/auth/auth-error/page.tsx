'use client'

import React from 'react';
import Link from 'next/link';
import AuthDebugger from '@/components/AuthDebugger';

export default function AuthError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
            <main className="flex flex-col items-center justify-center flex-1 px-6 text-center">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-red-600">Authentication Error</h1>
                        <p className="text-gray-600 mb-8">
                            There was an error authenticating your account. This could be due to:
                        </p>
                        <ul className="text-left text-gray-600 mb-8 space-y-2">
                            <li>• Invalid or expired authentication link</li>
                            <li>• Email confirmation issues</li>
                            <li>• Network connectivity problems</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <Link 
                            href="/auth/signup"
                            className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                        >
                            Try Signing Up Again
                        </Link>
                        <Link 
                            href="/login"
                            className="block w-full px-4 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </main>
            <AuthDebugger />
        </div>
    )
} 
import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50 text-gray-800">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Welcome to <span className="text-blue-600">SupplementScribe</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Your personalized, data-driven supplement recommendation platform. We use science to help you achieve your health goals.
        </p>
        <Link href="/login" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-300">
            Get Started
        </Link>
      </main>

      <footer className="w-full h-24 flex items-center justify-center border-t mt-8">
        <p>Built with science and AI</p>
      </footer>
    </div>
  );
} 
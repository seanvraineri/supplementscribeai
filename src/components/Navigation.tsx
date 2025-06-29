'use client'

import { useState } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-background/80 backdrop-blur-md border-b border-dark-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-dark-primary tracking-tight">
              SupplementScribe
            </Link>
            
            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/how-it-works" className="text-dark-secondary hover:text-dark-primary transition-colors">
                How It Works
              </Link>
              <Link href="/for-everyone" className="text-dark-secondary hover:text-dark-primary transition-colors">
                For Everyone
              </Link>
              <Link href="/science" className="text-dark-secondary hover:text-dark-primary transition-colors">
                Science
              </Link>
              <Link href="/content" className="text-dark-secondary hover:text-dark-primary transition-colors">
                Content
              </Link>
              <Link href="/#pricing" className="text-dark-secondary hover:text-dark-primary transition-colors">
                Pricing
              </Link>
              <Link href="/login">
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-dark-secondary hover:text-dark-primary border border-dark-border rounded-lg hover:border-dark-accent transition-all duration-200">
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="inline-flex items-center px-4 py-2 text-sm font-bold text-dark-background bg-dark-accent rounded-lg hover:bg-dark-accent/90 transition-all duration-200">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-dark-primary hover:text-dark-accent transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[280px] bg-dark-background border-l border-dark-border z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-dark-border">
                  <span className="text-xl font-bold text-dark-primary">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-dark-secondary hover:text-dark-primary transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-8">
                  <div className="flex flex-col space-y-1 px-4">
                    <Link 
                      href="/how-it-works" 
                      onClick={handleLinkClick}
                      className="px-4 py-3 text-lg text-dark-secondary hover:text-dark-primary hover:bg-dark-panel rounded-lg transition-all duration-200"
                    >
                      How It Works
                    </Link>
                    <Link 
                      href="/for-everyone" 
                      onClick={handleLinkClick}
                      className="px-4 py-3 text-lg text-dark-secondary hover:text-dark-primary hover:bg-dark-panel rounded-lg transition-all duration-200"
                    >
                      For Everyone
                    </Link>
                    <Link 
                      href="/science" 
                      onClick={handleLinkClick}
                      className="px-4 py-3 text-lg text-dark-secondary hover:text-dark-primary hover:bg-dark-panel rounded-lg transition-all duration-200"
                    >
                      Science
                    </Link>
                    <Link 
                      href="/content" 
                      onClick={handleLinkClick}
                      className="px-4 py-3 text-lg text-dark-secondary hover:text-dark-primary hover:bg-dark-panel rounded-lg transition-all duration-200"
                    >
                      Content
                    </Link>
                    <Link 
                      href="/#pricing" 
                      onClick={handleLinkClick}
                      className="px-4 py-3 text-lg text-dark-secondary hover:text-dark-primary hover:bg-dark-panel rounded-lg transition-all duration-200"
                    >
                      Pricing
                    </Link>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-dark-border space-y-3">
                  <Link href="/login" onClick={handleLinkClick} className="block">
                    <button className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium text-dark-secondary hover:text-dark-primary border border-dark-border rounded-lg hover:border-dark-accent transition-all duration-200">
                      <LogIn className="w-4 h-4 mr-2" />
                      Log In
                    </button>
                  </Link>
                  <Link href="/auth/signup" onClick={handleLinkClick} className="block">
                    <button className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-bold text-dark-background bg-dark-accent rounded-lg hover:bg-dark-accent/90 transition-all duration-200">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

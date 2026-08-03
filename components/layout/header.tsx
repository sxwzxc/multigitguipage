"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Partners', href: '/partners' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-sm py-4 shadow-sm border-b border-border' 
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-playfair text-2xl font-bold tracking-tight">
                Brand
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary relative py-2',
                  pathname === item.href
                    ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:content-[""]'
                    : 'text-foreground/70 hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            
            <Button className="hidden md:flex" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-playfair text-2xl font-bold tracking-tight">
                  Brand
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-lg font-medium transition-colors hover:text-primary relative py-2',
                    pathname === item.href
                      ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:content-[""]'
                      : 'text-foreground/70 hover:text-foreground'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button className="w-full mt-4" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
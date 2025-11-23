"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NAV_LINKS } from "@/lib/constants";
import { getInitials } from "@/lib/helpers";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function Header() {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect with proper cleanup
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              OkabaliTravel
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { href: "/", label: t('nav.home') },
              { href: "/destinations", label: t('nav.destinations') },
              { href: "/tours", label: t('nav.tours') },
              { href: "/packages", label: t('nav.packages') },
              { href: "/travel-book", label: t('nav.travelBook') },
              { href: "/about", label: t('nav.about') },
              { href: "/contact", label: t('nav.contact') },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex focus-premium"
              aria-label="Search destinations"
            >
              <Icons.search size={20} weight="regular" />
            </Button>

            {/* Wishlist */}
            {session && (
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex relative focus-premium"
                  aria-label="Wishlist"
                >
                  <Icons.heart size={20} weight="regular" />
                  <span
                    className="absolute -top-1 -right-1 bg-sky-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                    aria-label="0 items in wishlist"
                  >
                    0
                  </span>
                </Button>
              </Link>
            )}

            {/* User Menu - Authenticated */}
            {status === "authenticated" && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
                        {getInitials(session.user.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(session.user as any).role === "ADMIN" ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Icons.shield size={16} weight="regular" className="mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <Icons.dashboard size={16} weight="regular" className="mr-2" />
                        {t('nav.dashboard')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/bookings" className="cursor-pointer">
                      <Icons.book size={16} weight="regular" className="mr-2" />
                      {t('nav.myBookings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">
                      <Icons.heart size={16} weight="regular" className="mr-2" />
                      {t('nav.wishlist')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Icons.settings size={16} weight="regular" className="mr-2" />
                      {t('nav.settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <Icons.signOut size={16} weight="regular" className="mr-2" />
                    {t('nav.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* User Menu - Not Authenticated */
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">{t('nav.signIn')}</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>{t('nav.signUp')}</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden focus-premium"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? (
                    <Icons.close size={24} weight="regular" />
                  ) : (
                    <Icons.menu size={24} weight="regular" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-gray-700 hover:text-sky-600 transition-colors py-2"
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="pt-4 border-t">
                    {session ? (
                      <>
                        <div className="mb-4 pb-4 border-b">
                          <p className="font-medium">{session.user?.name}</p>
                          <p className="text-sm text-gray-500">{session.user?.email}</p>
                        </div>
                        {(session.user as any).role === "ADMIN" ? (
                          <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <Icons.shield size={16} weight="regular" className="mr-2" />
                              Admin Panel
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <Icons.dashboard size={16} weight="regular" className="mr-2" />
                              Dasbor
                            </Button>
                          </Link>
                        )}
                        <Link href="/bookings" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <Icons.book size={16} weight="regular" className="mr-2" />
                            Pemesanan Saya
                          </Button>
                        </Link>
                        <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <Icons.heart size={16} weight="regular" className="mr-2" />
                            Favorit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 mt-4"
                          onClick={handleSignOut}
                        >
                          <Icons.signOut size={16} weight="regular" className="mr-2" />
                          Keluar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full">
                            Masuk
                          </Button>
                        </Link>
                        <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full mt-2">Daftar</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

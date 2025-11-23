"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { FOOTER_LINKS, SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
              {t('common.appName')}
            </h3>
            <p className="text-sm">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a
                href={SITE_CONFIG.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-sky-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-sky-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Jl. Raya Ubud No. 88, Gianyar, Bali 80571</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-sky-400 flex-shrink-0" />
                <span className="text-sm">+62 361 975 888</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-sky-400 flex-shrink-0" />
                <span className="text-sm">info@okabalitravel.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">
            © {new Date().getFullYear()} {t('common.appName')}. {t('footer.allRightsReserved')}
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-sm hover:text-sky-400 transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
            <Link href="/terms" className="text-sm hover:text-sky-400 transition-colors">
              {t('footer.termsOfService')}
            </Link>
            <Link href="/cookies" className="text-sm hover:text-sky-400 transition-colors">
              {t('footer.cookiePolicy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import {
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: "#accueil", label: "Accueil" },
    { href: "#services", label: "Services" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#apropos", label: "À propos" },
    { href: "#contact", label: "Contact" },
  ];

  const socialLinks = [
    { icon: FaLinkedin, url: "#", label: "LinkedIn" },
    { icon: FaGithub, url: "#", label: "GitHub" },
    { icon: FaFacebook, url: "#", label: "Facebook" },
    { icon: FaEnvelope, url: "mailto:contact@example.com", label: "Email" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo et description */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Portfolio</h3>
            <p className="text-gray-400">
              Développeur Full-Stack spécialisé dans la création de solutions
              digitales innovantes à Cotonou, Bénin.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Liens Rapides
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Suivez-Moi
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="text-xl" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} Portfolio Professionnel. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

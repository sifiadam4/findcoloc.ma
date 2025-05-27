import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Logo from "../global/logo";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <Link
              href={"/"}
              className="flex items-center space-x-1 mb-4"
            >
              <Logo />
              <h1 className="font-semibold text-2xl tracking-tight">
                Find<span className="text-primary">Coloc</span>
              </h1>
            </Link>
            <p className="text-gray-400 mb-4">
              La première plateforme de colocation intelligente au Maroc. Nous
              connectons des colocataires compatibles avec des logements de
              qualité.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-secondary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-secondary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-secondary transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-secondary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-4">
              Liens rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/mes-favoris"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Mes Favoris
                </Link>
              </li>
              <li>
                <Link
                  href="/mes-candidatures"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                    Mes Candidatures    
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  À propos
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-4">
              Informations légales
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/conditions-utilisation"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-confidentialite"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Gestion des cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-secondary mr-2 mt-0.5" />
                <span className="text-gray-400">
                  123 Boulevard Mohammed V, Casablanca, Maroc
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-secondary mr-2" />
                <a
                  href="tel:+212522123456"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  +212 522 12 34 56
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-secondary mr-2" />
                <a
                  href="mailto:contact@findcoloc.ma"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  contact@findcoloc.ma
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} FindColoc. Tous droits réservés.
          </p>
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-3">Langue:</span>
            <select className="bg-gray-800 text-gray-400 text-sm rounded-md px-2 py-1 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-secondary">
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}

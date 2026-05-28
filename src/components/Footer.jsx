import { Phone, Mail, MapPin } from "lucide-react";
import { Instagram, Facebook, Twitter, Youtube } from "react-feather";
import { Link } from "react-router-dom";
import TechComputerLogo from "../assets/tech-computer-logo.jpeg";

const QUICK_LINKS = [
  { label: "Home",        to: "/" },
  { label: "Shop",        to: "/category" },
  { label: "About Us",    to: "/about" },
  { label: "Contact",     to: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "Track Order", to: "/orders"  },
  { label: "Contact Us",  to: "/contact" },
];

const SOCIAL = [
  { Icon: Instagram, href: "https://www.instagram.com/thefloralstudio_surat/" },
  { Icon: Facebook,  href: "https://www.facebook.com/61564869235012/photos/"  },
  { Icon: Twitter,   href: "https://twitter.com"   },
  { Icon: Youtube,   href: "https://youtube.com"   },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--color-charcoal)", color: "var(--color-beige)" }}>
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <img src={TechComputerLogo} alt="Tech Computer" className="w-12 h-12 object-contain bg-white" />
              <span style={{ fontFamily: "Georgia,serif" }} className="font-bold text-lg">Tech Computer</span>
            </Link>
            <p style={{ color: "var(--color-sage)" }} className="text-sm leading-relaxed mb-5">
              Computer sales, repairs, accessories, and support for homes and businesses.
            </p>
            <div className="flex gap-3">
              {SOCIAL.map(({ Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noreferrer"
                  style={{ background: "var(--color-charcoal)" }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontFamily: "Georgia,serif" }} className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} style={{ color: "var(--color-sage)" }}
                    className="text-sm hover:opacity-70 transition-opacity">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 style={{ fontFamily: "Georgia,serif" }} className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} style={{ color: "var(--color-sage)" }}
                    className="text-sm hover:opacity-70 transition-opacity">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontFamily: "Georgia,serif" }} className="font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm" style={{ color: "var(--color-sage)" }}>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-olive)" }} />
                105-106 Prime Shoppers, Vesu, Surat, Gujarat 395007
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} style={{ color: "var(--color-olive)" }} />
                <a href="tel:+919825553565" className="hover:opacity-70 transition-opacity">+91 98255 53565</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} style={{ color: "var(--color-olive)" }} />
                <a href="mailto:thefloralstudiosurat@gmail.com" className="hover:opacity-70 transition-opacity">thefloralstudiosurat@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs"
          style={{ borderColor: "var(--color-charcoal)", color: "var(--color-olive)" }}>
          <p>© 2019 Tech Computer. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:opacity-70 transition-opacity">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:opacity-70 transition-opacity">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:opacity-70 transition-opacity">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

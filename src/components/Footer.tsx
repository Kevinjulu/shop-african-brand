import { Facebook, Instagram, Twitter, CreditCard, Smartphone, Wallet, Bitcoin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:gap-8 gap-4 mb-8">
          {/* Column 1 */}
          <div>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/careers" 
                  className="text-gray-600 hover:text-primary transition-colors text-sm md:text-base"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  to="/affiliate" 
                  className="text-gray-600 hover:text-primary transition-colors text-sm md:text-base"
                >
                  Become an Affiliate
                </Link>
              </li>
              <li>
                <Link 
                  to="/vendor/register" 
                  className="text-gray-600 hover:text-primary transition-colors text-sm md:text-base"
                >
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-600 hover:text-primary transition-colors text-sm md:text-base"
                >
                  Policies and Terms
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping-policy" 
                  className="text-gray-600 hover:text-primary transition-colors text-sm md:text-base"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 hover:text-primary transition-colors text-sm md:text-base"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-4 mb-6">
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        {/* Payment Methods */}
        <div className="text-center mb-6">
          <p className="text-xs font-medium text-gray-600 mb-3">We Accept</p>
          <div className="flex justify-center flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs">
              <Smartphone className="h-3.5 w-3.5 text-gray-600" />
              <span className="font-medium text-gray-700">M-Pesa</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs">
              <CreditCard className="h-3.5 w-3.5 text-gray-600" />
              <span className="font-medium text-gray-700">Cards</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs">
              <Wallet className="h-3.5 w-3.5 text-gray-600" />
              <span className="font-medium text-gray-700">PayPal</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs">
              <Bitcoin className="h-3.5 w-3.5 text-gray-600" />
              <span className="font-medium text-gray-700">Crypto</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 border-t pt-6">
          <p className="text-sm mb-2">© {new Date().getFullYear()} Shop African Brand. All rights reserved.</p>
          <p className="text-xs">
            Created with ❤️ by{" "}
            <a 
              href="https://kevinjulu.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Julu
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
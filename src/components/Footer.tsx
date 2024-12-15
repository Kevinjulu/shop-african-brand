import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-4">Contact Us</h3>
            <p className="text-gray-600 mb-2">Call us 24/7</p>
            <p className="text-primary font-semibold mb-2">+254 700 000000</p>
            <address className="text-gray-600 not-italic">
              123 African Craft Street<br />
              Nairobi, Kenya
            </address>
            <div className="flex gap-4 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5 text-gray-600 hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 text-gray-600 hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5 text-gray-600 hover:text-primary cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-600 hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns-policy" className="text-gray-600 hover:text-primary transition-colors">Returns & Exchanges</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/careers" className="text-gray-600 hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/affiliate" className="text-gray-600 hover:text-primary transition-colors">Become an Affiliate</Link></li>
              <li><Link to="/vendor/register" className="text-gray-600 hover:text-primary transition-colors">Become a Vendor</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">Subscribe to get updates about our products and offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} Shop African. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
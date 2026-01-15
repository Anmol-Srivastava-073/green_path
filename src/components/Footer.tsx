import { motion } from 'motion/react';
import { Recycle, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Press Kit', href: '#press' },
    ],
    resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'API Reference', href: '#api' },
      { label: 'Community', href: '#community' },
      { label: 'Support', href: '#support' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'Disclaimer', href: '#disclaimer' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-[#1877F2]' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-[#1DA1F2]' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-[#E4405F]' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-[#0A66C2]' },
    { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:text-[#333]' },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#342E37] via-[#3d373f] to-[#342E37] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-[#3C91E6] to-[#A2D729] p-3 rounded-xl">
                  <Recycle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">GreenPath</h3>
                  <p className="text-sm text-white/60">Tinder for Trash</p>
                </div>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                India's first community-driven smart waste routing platform. 
                Empowering neighborhoods to manage waste efficiently with AI-powered tools and real-time collaboration.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <motion.a
                  href="mailto:contact@greenpath.in"
                  className="flex items-center gap-3 text-white/70 hover:text-[#A2D729] transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#A2D729]/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm">contact@greenpath.in</span>
                </motion.a>
                
                <motion.a
                  href="tel:+911234567890"
                  className="flex items-center gap-3 text-white/70 hover:text-[#3C91E6] transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#3C91E6]/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm">+91 (123) 456-7890</span>
                </motion.a>
                
                <motion.div
                  className="flex items-center gap-3 text-white/70"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-white/10 p-2 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Mumbai, Maharashtra, India</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    className="text-white/70 hover:text-[#A2D729] transition-colors text-sm flex items-center gap-2 group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-1 h-1 bg-[#A2D729] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    className="text-white/70 hover:text-[#3C91E6] transition-colors text-sm flex items-center gap-2 group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-1 h-1 bg-[#3C91E6] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    className="text-white/70 hover:text-[#A2D729] transition-colors text-sm flex items-center gap-2 group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-1 h-1 bg-[#A2D729] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    className="text-white/70 hover:text-[#3C91E6] transition-colors text-sm flex items-center gap-2 group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-1 h-1 bg-[#3C91E6] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-8 mb-8"
        >
          <div className="max-w-xl mx-auto text-center">
            <h4 className="text-xl font-semibold mb-3">Stay Updated</h4>
            <p className="text-white/70 mb-4 text-sm">
              Subscribe to our newsletter for the latest updates on waste management and sustainability.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#A2D729] focus:bg-white/15 transition-all"
              />
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-white/60 text-sm order-2 md:order-1">
              © {currentYear} GreenPath. Made with{' '}
              <Heart className="inline w-4 h-4 text-red-500 fill-current" /> in India.
              All rights reserved.
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 order-1 md:order-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-white/10 p-3 rounded-lg text-white/70 ${social.color} transition-colors hover:bg-white/20`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-white/10 text-center"
        >
          <p className="text-white/50 text-xs">
            GreenPath is committed to creating sustainable communities across India. 
            By leveraging technology and community collaboration, we're making waste management smarter and more efficient.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

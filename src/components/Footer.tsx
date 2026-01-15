import { motion } from 'motion/react';
import { Recycle, Mail, Phone, MapPin, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#342E37] via-[#3d373f] to-[#342E37] text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-[#3C91E6] to-[#A2D729] p-3 rounded-xl">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold">GreenPath</h3>
                <p className="text-sm text-white/60">Tinder for Trash</p>
              </div>
            </div>

                      </motion.div>

          
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-6 text-center"
          >
            <p className="text-white/60 text-sm">
              © {currentYear} GreenPath. Made with{' '}
              <Heart className="inline w-4 h-4 text-red-500 fill-current mx-1" />
              by Team AlgoVerse. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

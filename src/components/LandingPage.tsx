import { motion } from 'motion/react';
import { MapPin, Camera, Users, Trash2, ArrowRight, Recycle, Sparkles, TrendingUp, Bell, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Footer } from './Footer';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFFFD] via-[#e8f7ff] to-[#f0ffd9]">
      {/* Animated Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#342E37]/10"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-gradient-to-br from-[#3C91E6] to-[#A2D729] p-2 rounded-xl">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#342E37]">GreenPath</h1>
              <p className="text-xs text-[#342E37]/60">Tinder for Trash</p>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white hover:shadow-lg transition-all"
            >
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <span className="bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white px-4 py-2 rounded-full text-sm font-medium">
                  🇮🇳 Smart Waste Routing for Indian Neighborhoods
                </span>
              </motion.div>

              <h1 className="text-6xl lg:text-7xl font-bold text-[#342E37] mb-6 leading-tight">
                Transform Your{' '}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#3C91E6] to-[#A2D729]"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  Neighborhood
                </motion.span>
              </h1>

              <p className="text-xl text-[#342E37]/70 mb-8 leading-relaxed">
                GreenPath is India's first community-driven waste routing platform. 
                <span className="font-bold text-[#3C91E6]"> Pin waste locations</span> on a shared map, 
                <span className="font-bold text-[#A2D729]"> scan with AI</span>, and 
                <span className="font-bold text-[#3C91E6]"> collaborate</span> with neighbors for efficient collection.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    onClick={onGetStarted}
                    className="bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white text-lg px-8 py-6 hover:shadow-2xl transition-all"
                  >
                    Start Mapping Waste <MapPin className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </div>

              <div className="flex items-center gap-6 text-sm text-[#342E37]/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#A2D729]" />
                  <span>AI-Powered Scanner</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#3C91E6]" />
                  <span>Community Collaboration</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-[#3C91E6]/20 to-[#A2D729]/20 rounded-3xl"
                  animate={{ rotate: [0, 2, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1642631171488-23d631eba638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMHJlY3ljbGluZyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NjgxNTcxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Community waste recycling"
                  className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                />
                <motion.div
                  className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: 'spring' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-[#A2D729] to-[#3C91E6] p-3 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#342E37]">1,247</p>
                      <p className="text-xs text-[#342E37]/60">Waste Items Collected</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-[#342E37] mb-4">
              How <span className="text-[#3C91E6]">GreenPath</span> Works
            </h2>
            <p className="text-xl text-[#342E37]/60 max-w-2xl mx-auto">
              Three simple steps to transform your neighborhood's waste management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Pin Waste Locations',
                description: 'Drop a pin on the map to mark where waste needs collection. Add photos, descriptions, and waste types.',
                color: 'from-[#3C91E6] to-[#5ba7f0]',
                image: 'https://images.unsplash.com/photo-1754299356969-2b7d4ffefd9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXAlMjBsb2NhdGlvbiUyMHBpbnxlbnwxfHx8fDE3NjgwNzQ1MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
              },
              {
                icon: Camera,
                title: 'AI-Powered Scanner',
                description: 'Use Gemini AI to scan and identify recyclable materials instantly. Get smart recycling suggestions.',
                color: 'from-[#A2D729] to-[#b8e54a]',
                image: 'https://images.unsplash.com/photo-1706203031718-eaa7811105fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwY2FtZXJhJTIwc2Nhbm5pbmd8ZW58MXx8fHwxNzY4MTU3MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
              },
              {
                icon: Users,
                title: 'Community Collaboration',
                description: 'See waste pins from all neighbors in real-time. Optimize collection routes and track neighborhood impact.',
                color: 'from-[#3C91E6] to-[#A2D729]',
                image: 'https://images.unsplash.com/photo-1642631171488-23d631eba638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMHJlY3ljbGluZyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NjgxNTcxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg overflow-hidden h-full border border-[#342E37]/5 hover:shadow-2xl transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-20`} />
                    </div>
                    <div className="p-6">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#342E37] mb-3">{feature.title}</h3>
                      <p className="text-[#342E37]/60 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#3C91E6] to-[#A2D729]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Trash2, label: 'Waste Items Tracked', value: '1.2K+' },
              { icon: Users, label: 'Active Neighbors', value: '350+' },
              { icon: MapPin, label: 'Collection Points', value: '89' },
              { icon: TrendingUp, label: 'Recycling Rate', value: '78%' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center text-white"
                >
                  <Icon className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-[#342E37] mb-4">
              Why Choose <span className="text-[#A2D729]">GreenPath</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Bell,
                title: 'Real-Time Notifications',
                description: 'Get instant alerts when new waste is posted in your area or when collection routes are optimized.',
              },
              {
                icon: Shield,
                title: 'Community Verified',
                description: 'All waste posts are verified by the community, ensuring accurate and reliable information.',
              },
              {
                icon: Sparkles,
                title: 'AI-Powered Insights',
                description: 'Gemini AI analyzes images to identify recyclable materials and provide eco-friendly disposal tips.',
              },
              {
                icon: TrendingUp,
                title: 'Impact Analytics',
                description: 'Track your neighborhood\'s environmental impact with detailed analytics and progress charts.',
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-6 bg-white rounded-2xl shadow-lg border border-[#342E37]/5 hover:shadow-xl transition-all"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3C91E6] to-[#A2D729] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#342E37] mb-2">{benefit.title}</h3>
                    <p className="text-[#342E37]/60">{benefit.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#342E37] to-[#4a444d]">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Make Your Neighborhood Greener?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of Indians revolutionizing waste management one pin at a time.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-gradient-to-r from-[#A2D729] to-[#3C91E6] text-white text-lg px-12 py-6 hover:shadow-2xl transition-all"
              >
                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Zap,
  Shield,
  Users,
  Clock,
  Star,
  ChevronDown,
  Upload,
  Palette,
  Sparkles,
  Download,
  Brush,
  Camera,
  Quote,
  Menu,
  X,
} from 'lucide-react';

// Import landing page images
import reportsImg from '@/assets/landing/reports.png';
import invoicesImg from '@/assets/landing/invoices.png';
import businessImg from '@/assets/landing/business.png';
import integrationsImg from '@/assets/landing/integrations.png';

const screenshots = [
  { src: reportsImg, alt: 'Reports Dashboard', title: 'Real-time Analytics' },
  { src: invoicesImg, alt: 'Invoice Management', title: 'Invoice Management' },
  { src: businessImg, alt: 'Business Settings', title: 'Business Customization' },
  { src: integrationsImg, alt: 'Integrations', title: 'Powerful Integrations' },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-change carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when clicking on a link
  const handleMobileMenuClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button className="flex items-center gap-2 group" onClick={() => navigate('/reports')}>
              <div className="w-8 h-8 bg-[#635BFF] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">D</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">DefInvoice</h1>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a
                href="https://github.com/Koushith/DefinVoice"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-4">
                <a
                  href="#features"
                  onClick={handleMobileMenuClick}
                  className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
                >
                  Features
                </a>
                <a
                  href="https://github.com/Koushith/DefinVoice"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleMobileMenuClick}
                  className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
                >
                  GitHub
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="h-16"></div>

      {/* Hero */}
      <section id="hero" className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50/30 to-white">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)',
              }}
            ></div>
          </div>
          <div className="relative z-10 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-blue-400 rounded-full shadow-sm">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">Open Source • Self-Hostable</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
                    Full-Fledged Billing & Payment Platform
                    <span className="block">Built for Everyone</span>
                  </h1>
                  <p className="text-lg sm:text-xl font-medium text-gray-600 leading-relaxed">
                    Complete open source billing, payment, and invoicing solution for{' '}
                    <span className="font-bold text-gray-900">freelancers</span> and{' '}
                    <span className="font-bold text-gray-900">businesses</span>. Self-host for complete control or use
                    our hosted version. Your data, your way.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#635BFF] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-base font-medium text-gray-700">100% open source - self-host anywhere</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#635BFF] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-base font-medium text-gray-700">
                        12 beautiful templates & automated reminders
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#635BFF] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-base font-medium text-gray-700">
                        Public hosted invoices with shareable links
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#635BFF] text-white font-semibold text-base rounded-lg hover:bg-[#5045e5] transition-colors gap-2"
                    >
                      Start For Free
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-8 pt-8 border-t border-gray-200">
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">12</p>
                      <p className="text-sm font-semibold text-gray-600">Templates</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">Auto</p>
                      <p className="text-sm font-semibold text-gray-600">Reminders</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">HD</p>
                      <p className="text-sm font-semibold text-gray-600">PDF Export</p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative">
                    <div className="absolute -inset-6 bg-gray-100 rounded-3xl transform rotate-2"></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-600">APP PREVIEW</span>
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl h-[400px]">
                          {screenshots.map((screenshot, index) => (
                            <img
                              key={index}
                              src={screenshot.src}
                              alt={screenshot.alt}
                              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
                                index === currentIndex ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm font-semibold text-gray-700">{screenshots[currentIndex].title}</span>
                          <div className="flex gap-2">
                            {screenshots.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentIndex ? 'bg-[#635BFF]' : 'bg-gray-300'
                                }`}
                                aria-label={`Go to screenshot ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <span className="text-sm font-semibold text-blue-800">Why Choose Us?</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose DefInvoice?</h2>
            <p className="text-xl font-medium text-gray-600 max-w-2xl mx-auto">
              Open source invoicing made simple. Self-host for full control or use our hosted version. Your data stays
              yours.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: '100% Open Source',
                desc: 'Full source code available on GitHub. Self-host on your infrastructure or use our cloud version.',
              },
              {
                icon: Shield,
                title: 'Own Your Data',
                desc: 'Complete control over your invoices and customer data. No vendor lock-in, export anytime.',
              },
              {
                icon: Brush,
                title: '12 Beautiful Templates',
                desc: 'Choose from professionally designed invoice templates. From minimalist to artistic styles.',
              },
              {
                icon: Clock,
                title: 'Automated Reminders',
                desc: 'Set it and forget it. Automatic email reminders sent to customers for overdue invoices.',
              },
              {
                icon: Camera,
                title: 'Public Invoice Links',
                desc: 'Share professional hosted invoices with customers via a simple link. No downloads required.',
              },
              {
                icon: Users,
                title: 'Payment Tracking',
                desc: 'Record payments manually with detailed tracking. Fiat & crypto integrations coming soon!',
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 border border-blue-200">
                  <feature.icon className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-base font-medium text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create professional invoices in 4 simple steps. No experience required.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Create Account',
                desc: 'Sign up in seconds. No credit card required to start.',
              },
              {
                step: '02',
                icon: Palette,
                title: 'Add Customer',
                desc: 'Import or add customer details and payment preferences.',
              },
              {
                step: '03',
                icon: Sparkles,
                title: 'Generate Invoice',
                desc: 'Create professional invoices in just 30 seconds.',
              },
              {
                step: '04',
                icon: Download,
                title: 'Get Paid',
                desc: 'Send and track payments with automated reminders.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-20 left-full w-8 z-10">
                    <ArrowRight className="w-6 h-6 text-blue-400 transform translate-x-4" />
                  </div>
                )}
                <div className="relative bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100 h-full">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-[#635BFF] rounded-full shadow-lg flex items-center justify-center">
                      <span className="font-bold text-white text-lg">{item.step}</span>
                    </div>
                  </div>
                  <div className="mt-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <item.icon className="w-10 h-10 text-gray-900" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#635BFF] group-hover:w-full transition-all duration-500 rounded-b-3xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <Star className="w-4 h-4 text-blue-500 fill-current" />
              <span className="text-sm font-semibold text-blue-800">Trusted by Our Growing Community</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">Wall of Love</h2>
            <p className="text-xl font-medium text-gray-600 max-w-2xl mx-auto mb-8">
              See what our community is saying about DefInvoice
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                name: 'Darshan',
                role: 'Digital Marketer',
                text: 'This tool completely transformed how I manage client invoices. The automated reminders saved me hours of follow-ups!',
                badge: 'saved me hours',
                image: 'https://pbs.twimg.com/profile_images/1904968810349604865/KSNv1oUn_400x400.jpg',
                twitter: 'https://x.com/Darshan570',
              },
              {
                name: 'Srijith Padmesh',
                role: 'Product Manager',
                text: 'I was skeptical about another invoicing tool, but wow! Open source and self-hostable - exactly what I needed for my agency.',
                badge: 'exactly what I needed',
                image: 'https://pbs.twimg.com/profile_images/1610252835593289729/g3gYoXIt_400x400.jpg',
                twitter: 'https://x.com/Srijith_Padmesh',
              },
              {
                name: 'Adii',
                role: 'Product Manager',
                text: 'My clients love the professional public invoice links. Payment tracking is seamless. Revenue collection improved significantly!',
                badge: 'revenue improved',
                image: 'https://pbs.twimg.com/profile_images/1905879296629223425/-uhwqdFJ_400x400.jpg',
                twitter: 'https://x.com/adiiHQ',
              },
              {
                name: 'Krypto',
                role: 'Developer',
                text: 'The speed and quality are incredible. Self-hosting gives me full control. Perfect for developers who value privacy.',
                badge: 'full control',
                image: 'https://pbs.twimg.com/profile_images/1526844822895869952/uD7JqSVM_400x400.jpg',
                twitter: 'https://x.com/0xkryptocodes',
              },
              {
                name: 'Preetham Amin',
                role: 'UI/UX Designer',
                text: 'Perfect for freelancers like me! Beautiful templates and the interface is so intuitive. Clients are always impressed.',
                badge: 'clients impressed',
                image: 'https://pbs.twimg.com/profile_images/1618643349396918273/um7jU_f9_400x400.jpg',
                twitter: 'https://x.com/PreethamAmin__',
              },
              {
                name: 'Koushith Amin',
                role: 'Software Engineer',
                text: 'Being open source means I can customize it for my needs. The codebase is clean and well-documented. Brilliant solution.',
                badge: 'brilliant solution',
                image: 'https://pbs.twimg.com/profile_images/1981055175495221248/S1OcF1F0_400x400.jpg',
                twitter: 'https://x.com/KoushithAmin',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="group">
                <div className="relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#635BFF] rounded-full flex items-center justify-center">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={`${testimonial.name} - ${testimonial.role}`}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <div>
                      <a
                        href={testimonial.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {testimonial.name}
                      </a>
                      <p className="text-sm font-medium text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-[#635BFF] text-white text-xs font-bold rounded-full transform rotate-3">
                    {testimonial.badge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <span className="text-sm font-semibold text-blue-800">Got Questions?</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl font-medium text-gray-600">Everything you need to know about DefInvoice</p>
          </div>
          <div className="grid gap-4">
            {[
              {
                q: 'Is DefInvoice really open source?',
                a: 'Yes! 100% open source on GitHub. You can view the code, contribute, and self-host on your own infrastructure with complete control.',
              },
              {
                q: 'Can I self-host DefInvoice?',
                a: 'Absolutely! DefInvoice is designed to be self-hosted. Deploy on your own server with Docker, VPS, or cloud provider. Your data stays with you.',
              },
              {
                q: 'What about the hosted version?',
                a: 'We offer a hosted version for convenience. Same great features without the hassle of managing infrastructure. You can switch anytime.',
              },
              {
                q: 'Do you support payment integrations?',
                a: "Currently, you can record payments manually. We're working on integrating fiat and crypto payment gateways in future updates!",
              },
            ].map((faq, idx) => (
              <div key={idx} className="group">
                <div className="relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden border-gray-200 hover:border-gray-300 hover:shadow-md">
                  <button className="w-full p-6 text-left flex justify-between items-start gap-4 hover:bg-gray-50 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{faq.q}</h3>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-gray-100 text-gray-600 group-hover:bg-gray-200">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  <div className="px-6 pb-6">
                    <div className="w-full h-px bg-gradient-to-r from-gray-200 to-transparent mb-4"></div>
                    <p className="text-base font-medium text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#635BFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-10">Transform your invoicing in minutes, not hours</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#635BFF] font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 text-lg"
          >
            Start For Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Left side - Branding */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#635BFF] rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">D</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">DefInvoice</h3>
              </div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Full-fledged open source billing, payment, and invoicing solution. Built by developers, for developers.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/Koushith/DefinVoice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                >
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="font-semibold text-gray-900">Star on GitHub</span>
                </a>
              </div>
            </div>

            {/* Right side - Quick Links */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/Koushith/DefinVoice#readme"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="/reports" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Get Started
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Community</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://github.com/Koushith/DefinVoice"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/Koushith/DefinVoice/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Report Issue
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/Koushith/DefinVoice/blob/main/CONTRIBUTING.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Contribute
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2025 DefInvoice. Open source under MIT License.</p>
            <div className="flex items-center gap-3">
              <a
                href="https://koushith.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1 bg-[#635BFF]/10 hover:bg-[#635BFF]/20 rounded-full border border-[#635BFF]/30 transition-colors"
              >
                <span className="text-xs font-semibold text-[#635BFF]">Built by Koushith</span>
              </a>
              <a
                href="https://github.com/Koushith/DefinVoice"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

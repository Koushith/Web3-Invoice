import { Heart, Code, Coffee, Github, Linkedin, Globe, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

// Twitter/X Icon Component
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const AboutScreen = () => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const cryptoAddress = '0x9ccca0a968a9bc5916e0de43ea2d68321655ae67'; // Replace with your actual crypto address

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(cryptoAddress);
      setCopiedAddress(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      toast.error('Failed to copy address');
    }
  };

  const socialLinks = [
    {
      name: 'Website',
      url: 'https://koushith.in',
      icon: <Globe className="w-5 h-5" />,
      color: 'text-gray-700 hover:text-gray-900',
      bg: 'bg-gray-100 hover:bg-gray-200',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/koushith',
      icon: <Github className="w-5 h-5" />,
      color: 'text-gray-700 hover:text-gray-900',
      bg: 'bg-gray-100 hover:bg-gray-200',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/koushith',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'text-blue-600 hover:text-blue-700',
      bg: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/koushithamin',
      icon: <XIcon />,
      color: 'text-gray-700 hover:text-gray-900',
      bg: 'bg-gray-100 hover:bg-gray-200',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#635BFF] to-[#7C75FF] rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">About DefInvoice</h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Learn about the project and the person behind it
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* About the Project */}
        <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-[#635BFF]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">The Project</h2>
          </div>
          <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
            <p>
              DefInvoice is a passion project built with the vision of making professional invoicing accessible to
              everyone. Whether you're a freelancer, small business owner, or just getting started, you deserve tools
              that work beautifully without breaking the bank.
            </p>
            <p>
              As a solo developer, I'm committed to building something genuinely useful and maintaining it for the long
              haul. This isn't a quick side project—it's a long-term commitment to creating value for the community.
            </p>
            <p className="font-medium text-gray-700">What makes DefInvoice special:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Beautiful, professional invoice templates</li>
              <li>Clean, intuitive interface that just works</li>
              <li>Public invoice hosting for easy sharing</li>
              <li>Future-ready for crypto payments (stablecoins)</li>
              <li>Built with care, attention to detail, and user feedback</li>
            </ul>
          </div>
        </div>

        {/* Developer Info */}
        <div className="bg-gradient-to-br from-[#635BFF]/5 to-[#7C75FF]/5 border border-[#635BFF]/20 rounded-2xl md:rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Coffee className="w-5 h-5 text-[#635BFF]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">About Me</h2>
          </div>
          <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
            <p>
              Hi! I'm Koushith, a developer who believes in building tools that solve real problems. DefInvoice started
              from a personal need—wanting a simple, beautiful way to create and send invoices without the complexity
              (or price tag) of existing solutions.
            </p>
            <p>
              I'm building this in public, iterating based on feedback, and committed to keeping it accessible. Your
              feedback, bug reports, and feature requests directly shape the product roadmap.
            </p>
          </div>

          {/* Social Links */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Connect with me:</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${link.bg} ${link.color} transition-all active:scale-95`}
                >
                  {link.icon}
                  <span className="text-sm font-medium">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl md:rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Support the Project</h2>
          </div>
          <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
            <p>
              DefInvoice is free to use and will remain that way. If you find it valuable and want to support its
              continued development, you can contribute via cryptocurrency. Every contribution helps with hosting costs,
              development time, and adding new features.
            </p>
            <p className="text-xs text-gray-500">
              Whether you contribute or not, I'm grateful you're using DefInvoice. Your support—financial or
              otherwise—means the world and helps keep this project alive and growing for everyone.
            </p>

            {/* Crypto Address */}
            <div className="mt-4 p-4 bg-white rounded-xl border border-green-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Crypto Address (ETH/Stablecoins):</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs md:text-sm bg-gray-50 px-3 py-2 rounded-lg text-gray-700 font-mono break-all">
                  {cryptoAddress}
                </code>
                <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="flex-shrink-0">
                  {copiedAddress ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm font-medium text-blue-900 mb-2">Other ways to help:</p>
              <ul className="space-y-1.5 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Share DefInvoice with others who might find it useful</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Report bugs and suggest features via Feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Star the project on GitHub if you're a developer</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-4 pb-2">
          <p className="text-sm text-gray-500">
            Built with care by a solo developer. Thank you for being part of this journey.
          </p>
        </div>
      </div>
    </div>
  );
};

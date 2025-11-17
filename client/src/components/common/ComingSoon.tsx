import { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Rocket, Clock } from 'lucide-react';

interface ComingSoonProps {
  children: ReactNode;
  feature?: string;
}

export function ComingSoon({ children, feature }: ComingSoonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative inline-block cursor-help">
          {children}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#635BFF] to-[#7C75FF] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            <Clock className="w-3 h-3 text-white" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="center">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#635BFF] to-[#7C75FF] rounded-lg flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Coming Soon!</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {feature ? (
              <>
                <span className="font-medium text-gray-900">{feature}</span> is currently under development
                and will be shipped in upcoming releases.
              </>
            ) : (
              "This feature is currently under development and will be shipped in upcoming releases."
            )}
          </p>
          <div className="pt-2 border-t border-gray-100">
            <p className="text-[10px] text-gray-500">
              We're rolling out features in batches to ensure quality and stability.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Disabled version - makes the wrapped element look disabled and adds popover
interface ComingSoonDisabledProps {
  children: ReactNode;
  feature?: string;
}

export function ComingSoonDisabled({ children, feature }: ComingSoonDisabledProps) {
  return (
    <ComingSoon feature={feature}>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </ComingSoon>
  );
}

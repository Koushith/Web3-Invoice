import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { currencies, popularCurrencies } from '@/data/currencies';

interface CurrencyComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function CurrencyCombobox({ value, onValueChange, className }: CurrencyComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCurrency = currencies.find((c) => c.code === value);

  // Filter currencies based on search query
  const filteredCurrencies = searchQuery
    ? currencies.filter(
        (currency) =>
          currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          currency.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currencies.filter((c) => popularCurrencies.includes(c.code)); // Show only popular by default

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('h-9 justify-between text-sm', className)}
        >
          {selectedCurrency
            ? `${selectedCurrency.code} - ${selectedCurrency.name}`
            : 'Select currency...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search currency..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {!searchQuery && (
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                  Popular Currencies
                </div>
              )}
              {filteredCurrencies.map((currency) => (
                <CommandItem
                  key={currency.code}
                  value={currency.code}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue.toUpperCase());
                    setOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === currency.code ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="flex-1">
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-gray-600"> - {currency.name}</span>
                  </span>
                  <span className="text-gray-500 text-sm">{currency.symbol}</span>
                </CommandItem>
              ))}
              {searchQuery && filteredCurrencies.length > 0 && (
                <div className="px-2 py-1.5 text-xs text-gray-500 border-t">
                  Showing {filteredCurrencies.length} result{filteredCurrencies.length !== 1 ? 's' : ''}
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

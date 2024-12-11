import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export const NewCustomerScreen = () => {
  return (
    <div className="mx-auto max-w-4xl py-12 px-4">
      <div className="mb-12">
        <h1 className="text-2xl/8 font-semibold text-zinc-950 dark:text-white">New Customer</h1>
        <p className="mt-2 text-base text-muted-foreground">Add a new customer to start creating crypto invoices</p>
      </div>

      <div className="space-y-10">
        {/* Basic Info Section */}
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <h2 className="text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white">Basic Information</h2>
            <p className="text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
              Enter the customer's basic details and contact information.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Company / Customer name
              </Label>
              <Input
                id="name"
                placeholder="Acme Inc."
                className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="invoicing@acme.com"
                className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10"
              />
            </div>

            <div>
              <Label htmlFor="tax_id" className="text-sm font-medium">
                Tax ID / VAT number
              </Label>
              <Input
                id="tax_id"
                placeholder="XX-XXXXXXX"
                className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10"
              />
            </div>
          </div>
        </section>

        <Separator className="bg-border/60" />

        {/* Crypto Payment Settings */}
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <h2 className="text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white">
              Payment Preferences
            </h2>
            <p className="text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
              Set up the customer's preferred cryptocurrency payment methods.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="default_chain" className="text-sm font-medium">
                Default Blockchain
              </Label>
              <Select>
                <SelectTrigger className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10">
                  <SelectValue placeholder="Select preferred blockchain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="bsc">BSC</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="wallet_address" className="text-sm font-medium">
                Default Wallet Address
              </Label>
              <Input
                id="wallet_address"
                placeholder="0x..."
                className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10"
              />
            </div>

            <div>
              <Label htmlFor="preferred_currency" className="text-sm font-medium">
                Preferred Settlement Currency
              </Label>
              <Select>
                <SelectTrigger className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10">
                  <SelectValue placeholder="Select preferred currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usdc">USDC</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                  <SelectItem value="eth">ETH</SelectItem>
                  <SelectItem value="dai">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <Separator className="bg-border/60" />

        {/* Billing Address Section */}
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <h2 className="text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white">Billing Details</h2>
            <p className="text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
              Required for tax and compliance purposes.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                Street address
              </Label>
              <Input
                id="address"
                placeholder="123 Main St"
                className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="San Francisco"
                  className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium">
                  State / Province
                </Label>
                <Input
                  id="state"
                  placeholder="CA"
                  className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="postal_code" className="text-sm font-medium">
                  ZIP / Postal code
                </Label>
                <Input
                  id="postal_code"
                  placeholder="94103"
                  className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium">
                  Country
                </Label>
                <Input
                  id="country"
                  placeholder="United States"
                  className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10"
                />
              </div>
            </div>
          </div>
        </section>

        <Separator className="bg-border/60" />

        {/* Invoice Preferences */}
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <h2 className="text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white">Invoice Settings</h2>
            <p className="text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
              Customize how invoices are handled for this customer.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="payment_terms" className="text-sm font-medium">
                Payment Terms
              </Label>
              <Select>
                <SelectTrigger className="mt-1.5 h-11 border-zinc-950/10 bg-transparent dark:border-white/10">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                  <SelectItem value="net_15">Net 15</SelectItem>
                  <SelectItem value="net_30">Net 30</SelectItem>
                  <SelectItem value="net_60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="auto_convert" />
                <Label htmlFor="auto_convert" className="text-sm font-medium">
                  Enable automatic fiat conversion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="tax_exempt" />
                <Label htmlFor="tax_exempt" className="text-sm font-medium">
                  Tax exempt customer
                </Label>
              </div>
            </div>
          </div>
        </section>

        <Separator className="bg-border/60" />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" className="h-11 px-6 border-zinc-950/10 dark:border-white/10">
            Cancel
          </Button>
          <Button className="h-11 px-6">Create Customer</Button>
        </div>
      </div>
    </div>
  );
};

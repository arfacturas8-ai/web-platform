import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { WaitTimeBadge } from '@/components/waitlist/WaitTimeBadge';
import { FloatingLanguageSelector } from '@/components/layout/PublicHeader';
import { Users, Phone, Mail, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useWaitlistEstimate, useJoinWaitlist } from '@/hooks/useWaitlist';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * WaitlistKiosk - Self-service kiosk for customers to join waitlist
 * Optimized for touchscreen displays
 */
export const WaitlistKiosk = () => {
  const [step, setStep] = useState<'welcome' | 'form' | 'success'>('welcome');
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    party_size: 2,
    preferred_seating: ''
  });
  const [quoteNumber, setQuoteNumber] = useState('');

  const { data: estimate, isLoading: estimateLoading } = useWaitlistEstimate(formData.party_size);
  const { mutate: joinWaitlist, isPending: joiningWaitlist } = useJoinWaitlist();

  const handleSubmit = () => {
    joinWaitlist(formData, {
      onSuccess: (data) => {
        setQuoteNumber(data.quote_number);
        setStep('success');
        // Reset form after 30 seconds
        setTimeout(() => {
          setStep('welcome');
          setFormData({
            customer_name: '',
            phone: '',
            email: '',
            party_size: 2,
            preferred_seating: ''
          });
        }, 30000);
      }
    });
  };

  const isFormValid = formData.customer_name && formData.phone && formData.party_size > 0;

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
        <FloatingLanguageSelector />
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardContent className="p-12 text-center">
            <Users className="h-24 w-24 text-blue-600 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Welcome to Café 1973</h1>
            <p className="text-2xl text-gray-600 mb-8">
              Join our waitlist for a table
            </p>
            <Button
              size="lg"
              className="text-2xl px-12 py-8 h-auto"
              onClick={() => setStep('form')}
            >
              Join Waitlist
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-8">
        <FloatingLanguageSelector />
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">You're on the list!</h1>

            <div className="bg-blue-100 rounded-lg p-8 my-8">
              <p className="text-xl text-gray-700 mb-2">Your quote number is</p>
              <div className="text-7xl font-bold text-blue-700">{quoteNumber}</div>
            </div>

            <div className="space-y-4 text-xl text-gray-600 mb-8">
              {estimate && (
                <div className="flex items-center justify-center gap-3">
                  <Clock className="h-6 w-6" />
                  <span>Estimated wait: <strong>{estimate.estimated_wait_minutes} minutes</strong></span>
                </div>
              )}
              <p>Party size: <strong>{formData.party_size}</strong></p>
              <p className="text-lg mt-6">
                Please watch the display for your number to be called.
              </p>
              <p className="text-lg text-gray-500">
                We'll notify you via SMS when your table is ready.
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="text-xl px-8 py-6 h-auto"
              onClick={() => setStep('welcome')}
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
      <FloatingLanguageSelector />
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setStep('welcome')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <CardTitle className="text-4xl">Join Waitlist</CardTitle>
              <CardDescription className="text-xl mt-2">
                Please provide your information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {/* Party Size */}
          <div className="space-y-3">
            <Label className="text-xl">Party Size *</Label>
            <RadioGroup
              value={formData.party_size.toString()}
              onValueChange={(value) => setFormData({ ...formData, party_size: parseInt(value) })}
              className="grid grid-cols-4 gap-4"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                <div key={size}>
                  <RadioGroupItem
                    value={size.toString()}
                    id={`size-${size}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`size-${size}`}
                    className="flex items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-6 text-2xl font-semibold hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 cursor-pointer"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {estimate && !estimateLoading && (
              <Alert className="bg-blue-50 border-blue-200">
                <Clock className="h-5 w-5" />
                <AlertDescription className="text-lg">
                  Estimated wait time: <WaitTimeBadge minutes={estimate.estimated_wait_minutes} />
                  <span className="ml-2 text-gray-600">
                    ({estimate.parties_ahead} {estimate.parties_ahead === 1 ? 'party' : 'parties'} ahead)
                  </span>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Name */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-xl">Name *</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="text-xl p-6 h-auto"
              autoComplete="name"
            />
          </div>

          {/* Phone */}
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-xl">Phone Number *</Label>
            <div className="flex gap-3">
              <Phone className="h-6 w-6 self-center text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="text-xl p-6 h-auto flex-1"
                autoComplete="tel"
              />
            </div>
            <p className="text-sm text-gray-500">We'll text you when your table is ready</p>
          </div>

          {/* Email (Optional) */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-xl">Email (Optional)</Label>
            <div className="flex gap-3">
              <Mail className="h-6 w-6 self-center text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-xl p-6 h-auto flex-1"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Seating Preference */}
          <div className="space-y-3">
            <Label className="text-xl">Seating Preference (Optional)</Label>
            <RadioGroup
              value={formData.preferred_seating}
              onValueChange={(value) => setFormData({ ...formData, preferred_seating: value })}
              className="grid grid-cols-3 gap-4"
            >
              {['indoor', 'outdoor', 'patio'].map((pref) => (
                <div key={pref}>
                  <RadioGroupItem
                    value={pref}
                    id={`pref-${pref}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`pref-${pref}`}
                    className="flex items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-4 text-lg capitalize hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 cursor-pointer"
                  >
                    {pref}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Submit */}
          <Button
            size="lg"
            className="w-full text-2xl py-8 h-auto mt-8"
            onClick={handleSubmit}
            disabled={!isFormValid || joiningWaitlist}
          >
            {joiningWaitlist ? <LoadingSpinner text="Joining..." /> : 'Join Waitlist'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

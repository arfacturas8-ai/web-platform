import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useToast } from '@/components/ui/toast';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import type { Settings as SettingsType } from '@/types/user';
import { QRCodeGenerator } from '@/components/admin/QRCodeGenerator';

export const Settings = () => {
  const { toast } = useToast();
  const { data: settings, isLoading, error, refetch } = useSettings();
  const updateSettings = useUpdateSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Partial<SettingsType>>({
    values: settings,
  });

  const onSubmit = async (data: Partial<SettingsType>) => {
    try {
      await updateSettings.mutateAsync(data);
      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update settings',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading settings..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load settings"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage restaurant settings and configuration
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Basic information about your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant_name">Restaurant Name (English) *</Label>
                <Input
                  id="restaurant_name"
                  {...register('restaurant_name', {
                    required: 'Restaurant name is required',
                  })}
                />
                {errors.restaurant_name && (
                  <p className="text-sm text-destructive">
                    {errors.restaurant_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="restaurant_name_es">Restaurant Name (Spanish)</Label>
                <Input id="restaurant_name_es" {...register('restaurant_name_es')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                {...register('address', { required: 'Address is required' })}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  {...register('contact_email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.contact_email && (
                  <p className="text-sm text-destructive">
                    {errors.contact_email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone *</Label>
                <Input
                  id="contact_phone"
                  {...register('contact_phone', {
                    required: 'Phone is required',
                  })}
                />
                {errors.contact_phone && (
                  <p className="text-sm text-destructive">
                    {errors.contact_phone.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reservation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Reservation Settings</CardTitle>
            <CardDescription>
              Configure reservation rules and policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reservation_duration_minutes">
                  Reservation Duration (minutes)
                </Label>
                <Input
                  id="reservation_duration_minutes"
                  type="number"
                  {...register('reservation_duration_minutes', {
                    valueAsNumber: true,
                    min: { value: 30, message: 'Minimum 30 minutes' },
                  })}
                />
                {errors.reservation_duration_minutes && (
                  <p className="text-sm text-destructive">
                    {errors.reservation_duration_minutes.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="advance_booking_days">
                  Advance Booking Days
                </Label>
                <Input
                  id="advance_booking_days"
                  type="number"
                  {...register('advance_booking_days', {
                    valueAsNumber: true,
                    min: { value: 1, message: 'Minimum 1 day' },
                  })}
                />
                {errors.advance_booking_days && (
                  <p className="text-sm text-destructive">
                    {errors.advance_booking_days.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation_hours">
                  Cancellation Notice (hours)
                </Label>
                <Input
                  id="cancellation_hours"
                  type="number"
                  {...register('cancellation_hours', {
                    valueAsNumber: true,
                    min: { value: 1, message: 'Minimum 1 hour' },
                  })}
                />
                {errors.cancellation_hours && (
                  <p className="text-sm text-destructive">
                    {errors.cancellation_hours.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Third-Party Integrations</CardTitle>
            <CardDescription>
              Configure external services and integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* TripAdvisor Section */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="text-sm font-semibold">TripAdvisor</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tripadvisor_url">TripAdvisor Profile URL</Label>
                  <Input
                    id="tripadvisor_url"
                    placeholder="https://www.tripadvisor.com/..."
                    {...register('tripadvisor_url')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your restaurant's TripAdvisor page URL
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tripadvisor_rating">TripAdvisor Rating</Label>
                  <Input
                    id="tripadvisor_rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="4.5"
                    {...register('tripadvisor_rating', {
                      valueAsNumber: true,
                      min: { value: 0, message: 'Minimum 0' },
                      max: { value: 5, message: 'Maximum 5' },
                    })}
                  />
                  {errors.tripadvisor_rating && (
                    <p className="text-sm text-destructive">
                      {errors.tripadvisor_rating.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* OpenTable Section */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="text-sm font-semibold">OpenTable</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opentable_restaurant_id">OpenTable Restaurant ID</Label>
                  <Input
                    id="opentable_restaurant_id"
                    placeholder="123456"
                    {...register('opentable_restaurant_id')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your restaurant ID from OpenTable
                  </p>
                </div>
                <div className="space-y-2 flex items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="opentable_enabled"
                      {...register('opentable_enabled')}
                    />
                    <Label htmlFor="opentable_enabled" className="cursor-pointer">
                      Enable OpenTable integration
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="text-sm font-semibold">Navigation & Location</h3>
              <div className="space-y-2">
                <Label htmlFor="waze_address">Waze Address</Label>
                <Textarea
                  id="waze_address"
                  placeholder="123 Main Street, City, State, ZIP"
                  {...register('waze_address')}
                />
                <p className="text-xs text-muted-foreground">
                  Full address for Waze navigation (if different from main address)
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_latitude">Latitude</Label>
                  <Input
                    id="business_latitude"
                    type="number"
                    step="0.000001"
                    placeholder="40.7128"
                    {...register('business_latitude', {
                      valueAsNumber: true,
                      min: { value: -90, message: 'Invalid latitude' },
                      max: { value: 90, message: 'Invalid latitude' },
                    })}
                  />
                  {errors.business_latitude && (
                    <p className="text-sm text-destructive">
                      {errors.business_latitude.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_longitude">Longitude</Label>
                  <Input
                    id="business_longitude"
                    type="number"
                    step="0.000001"
                    placeholder="-74.0060"
                    {...register('business_longitude', {
                      valueAsNumber: true,
                      min: { value: -180, message: 'Invalid longitude' },
                      max: { value: 180, message: 'Invalid longitude' },
                    })}
                  />
                  {errors.business_longitude && (
                    <p className="text-sm text-destructive">
                      {errors.business_longitude.message}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                GPS coordinates for precise navigation (optional but recommended)
              </p>
            </div>

            {/* Social Media Section */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="text-sm font-semibold">Social Media</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook_url">Facebook Page URL</Label>
                  <Input
                    id="facebook_url"
                    placeholder="https://www.facebook.com/..."
                    {...register('facebook_url', {
                      pattern: {
                        value: /^https?:\/\/(www\.)?facebook\.com\/.+/i,
                        message: 'Please enter a valid Facebook URL',
                      },
                    })}
                  />
                  {errors.facebook_url && (
                    <p className="text-sm text-destructive">
                      {errors.facebook_url.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Instagram Profile URL</Label>
                  <Input
                    id="instagram_url"
                    placeholder="https://www.instagram.com/..."
                    {...register('instagram_url', {
                      pattern: {
                        value: /^https?:\/\/(www\.)?instagram\.com\/.+/i,
                        message: 'Please enter a valid Instagram URL',
                      },
                    })}
                  />
                  {errors.instagram_url && (
                    <p className="text-sm text-destructive">
                      {errors.instagram_url.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter_url">Twitter/X Profile URL</Label>
                  <Input
                    id="twitter_url"
                    placeholder="https://twitter.com/..."
                    {...register('twitter_url', {
                      pattern: {
                        value: /^https?:\/\/(www\.)?(twitter|x)\.com\/.+/i,
                        message: 'Please enter a valid Twitter/X URL',
                      },
                    })}
                  />
                  {errors.twitter_url && (
                    <p className="text-sm text-destructive">
                      {errors.twitter_url.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number">WhatsApp Business Number</Label>
                  <Input
                    id="whatsapp_number"
                    type="tel"
                    placeholder="+1234567890"
                    {...register('whatsapp_number', {
                      pattern: {
                        value: /^\+?[1-9]\d{1,14}$/,
                        message: 'Please enter a valid phone number with country code',
                      },
                    })}
                  />
                  {errors.whatsapp_number && (
                    <p className="text-sm text-destructive">
                      {errors.whatsapp_number.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Include country code (e.g., +1 for US)
                  </p>
                </div>
              </div>
            </div>

            {/* Google Reviews Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Google Reviews</h3>
              <div className="space-y-2">
                <Label htmlFor="google_place_id">Google Place ID</Label>
                <Input
                  id="google_place_id"
                  type="text"
                  placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                  {...register('google_place_id')}
                />
                <p className="text-xs text-muted-foreground">
                  Find your Google Place ID at{' '}
                  <a
                    href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Place ID Finder
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      {/* QR Code Generator Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">QR Codes</h2>
          <p className="text-muted-foreground">
            Generate QR codes for menu and reservations
          </p>
        </div>
        <QRCodeGenerator />
      </div>
    </div>
  );
};

export default Settings;

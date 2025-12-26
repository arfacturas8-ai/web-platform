/**
 * Café 1973 | Bakery - Login Page
 * Admin/Staff login
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@/lib/router';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { MobileNavBar } from '@/components/menu/MobileNavBar';
import { FloatingLanguageSelector } from '@/components/layout/PublicHeader';
import { Coffee, Lock, User, ChevronLeft } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const translations = {
  en: {
    back: 'Back',
    staffAccess: 'Staff Access',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    signingIn: 'Signing in...',
    signIn: 'Sign In',
    forgotPassword: 'Forgot your password?',
    contactUs: 'Contact us',
    backToHome: '← Back to home',
    invalidCredentials: 'Invalid username or password',
  },
  es: {
    back: 'Volver',
    staffAccess: 'Acceso del Personal',
    email: 'Correo Electrónico',
    emailPlaceholder: 'tu@email.com',
    password: 'Contraseña',
    signingIn: 'Ingresando...',
    signIn: 'Ingresar',
    forgotPassword: '¿Olvidaste tu contraseña?',
    contactUs: 'Contáctanos',
    backToHome: '← Volver al inicio',
    invalidCredentials: 'Usuario o contraseña inválidos',
  },
  it: {
    back: 'Indietro',
    staffAccess: 'Accesso del Personale',
    email: 'Email',
    emailPlaceholder: 'tua@email.com',
    password: 'Password',
    signingIn: 'Accedendo...',
    signIn: 'Accedi',
    forgotPassword: 'Hai dimenticato la password?',
    contactUs: 'Contattaci',
    backToHome: '← Torna alla home',
    invalidCredentials: 'Nome utente o password non validi',
  },
  de: {
    back: 'Zurück',
    staffAccess: 'Personalzugang',
    email: 'E-Mail',
    emailPlaceholder: 'deine@email.com',
    password: 'Passwort',
    signingIn: 'Anmelden...',
    signIn: 'Anmelden',
    forgotPassword: 'Passwort vergessen?',
    contactUs: 'Kontaktiere uns',
    backToHome: '← Zurück zur Startseite',
    invalidCredentials: 'Ungültiger Benutzername oder Passwort',
  },
  fr: {
    back: 'Retour',
    staffAccess: 'Accès du Personnel',
    email: 'Email',
    emailPlaceholder: 'votre@email.com',
    password: 'Mot de passe',
    signingIn: 'Connexion...',
    signIn: 'Se connecter',
    forgotPassword: 'Mot de passe oublié?',
    contactUs: 'Contactez-nous',
    backToHome: '← Retour à l\'accueil',
    invalidCredentials: 'Nom d\'utilisateur ou mot de passe invalide',
  },
  sv: {
    back: 'Tillbaka',
    staffAccess: 'Personalåtkomst',
    email: 'E-post',
    emailPlaceholder: 'din@email.com',
    password: 'Lösenord',
    signingIn: 'Loggar in...',
    signIn: 'Logga in',
    forgotPassword: 'Glömt ditt lösenord?',
    contactUs: 'Kontakta oss',
    backToHome: '← Tillbaka till start',
    invalidCredentials: 'Ogiltigt användarnamn eller lösenord',
  },
};

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { language } = useLanguage();
  const [error, setError] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  const t = translations[language as keyof typeof translations] || translations.en;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setIsLoading(true);
      await login(data);
    } catch (err) {
      setError(t.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] pb-24">
      {/* Floating Language Selector */}
      <FloatingLanguageSelector />

      {/* Header */}
      <header className="px-4 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-forest/60 hover:text-forest transition-colors"
        >
          <ChevronLeft size={18} />
          <span className="text-sm">{t.back}</span>
        </Link>
      </header>

      {/* Login Form */}
      <main className="flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-forest rounded-full mb-4">
            <Coffee className="w-8 h-8 text-sand" />
          </div>
          <h1 className="text-2xl font-bold text-forest">Café 1973</h1>
          <p className="text-forest/60 text-sm">{t.staffAccess}</p>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-soft">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-espresso/10 text-espresso px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">
                {t.email}
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
                <input
                  type="email"
                  {...register('username')}
                  placeholder={t.emailPlaceholder}
                  className="w-full pl-11 pr-4 py-3 bg-[#faf8f3] rounded-xl border border-sand-200 text-forest placeholder:text-forest/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10"
                />
              </div>
              {errors.username && (
                <p className="text-sm text-espresso mt-1.5">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">
                {t.password}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-[#faf8f3] rounded-xl border border-sand-200 text-forest placeholder:text-forest/40 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-espresso mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-forest text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-forest/90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.signingIn}</span>
                </>
              ) : (
                <span>{t.signIn}</span>
              )}
            </button>
          </form>

          {/* Forgot Password */}
          <p className="text-center text-sm text-forest/60 mt-6">
            {t.forgotPassword}
            {' '}
            <a href="#" className="text-forest font-medium hover:underline">
              {t.contactUs}
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <Link
          to="/"
          className="mt-8 text-sm text-forest/60 hover:text-forest transition-colors"
        >
          {t.backToHome}
        </Link>
      </main>

      <MobileNavBar />
    </div>
  );
};

export default Login;

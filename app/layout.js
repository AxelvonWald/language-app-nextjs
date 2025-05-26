import { dir } from 'i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import './globals.css';

export const metadata = {
  title: 'Language App',
  description: 'Learn languages effectively',
};

export async function generateStaticParams() {
  return [
    { lng: 'en' },
    { lng: 'es' }
  ];
}

export default function RootLayout({ children, params }) {
  const { lng } = params;
  
  return (
    <html lang={lng} dir={dir(lng)}>
      <body>
        <header className="p-4 flex justify-end">
          <LanguageSwitcher lng={lng} />
        </header>
        {children}
      </body>
    </html>
  );
}
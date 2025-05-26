'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';

export default function LanguageSwitcher({ lng }) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale) => {
    const newPath = pathname.replace(`/${lng}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded ${lng === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        English
      </button>
      <button 
        onClick={() => changeLanguage('es')}
        className={`px-3 py-1 rounded ${lng === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Español
      </button>
    </div>
  );
}
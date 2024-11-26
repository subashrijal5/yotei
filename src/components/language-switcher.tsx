"use client";
import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ja" : "en";

    if (pathname.startsWith(`/${locale}`)) {
      const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.push(newPathname);
    }

  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle language"
    >
      <Languages className="h-5 w-5" />
      <span className="text-sm font-medium">{locale.toUpperCase()}</span>
    </button>
  );
}

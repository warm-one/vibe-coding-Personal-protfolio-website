import { defaultLang, locales, ui, type Lang, type UIKey } from "./ui";

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split("/");
  return (locales as readonly string[]).includes(first)
    ? (first as Lang)
    : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

export function getAlternatePath(url: URL, target: Lang): string {
  const current = getLangFromUrl(url);
  let path = url.pathname;
  if (current !== defaultLang) {
    path = path.slice(`/${current}`.length) || "/";
  }
  return localizePath(path, target);
}

export function getLangStaticPaths() {
  return [
    { params: { lang: undefined } },
    ...locales
      .filter((locale) => locale !== defaultLang)
      .map((locale) => ({ params: { lang: locale } })),
  ];
}

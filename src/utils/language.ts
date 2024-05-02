import { i18n } from "i18next";
import { unicodeCLDRtoBCP47 } from "@/shared/utils/date";

/**
 * Detects the user's language based on the browser's language settings.
 *
 * @returns The user's language in CLDR format (en_US)
 */
export function detectLanguage() {
  const [ln, r] = navigator.language.split("-");
  const region = (r || ln).toUpperCase();
  return `${ln}_${region}`;
}

/**
 * Changes the language of the app, and updates the spellchecker language
 * if running in the desktop shell.
 *
 * @param locale The locale to change to, in CLDR format (en_US)
 * @param i18n The i18n instance to use
 */
export async function changeLanguage(
  locale: string | null | undefined,
  i18n: i18n
) {
  // Languages are stored in en_US format in the database, however the
  // frontend translation framework (i18next) expects en-US
  const localeBCP = locale ? unicodeCLDRtoBCP47(locale) : undefined;

  if (localeBCP && i18n.languages?.[0] !== localeBCP) {
    await i18n.changeLanguage(localeBCP);
  }
}

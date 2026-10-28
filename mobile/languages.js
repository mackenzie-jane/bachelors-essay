// The backend returns codes like es, but your design shows “Spanish.”
// This provides support to convert between front and backend
const NAMES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  ar: "Arabic",
  zh: "Chinese",
  sw: "Swahili",
  und: "Original",
};

export function languageName(code) {
  if (!code) return "—";
  return NAMES[code] ?? NAMES[code.split("-")[0]] ?? code;
}

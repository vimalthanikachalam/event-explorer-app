import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

const i18n = new I18n();

i18n.enableFallback = true;
i18n.defaultLocale = "en";

const en = {
  home: "Home",
  events: "Events",
  profile: "Profile",
  search_placeholder: "Search events",
  city_placeholder: "City",
  search: "Search",
  featured: "Featured",
  favorites: "Favorites",
  no_favorites: "You haven't added any favorites yet.",
  sign_out: "Sign out",
  enable_biometrics: "Enable Biometric Login",
  explore: "Start exploring events",
  you_are_signed_in: "You are signed in",
  details: "Details",
  view_details: "View details",
  language: "Language",
  english: "الإنجليزية",
  arabic: "العربية",
  event_details: "Event Details",
  book_tickets: "Book Tickets",
};

const ar = {
  home: "الصفحة الرئيسية",
  events: "الفعاليات",
  profile: "الملف الشخصي",
  search_placeholder: "ابحث عن فعاليات",
  city_placeholder: "المدينة",
  search: "بحث",
  featured: "مميزة",
  favorites: "المفضلة",
  no_favorites: "لم تقم بإضافة أي مفضلة بعد.",
  sign_out: "تسجيل الخروج",
  enable_biometrics: "تفعيل تسجيل الدخول البيومتري",
  explore: "ابدأ في استكشاف الفعاليات",
  you_are_signed_in: "لقد سجّلت الدخول",
  details: "التفاصيل",
  view_details: "عرض التفاصيل",
  language: "اللغة",
  english: "English",
  arabic: "Arabic",
  event_details: "تفاصيل الحدث",
  book_tickets: "احجز التذاكر",
};

i18n.translations = { en, ar } as const;

const sysLocale = Localization.getLocales?.()[0]?.languageCode || "en";
i18n.locale = sysLocale.startsWith("ar") ? "ar" : "en";

export default i18n;
export type Locale = "en" | "ar";

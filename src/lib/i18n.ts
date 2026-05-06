import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "notifications": "Notifications",
          "no_notifications": "No notifications yet",
          "view_all": "View all notifications",
          "profile": "Profile",
          "settings": "Settings",
          "sign_out": "Sign Out",
          "search": "Search (Ctrl + K)",
          "language": "Language",
          "edit_profile": "Edit Profile",
          "support_help": "Support Help",
          "account": "Account"
        }
      },
      hi: {
        translation: {
          "notifications": "सूचनाएं",
          "no_notifications": "अभी तक कोई सूचना नहीं",
          "view_all": "सभी सूचनाएं देखें",
          "profile": "प्रोफ़ाइल",
          "settings": "सेटिंग्स",
          "sign_out": "साइन आउट",
          "search": "खोजें (Ctrl + K)",
          "language": "भाषा",
          "edit_profile": "प्रोफ़ाइल संपादित करें",
          "support_help": "सहायता",
          "account": "खाता"
        }
      },
      fr: {
        translation: {
          "notifications": "Notifications",
          "no_notifications": "Aucune notification pour le moment",
          "view_all": "Voir toutes les notifications",
          "profile": "Profil",
          "settings": "Paramètres",
          "sign_out": "Se déconnecter",
          "search": "Rechercher (Ctrl + K)",
          "language": "Langue",
          "edit_profile": "Modifier le profil",
          "support_help": "Aide et support",
          "account": "Compte"
        }
      },
      es: {
        translation: {
          "notifications": "Notificaciones",
          "no_notifications": "No hay notificaciones aún",
          "view_all": "Ver todas las notificaciones",
          "profile": "Perfil",
          "settings": "Ajustes",
          "sign_out": "Cerrar sesión",
          "search": "Buscar (Ctrl + K)",
          "language": "Idioma",
          "edit_profile": "Editar perfil",
          "support_help": "Ayuda y soporte",
          "account": "Cuenta"
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

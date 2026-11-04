/**
 * Taskote — Centralized WhatsApp Business & Contact Launch Configuration
 *
 * This file centralizes the WhatsApp Business phone number, public business email,
 * and message generation logic. Do not duplicate phone numbers or message strings across the codebase.
 *
 * Configuration Instructions:
 * - `phoneNumber`: Official WhatsApp Business number (default: 919526063667)
 *   or set environment variable `TASKOTE_WHATSAPP_NUMBER`.
 * - `CONTACT_EMAIL`: Intended public business email (default: official@taskote.in)
 *   or set environment variable `TASKOTE_CONTACT_EMAIL`.
 * - Format: International format digits without "+" or dashes (e.g., "919526063667").
 */

export const CONTACT_EMAIL = (process.env.TASKOTE_CONTACT_EMAIL || 'official@taskote.in').trim();

export const WHATSAPP_CONFIG = {
  // Official WhatsApp Business number for public launch:
  phoneNumber: (process.env.TASKOTE_WHATSAPP_NUMBER || '919526063667').trim(),

  placeholderValue: 'YOUR_WHATSAPP_NUMBER',

  messages: {
    en: {
      general: "Hi, I'm interested in Taskote. Could you please guide me?",
      customer: "Hi, I would like to find a service professional through Taskote.",
      professional: "Hi, I'm interested in joining Taskote as a service professional. Please share the details.",
      contact: "Hi, I have an enquiry regarding Taskote services.",
      getStartedCustomer: "Hi, I would like to find a service professional through Taskote for my home/business.",
      getStartedPro: "Hi, I'm interested in joining Taskote as a service professional. Please share the details.",
      service: (name) => `Hi, I'm interested in ${name} service through Taskote. Could you please share the details?`
    },
    ml: {
      general: "നമസ്കാരം, Taskote സർവീസുകളെക്കുറിച്ച് അറിയാൻ താല്പര്യമുണ്ട്. ദയവായി വിവരങ്ങൾ പങ്കുവെക്കാമോ?",
      customer: "നമസ്കാരം, Taskote വഴി ഒരു സർവീസ് പ്രൊഫഷണലിനെ കണ്ടെത്താൻ സഹായം വേണം.",
      professional: "നമസ്കാരം, Taskote-ൽ ഒരു സർവീസ് പ്രൊഫഷണലായി പങ്കാളിയാകാൻ താല്പര്യമുണ്ട്. കൂടുതൽ വിവരങ്ങൾ പങ്കുവെക്കാമോ?",
      contact: "നമസ്കാരം, Taskote സർവീസുകളെക്കുറിച്ച് ഒരു അന്വേഷണം നടത്താൻ താല്പര്യമുണ്ട്.",
      getStartedCustomer: "നമസ്കാരം, എന്റെ വീട്/സ്ഥാപന ആവശ്യങ്ങൾക്കായി Taskote വഴി ഒരു സർവീസ് പ്രൊഫഷണലിനെ കണ്ടെത്താൻ സഹായം വേണം.",
      getStartedPro: "നമസ്കാരം, ഒരു സർവീസ് പ്രൊഫഷണലായി Taskote-ൽ രജിസ്റ്റർ ചെയ്യാൻ താല്പര്യമുണ്ട്. വിവരങ്ങൾ പങ്കുവെക്കാമോ?",
      service: (name) => `നമസ്കാരം, Taskote വഴി ${name} സർവീസിനെക്കുറിച്ച് അറിയാൻ താല്പര്യമുണ്ട്. കൂടുതൽ വിവരങ്ങൾ പങ്കുവെക്കാമോ?`
    }
  }
};

/**
 * Checks if a real, valid WhatsApp phone number has been configured.
 * @param {string} [num]
 * @returns {boolean}
 */
export function isWhatsAppConfigured(num = WHATSAPP_CONFIG.phoneNumber) {
  if (!num) return false;
  if (num === WHATSAPP_CONFIG.placeholderValue) return false;
  const digits = String(num).replace(/[\s+-]/g, '');
  // Valid international numbers contain 8 to 15 digits and are not all zeroes
  return /^\d{8,15}$/.test(digits) && !/^0+$/.test(digits);
}

/**
 * Returns digits-only phone number if valid, or empty string if placeholder/unconfigured.
 * @returns {string}
 */
export function getCleanWhatsAppNumber() {
  if (!isWhatsAppConfigured()) return '';
  return WHATSAPP_CONFIG.phoneNumber.replace(/[\s+-]/g, '');
}

/**
 * Generates the contextual message string for an action.
 * @param {string} type - 'general' | 'customer' | 'professional' | 'contact' | 'getStartedCustomer' | 'getStartedPro' | 'service'
 * @param {string} [locale='en'] - 'en' | 'ml'
 * @param {string} [extraParam=''] - Service name when type is 'service'
 * @returns {string}
 */
export function getWhatsAppMessage(type, locale = 'en', extraParam = '') {
  const lang = locale === 'ml' ? 'ml' : 'en';
  const pack = WHATSAPP_CONFIG.messages[lang] || WHATSAPP_CONFIG.messages.en;
  if (type === 'service') {
    return pack.service(extraParam || (locale === 'ml' ? 'സർവീസ്' : 'service'));
  }
  return pack[type] || pack.general;
}

/**
 * Generates the WhatsApp click-to-chat URL using encodeURIComponent.
 * Format: https://wa.me/WHATSAPP_NUMBER?text=URL_ENCODED_MESSAGE
 *
 * If the number is unconfigured or a placeholder, returns '#whatsapp-notice'
 * to avoid publishing invalid/dummy phone numbers.
 *
 * @param {string} type
 * @param {string} [locale='en']
 * @param {string} [extraParam='']
 * @returns {string}
 */
export function buildWhatsAppUrl(type, locale = 'en', extraParam = '') {
  const cleanNumber = getCleanWhatsAppNumber();
  const msg = getWhatsAppMessage(type, locale, extraParam);
  if (!cleanNumber) {
    return '#whatsapp-notice';
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
}


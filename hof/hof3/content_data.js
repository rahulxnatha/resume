/*
 * content_data.js
 * Centralized data source for structured experience log and translatable strings.
 */

// 1. Array of simple translatable content strings
const CONTENT_STRINGS = [
  { "key": "title_hero", "en": "ENGINEER | DESIGNER | AI-AIDED MOBILITY", "de": "INGENIEUR | DESIGNER | KI-GESTÜTZTE MOBILITÄT" },
  { "key": "motto", "en": "From building systems that work to designing systems that inspire.", "de": "Von funktionierenden Systemen zu inspirierenden Designs." },
  { "key": "nav_projects", "en": "PROJECTS", "de": "PROJEKTE" },
  { "key": "nav_profile", "en": "PROFILE", "de": "PROFIL" },
  { "key": "nav_contact", "en": "CONTACT", "de": "KONTAKT" },
  { "key": "section_core", "en": "THE ANALYTICAL CORE: PRECISION MODELING", "de": "DER ANALYTISCHE KERN: PRÄZISIONSMODELLIERUNG" },
  { "key": "section_projects", "en": "THE CREATIVE LEAP: PROJECTS", "de": "DER KREATIVE SPRUNG: PROJEKTE" },
  { "key": "section_profile", "en": "PROFILE & ACADEMIC RIGOR", "de": "PROFIL & AKADEMISCHE STRENGE" },
  { "key": "footer_copy", "en": "© 2025 Rahul Natha. Design and Code by Rahul Natha.", "de": "© 2025 Rahul Natha. Design und Code von Rahul Natha." }
];

// 2. Array of structured experience data (from your uploaded CSV)
const EXPERIENCE_DATA = [
  { "joinDate": "2024-03-24", "exitDate": "2025-11-08", "type": "Work", "title": "Senior Research Fellow", "organization": "RCI lab, Defence R&D Organisation, Govt of India" },
  { "joinDate": "2022-03-24", "exitDate": "2024-03-23", "type": "Work", "title": "Junior Research Fellow", "organization": "RCI lab, Defence R&D Organisation, Govt of India" },
  { "joinDate": "2021-05-21", "exitDate": "2022-03-18", "type": "Work", "title": "Mechanical Engineer", "organization": "Cyient Limited" },
  { "joinDate": "2019-05-15", "exitDate": "2019-06-15", "type": "Work", "title": "Industrial Training Intern", "organization": "MechRise Solutions Private Limited" },
  { "joinDate": "2016-08-08", "exitDate": "2020-09-30", "type": "School", "title": "Bachelor of Technology", "organization": "CMR College of Engineering & Technology, JNTU Hyderabad" }
];


// --- Content Retrieval Functions ---

function getTranslatedString(key, lang) {
    const item = CONTENT_STRINGS.find(content => content.key === key);
    if (item && item[lang]) {
        return item[lang];
    }
    console.error(`Missing translation for key: ${key} in language: ${lang}`);
    return key; 
}

function getExperienceData() {
    return EXPERIENCE_DATA;
}

// --- Global Export ---
window.Content = {
    get: getTranslatedString,
    getExperience: getExperienceData
};
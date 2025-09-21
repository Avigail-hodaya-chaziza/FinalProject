// מילון תרגומים דו-כיווני
export const treatmentTranslations = {
  // מאנגלית לעברית
  'medical_massage': 'עיסוי רפואי',
  'facial_treatment': 'טיפול פנים',
  'manicure': 'מניקור',
  'pedicure': 'פדיקור',
  'swedish_massage': 'עיסוי שוודי',
  'deep_tissue_massage': 'עיסוי רקמות עמוקות',
  'hot_stone_massage': 'עיסוי אבנים חמות',
  'aromatherapy_massage': 'עיסוי ארומתרפיה',
  
  // תיאורים
  'therapeutic_massage_for_back_and_neck_pain': 'עיסוי טיפולי לכאבי גב וצוואר',
  'deep_cleansing_facial_treatment': 'טיפול ניקוי עמוק לפנים',
  'professional_nail_care': 'טיפוח ציפורניים מקצועי',
  'foot_and_nail_care': 'טיפוח כפות רגליים וציפורניים'
};

// מילון הפוך - מעברית לאנגלית
export const hebrewToEnglish = {};
Object.keys(treatmentTranslations).forEach(eng => {
  hebrewToEnglish[treatmentTranslations[eng]] = eng;
});

// פונקציה לתרגום מאנגלית לעברית
export const translateToHebrew = (englishText) => {
  return treatmentTranslations[englishText] || englishText;
};

// פונקציה לתרגום מעברית לאנגלית
export const translateToEnglish = (hebrewText) => {
  return hebrewToEnglish[hebrewText] || hebrewText.toLowerCase().replace(/\s+/g, '_');
};

// פונקציה ישנה לתאימות לאחור
export const translateTreatment = translateToHebrew;
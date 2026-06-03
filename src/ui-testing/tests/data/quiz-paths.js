/**
 * Quiz paths configuration.
 * Defines all degree type × interest area combinations and their expected results.
 *
 * To change a selection: update the `subInterest` field.
 * To add a new interest area: add a new entry to INTEREST_AREAS and PATHS.
 * If the quiz changes, quiz-discovery.spec.js will fail first — update this file to match.
 */

const DEGREE_TYPES = [
  'Undergraduate degree',
  'Graduate degree',
  'Graduate certificate',
];

const EDUCATION_STATUS_OPTIONS = [
  'High school diploma or GED',
  'Associate of Arts (AA) or Science (AS)',
  'Associate of Applied Science (AAS)',
  'Bachelor of Arts (BA)',
  'Bachelor of Science (BS)',
  'Master of Arts (MA)',
  'Master of Science (MS)',
  'Master of Business Administration (MBA)',
  'Registered Nurse (RN) license',
  'Teaching certification or licensure',
  'Paralegal certificate or law-related training',
  'Military or veteran',
];

const INTEREST_AREAS = [
  'Arts, culture and society',
  'Business',
  'Education',
  'Engineering',
  'Health and nursing',
  'Law, compliance and public service',
  'Science',
  'Social and behavioral sciences',
  'Technology',
];

const SUB_INTERESTS = {
  'Arts, culture and society': [
    'General arts, culture and society',
    'Art and design (including fashion, digital photography and industrial design)',
    'Community, advocacy and social policy',
    'Diversity and culture',
    'History',
    'Language',
    'Liberal and interdisciplinary studies',
    'Media storytelling or digital literacy',
    'Museum studies',
    'Philosophy, ethics or public discourse',
    'Religion and philosophy',
  ],
  'Business': [
    'General business',
    'Business studies',
    'Corporate accounting or financial planning',
    'Economics and finance',
    'Human resources or employment law',
    'Leadership and management',
    'Marketing and communication',
    'Nonprofit leadership or administration',
    'Project management',
    'Retail or food industry management',
    'Supply chain and global logistics',
    'Technology and analytics',
  ],
  'Education': [
    'General education',
    'Administration and instruction',
    'Early childhood education',
    'Education studies',
    'Educational leadership or innovation',
    'Instructional design or educational technology',
    'Interdisciplinary or planetary futures education',
    'Language teaching',
    'Special education or applied behavior analysis',
    'Teacher certification',
  ],
  'Engineering': [
    'General engineering',
    'Electrical and software engineering',
    'Engineering management',
    'Human systems engineering',
    'Industrial and systems engineering',
    'Material, mechanical or sustainable engineering',
  ],
  'Health and nursing': [
    'General health and nursing',
    'Addiction or mental health counseling',
    'Behavioral health leadership or clinical practice',
    'Behavioral health or mental health',
    'Clinical research or diagnostics',
    'Health care coordination or compliance',
    'Health care leadership and policy',
    'Health informatics or simulation',
    'Nursing education or RN-to-BSN/MSN pathways',
    'Nutrition and wellness',
    'Public health or global health',
    'Speech and hearing sciences or communication disorders',
  ],
  'Law, compliance and public service': [
    'General law, compliance and public service',
    'Construction legal studies',
    'Criminal justice and forensics',
    'Cybersecurity policy or conflict resolution',
    'Employment law',
    'Environmental or sustainability law',
    'Health care law, compliance and administration',
    'Intellectual property',
    'Leadership, policy and urban planning',
    'Legal studies',
    'Paralegal, legal paraprofessional or law support',
    'Public policy or government law',
    'Public safety or emergency management',
    'Regulatory law',
    'Sports law',
    'Technology law',
    'Tribal self-governance or Indigenous law',
  ],
  'Science': [
    'General science',
    'Aging health or diagnostics',
    'Biology, chemistry or biochemistry',
    'Biomimicry or nature-inspired innovation',
    'Environmental sciences or sustainability',
    'Food systems or sustainable tourism',
    'Forensic or clinical science',
    'Geographic and planetary sciences',
    'Neuroscience or behavioral science',
    'Pharmacology, toxicology or drug development',
    'Physics or complex systems',
  ],
  'Social and behavioral sciences': [
    'General social and behavioral sciences',
    'Addiction psychology or applied behavior',
    'Anthropology',
    'Forensic psychology or criminology',
    'Human rights, justice or military/veteran studies',
    'Innovation in society or social impact',
    'Political and international studies',
    'Political psychology',
    'Psychology and sociology',
    'Social work, family and counseling',
  ],
  'Technology': [
    'General technology',
    'Artificial intelligence or automation',
    'Audience strategy or media engagement',
    'Big data systems and software architecture',
    'Computer science',
    'Cybersecurity or policy',
    'Data science and statistics',
    'Digital art and user experience',
    'Information technology or systems',
    'Social and global technologies',
    'Technical communication',
    'Web development',
  ],
};

/**
 * Generate relevance keywords from sub-interest names.
 * Extracts meaningful words (3+ chars) from the sub-interest list.
 */
function keywordsFromSubInterests(subInterests) {
  const stopWords = new Set(['and', 'the', 'for', 'including', 'general', 'or']);
  const words = new Set();
  for (const sub of subInterests) {
    for (const word of sub.toLowerCase().split(/[\s,()\/]+/)) {
      if (word.length >= 4 && !stopWords.has(word)) {
        words.add(word);
      }
    }
  }
  return [...words];
}

/**
 * All 27 test paths: 3 degree types × 9 interest areas.
 * Each path selects the first sub-interest ("General ...") by default.
 * Change `subInterest` to test a different selection.
 */
const PATHS = DEGREE_TYPES.flatMap((degreeType) =>
  INTEREST_AREAS.map((interest) => ({
    degreeType,
    interest,
    subInterest: SUB_INTERESTS[interest][0], // Default: "General ..."
    keywords: keywordsFromSubInterests(SUB_INTERESTS[interest]),
    degreeLevelKeyword: degreeType === 'Undergraduate degree' ? 'bachelor'
      : degreeType === 'Graduate degree' ? 'master'
      : 'certificate',
  }))
);

module.exports = {
  DEGREE_TYPES,
  EDUCATION_STATUS_OPTIONS,
  INTEREST_AREAS,
  SUB_INTERESTS,
  PATHS,
  keywordsFromSubInterests,
};

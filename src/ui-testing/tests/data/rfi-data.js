/**
 * RFI test data generator.
 * Produces valid form data for the "Connect with us" modal.
 */

const FIRST_NAMES = [
  'Aiden', 'Priya', 'Carlos', 'Fatima', 'Kenji', 'Amara', 'Liam', 'Mei',
  'Omar', 'Sofia', 'Raj', 'Yuki', 'Diego', 'Nia', 'Tariq', 'Elena',
  'Kofi', 'Ines', 'Mateo', 'Sana', 'Andre', 'Hana', 'Jamal', 'Lucia',
  'Vikram', 'Aaliyah', 'Chen', 'Rosa', 'Kwame', 'Noor',
];
const LAST_NAMES = [
  'Patel', 'Nguyen', 'Kim', 'Garcia', 'Okafor', 'Tanaka', 'Singh', 'Hernandez',
  'Muller', 'Chen', 'Osei', 'Rivera', 'Nakamura', 'Ali', 'Johansson', 'Santos',
  'Begum', 'Park', 'Fernandez', 'Mensah', 'Yamamoto', 'Reyes', 'Ibrahim', 'Novak',
  'Gupta', 'Martinez', 'Cho', 'Adeyemi', 'Larsson', 'Hassan',
];

// Valid US area codes (avoids reserved/fictional ranges)
const AREA_CODES = [602, 480, 623, 520, 928, 312, 213, 646, 305, 512, 415, 303];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone() {
  const area = randomFrom(AREA_CODES);
  const prefix = Math.floor(Math.random() * 900) + 100;
  const line = Math.floor(Math.random() * 9000) + 1000;
  return `${area}${prefix}${line}`;
}

/**
 * Generate RFI form data for a given test index.
 * @param {number} index - Test index (used to alternate military status)
 * @returns {{ firstName: string, lastName: string, email: string, phone: string, military: 'Yes'|'No' }}
 */
function generateRfiData(index = 0) {
  const timestamp = Date.now();
  return {
    firstName: `embtest${randomFrom(FIRST_NAMES)}`,
    lastName: `embtest${randomFrom(LAST_NAMES)}`,
    email: `edplusqatest+degreemeautomation${timestamp}@gmail.com`,
    phone: generatePhone(),
    military: index % 2 === 0 ? 'No' : 'Yes',
  };
}

module.exports = { generateRfiData };

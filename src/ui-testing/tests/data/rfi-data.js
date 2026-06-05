/**
 * RFI test data generator.
 * Produces valid form data for the "Connect with us" modal.
 */

const FIRST_NAMES = [
  'Aiden', 'Liam', 'Noah', 'Ethan', 'Lucas', 'Mason', 'Elijah', 'Benjamin',
  'Oliver', 'James', 'Sophia', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Mia',
  'Charlotte', 'Amelia', 'Harper', 'Evelyn',

  'Priya', 'Raj', 'Vikram', 'Arjun', 'Rohan', 'Anika', 'Neha', 'Asha',
  'Sana', 'Aaliyah', 'Zara', 'Imran', 'Omar', 'Tariq', 'Noor', 'Fatima',
  'Layla', 'Yasmin', 'Hassan', 'Amir',

  'Carlos', 'Diego', 'Mateo', 'Santiago', 'Javier', 'Andres', 'Miguel',
  'Sofia', 'Lucia', 'Elena', 'Valentina', 'Camila', 'Isabella', 'Rosa',
  'Gabriela', 'Mariana', 'Fernanda', 'Alejandro', 'Ricardo', 'Juan',

  'Kenji', 'Yuki', 'Hana', 'Haruto', 'Ren', 'Sora', 'Takumi', 'Kaito',
  'Aiko', 'Mei', 'Chen', 'Wei', 'Jing', 'Li', 'Xiao', 'Jun',
  'Min', 'Jisoo', 'Hyun', 'Seo-yeon',

  'Kwame', 'Kofi', 'Nia', 'Amara', 'Amina', 'Ade', 'Tunde', 'Chidi',
  'Ngozi', 'Zola', 'Jabari', 'Ayana', 'Thabo', 'Lerato', 'Sipho', 'Naledi',
  'Mensah', 'Ayo', 'Binta', 'Makena',

  'Andre', 'Jean', 'Pierre', 'Louis', 'Antoine', 'Julien', 'Claire',
  'Sophie', 'Camille', 'Chloe', 'Luca', 'Marco', 'Giulia', 'Alessia',
  'Matteo', 'Francesca', 'Enzo', 'Tommaso', 'Chiara', 'Paolo',

  'Lars', 'Erik', 'Sven', 'Maja', 'Freja', 'Astrid', 'Ingrid', 'Nils',
  'Johanna', 'Henrik', 'Marta', 'Katarzyna', 'Piotr', 'Tomasz', 'Anna',
  'Jakub', 'Petra', 'Marek', 'Eva', 'Jan',

  'Michael', 'David', 'Daniel', 'Christopher', 'Matthew', 'Nathan',
  'Jonathan', 'Sarah', 'Rachel', 'Rebecca', 'Lauren', 'Emily',
  'Jordan', 'Taylor', 'Morgan', 'Alex', 'Casey', 'Jamie', 'Logan', 'Avery'
];

const LAST_NAMES = [
  'Patel', 'Singh', 'Gupta', 'Sharma', 'Verma', 'Reddy', 'Mehta', 'Kapoor',
  'Nguyen', 'Tran', 'Le', 'Pham', 'Vo', 'Huynh',
  'Kim', 'Park', 'Lee', 'Cho', 'Choi', 'Jung',
  'Tanaka', 'Yamamoto', 'Nakamura', 'Sato', 'Suzuki', 'Kobayashi',
  'Chen', 'Wang', 'Li', 'Zhang', 'Liu', 'Yang', 'Huang', 'Wu',

  'Garcia', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez',
  'Rodriguez', 'Rivera', 'Fernandez', 'Torres', 'Morales', 'Castillo',
  'Santos', 'Reyes', 'Cruz', 'Vargas',

  'Ali', 'Hassan', 'Ibrahim', 'Rahman', 'Khan', 'Ahmed', 'Mahmoud',
  'Abdullah', 'Farooq', 'Nasser',

  'Okafor', 'Adeyemi', 'Mensah', 'Osei', 'Diallo', 'Bello',
  'Ndlovu', 'Mbeki', 'Moyo', 'Kamau', 'Abebe', 'Tadesse',

  'Muller', 'Schmidt', 'Weber', 'Fischer', 'Wagner',
  'Novak', 'Horvat', 'Kovac', 'Popescu', 'Ionescu',
  'Johansson', 'Larsson', 'Andersson', 'Lindberg', 'Eriksson',

  'Rossi', 'Russo', 'Ferrari', 'Romano', 'Ricci',
  'Dubois', 'Moreau', 'Laurent', 'Lefevre', 'Fontaine',
  'Silva', 'Costa', 'Pereira', 'Oliveira', 'Sousa',

  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller',
  'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas',
  'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Clark',

  'Begum', 'Chowdhury', 'Islam', 'Hossain', 'Das',
  'Perera', 'Jayasinghe', 'Fernando',
  'Petrov', 'Ivanov', 'Sokolov', 'Kuznetsov'
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
    email: `edplusqatest+degreemeauto${timestamp}@gmail.com`,
    phone: generatePhone(),
    military: index % 2 === 0 ? 'No' : 'Yes',
  };
}

module.exports = { generateRfiData };

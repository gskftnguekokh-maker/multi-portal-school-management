// ============================================================
// KEUR FATOU TALL – Magasin de données simulé (State global)
// Académie de Thiès – IEF Mbour1 | Année 2025-2026
// ============================================================

export type Role = 'admin' | 'teacher' | 'parent' | 'student';

export interface User {
  id: string;
  login: string;
  password: string;
  role: Role;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface Class {
  id: string;
  name: string; // ex: "6ème A", "3ème B", "Tle C"
  level: string; // ex: "6ème", "5ème", ...
  teacherIds: string[];
  studentIds: string[];
}

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
}

export interface Teacher extends User {
  role: 'teacher';
  classIds: string[];
  subjectIds: string[];
  speciality: string;
}

export interface Student extends User {
  role: 'student';
  matricule: string;
  classId: string;
  parentId?: string;
  dateOfBirth?: string;
  gender?: 'M' | 'F';
}

export interface Parent extends User {
  role: 'parent';
  childrenIds: string[];
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  value: number; // /20
  type: 'Devoir' | 'Composition' | 'Examen';
  trimester: 1 | 2 | 3;
  date: string;
  comment?: string;
}

export interface Absence {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  type: 'Absence' | 'Retard';
  justified: boolean;
  reason?: string;
  teacherId: string;
}

export interface Payment {
  id: string;
  studentId: string;
  type: 'Inscription' | 'Mensualité';
  month?: string; // 'Octobre' à 'Juin'
  amount: number;
  paid: boolean;
  paidDate?: string;
  receiptNumber?: string;
}

export interface SchoolActivity {
  id: string;
  title: string;
  description: string;
  type: 'Extrascolaire' | 'Pédagogique';
  date: string;
  location?: string;
  imageUrl?: string;
}

export interface AppState {
  users: User[];
  classes: Class[];
  subjects: Subject[];
  grades: Grade[];
  absences: Absence[];
  payments: Payment[];
  activities: SchoolActivity[];
  currentUser: User | null;
}

// ─── Données initiales ────────────────────────────────────────

const subjects: Subject[] = [
  { id: 's1', name: 'Mathématiques', coefficient: 4 },
  { id: 's2', name: 'Français', coefficient: 4 },
  { id: 's3', name: 'Anglais', coefficient: 3 },
  { id: 's4', name: 'Histoire-Géographie', coefficient: 3 },
  { id: 's5', name: 'Sciences de la Vie et de la Terre', coefficient: 3 },
  { id: 's6', name: 'Physique-Chimie', coefficient: 3 },
  { id: 's7', name: 'Éducation Physique', coefficient: 2 },
  { id: 's8', name: 'Arts Plastiques', coefficient: 1 },
  { id: 's9', name: 'Informatique', coefficient: 2 },
  { id: 's10', name: 'Philosophie', coefficient: 3 },
];

const classes: Class[] = [
  { id: 'c1', name: '6ème A', level: '6ème', teacherIds: ['t1', 't2'], studentIds: ['st1', 'st2', 'st3', 'st4'] },
  { id: 'c2', name: '6ème B', level: '6ème', teacherIds: ['t1'], studentIds: ['st5', 'st6'] },
  { id: 'c3', name: '5ème A', level: '5ème', teacherIds: ['t2', 't3'], studentIds: ['st7', 'st8'] },
  { id: 'c4', name: '4ème A', level: '4ème', teacherIds: ['t3'], studentIds: ['st9', 'st10'] },
  { id: 'c5', name: '3ème A', level: '3ème', teacherIds: ['t2', 't4'], studentIds: ['st11', 'st12'] },
  { id: 'c6', name: '2nde A', level: '2nde', teacherIds: ['t4'], studentIds: ['st13', 'st14'] },
  { id: 'c7', name: '1ère A', level: '1ère', teacherIds: ['t3', 't4'], studentIds: ['st15', 'st16'] },
  { id: 'c8', name: 'Tle A', level: 'Terminale', teacherIds: ['t1', 't4'], studentIds: ['st17', 'st18'] },
];

const users: User[] = [
  // Admin
  {
    id: 'admin1',
    login: 'admin',
    password: 'Admin@2025',
    role: 'admin',
    name: 'Directeur Amadou DIALLO',
    email: 'directeur@kft.sn',
    phone: '77 123 45 67',
    createdAt: '2025-09-01',
  },
  // Enseignants
  {
    id: 't1',
    login: 'prof.sow',
    password: 'Prof@123',
    role: 'teacher',
    name: 'M. Ibrahima SOW',
    email: 'i.sow@kft.sn',
    phone: '77 234 56 78',
    createdAt: '2025-09-01',
  },
  {
    id: 't2',
    login: 'prof.ndoye',
    password: 'Prof@456',
    role: 'teacher',
    name: 'Mme Fatou NDOYE',
    email: 'f.ndoye@kft.sn',
    phone: '76 345 67 89',
    createdAt: '2025-09-01',
  },
  {
    id: 't3',
    login: 'prof.fall',
    password: 'Prof@789',
    role: 'teacher',
    name: 'M. Moussa FALL',
    email: 'm.fall@kft.sn',
    phone: '70 456 78 90',
    createdAt: '2025-09-01',
  },
  {
    id: 't4',
    login: 'prof.dieng',
    password: 'Prof@321',
    role: 'teacher',
    name: 'Mme Aïssatou DIENG',
    email: 'a.dieng@kft.sn',
    phone: '78 567 89 01',
    createdAt: '2025-09-01',
  },
  // Parents
  {
    id: 'p1',
    login: 'parent.ba',
    password: 'Parent@123',
    role: 'parent',
    name: 'M. Oumar BA',
    email: 'o.ba@gmail.com',
    phone: '77 111 22 33',
    createdAt: '2025-09-02',
  },
  {
    id: 'p2',
    login: 'parent.sy',
    password: 'Parent@456',
    role: 'parent',
    name: 'Mme Mariama SY',
    email: 'm.sy@gmail.com',
    phone: '76 222 33 44',
    createdAt: '2025-09-02',
  },
  {
    id: 'p3',
    login: 'parent.kane',
    password: 'Parent@789',
    role: 'parent',
    name: 'M. Amadou KANE',
    email: 'a.kane@gmail.com',
    phone: '70 333 44 55',
    createdAt: '2025-09-02',
  },
  // Élèves
  { id: 'st1', login: 'KFT2526-6A-001', password: 'Eleve@001', role: 'student', name: 'Aminata BA', createdAt: '2025-09-02' },
  { id: 'st2', login: 'KFT2526-6A-002', password: 'Eleve@002', role: 'student', name: 'Cheikh NDIAYE', createdAt: '2025-09-02' },
  { id: 'st3', login: 'KFT2526-6A-003', password: 'Eleve@003', role: 'student', name: 'Rokhaya SARR', createdAt: '2025-09-02' },
  { id: 'st4', login: 'KFT2526-6A-004', password: 'Eleve@004', role: 'student', name: 'Moustapha DIOP', createdAt: '2025-09-02' },
  { id: 'st5', login: 'KFT2526-6B-001', password: 'Eleve@005', role: 'student', name: 'Fatoumata GUEYE', createdAt: '2025-09-02' },
  { id: 'st6', login: 'KFT2526-6B-002', password: 'Eleve@006', role: 'student', name: 'Ibrahima THIAM', createdAt: '2025-09-02' },
  { id: 'st7', login: 'KFT2526-5A-001', password: 'Eleve@007', role: 'student', name: 'Ndéye FALL', createdAt: '2025-09-02' },
  { id: 'st8', login: 'KFT2526-5A-002', password: 'Eleve@008', role: 'student', name: 'Abdoulaye DIALLO', createdAt: '2025-09-02' },
  { id: 'st9', login: 'KFT2526-4A-001', password: 'Eleve@009', role: 'student', name: 'Sokhna MBAYE', createdAt: '2025-09-02' },
  { id: 'st10', login: 'KFT2526-4A-002', password: 'Eleve@010', role: 'student', name: 'Serigne SECK', createdAt: '2025-09-02' },
  { id: 'st11', login: 'KFT2526-3A-001', password: 'Eleve@011', role: 'student', name: 'Penda DIOUF', createdAt: '2025-09-02' },
  { id: 'st12', login: 'KFT2526-3A-002', password: 'Eleve@012', role: 'student', name: 'Alioune FAYE', createdAt: '2025-09-02' },
  { id: 'st13', login: 'KFT2526-2A-001', password: 'Eleve@013', role: 'student', name: 'Khady TOURE', createdAt: '2025-09-02' },
  { id: 'st14', login: 'KFT2526-2A-002', password: 'Eleve@014', role: 'student', name: 'Lamine WADE', createdAt: '2025-09-02' },
  { id: 'st15', login: 'KFT2526-1A-001', password: 'Eleve@015', role: 'student', name: 'Binta CISSE', createdAt: '2025-09-02' },
  { id: 'st16', login: 'KFT2526-1A-002', password: 'Eleve@016', role: 'student', name: 'Omar BADJI', createdAt: '2025-09-02' },
  { id: 'st17', login: 'KFT2526-TA-001', password: 'Eleve@017', role: 'student', name: 'Marème CAMARA', createdAt: '2025-09-02' },
  { id: 'st18', login: 'KFT2526-TA-002', password: 'Eleve@018', role: 'student', name: 'Boubacar LY', createdAt: '2025-09-02' },
];

// Données étendues pour les enseignants
export const teacherData: Record<string, { classIds: string[]; subjectIds: string[]; speciality: string }> = {
  t1: { classIds: ['c1', 'c2', 'c8'], subjectIds: ['s1', 's9'], speciality: 'Mathématiques & Informatique' },
  t2: { classIds: ['c1', 'c3', 'c5'], subjectIds: ['s2', 's8'], speciality: 'Français & Arts Plastiques' },
  t3: { classIds: ['c3', 'c4', 'c7'], subjectIds: ['s5', 's6'], speciality: 'Sciences & Physique' },
  t4: { classIds: ['c5', 'c6', 'c7', 'c8'], subjectIds: ['s3', 's4', 's10'], speciality: 'Lettres & Histoire' },
};

// Données étendues pour les élèves
export const studentData: Record<string, { matricule: string; classId: string; parentId?: string; dateOfBirth?: string; gender?: 'M' | 'F' }> = {
  st1: { matricule: 'KFT2526-6A-001', classId: 'c1', parentId: 'p1', dateOfBirth: '2013-05-12', gender: 'F' },
  st2: { matricule: 'KFT2526-6A-002', classId: 'c1', parentId: 'p2', dateOfBirth: '2013-08-20', gender: 'M' },
  st3: { matricule: 'KFT2526-6A-003', classId: 'c1', parentId: 'p3', dateOfBirth: '2013-03-15', gender: 'F' },
  st4: { matricule: 'KFT2526-6A-004', classId: 'c1', dateOfBirth: '2012-11-05', gender: 'M' },
  st5: { matricule: 'KFT2526-6B-001', classId: 'c2', parentId: 'p1', dateOfBirth: '2013-07-22', gender: 'F' },
  st6: { matricule: 'KFT2526-6B-002', classId: 'c2', dateOfBirth: '2013-01-18', gender: 'M' },
  st7: { matricule: 'KFT2526-5A-001', classId: 'c3', parentId: 'p2', dateOfBirth: '2012-09-10', gender: 'F' },
  st8: { matricule: 'KFT2526-5A-002', classId: 'c3', dateOfBirth: '2012-04-25', gender: 'M' },
  st9: { matricule: 'KFT2526-4A-001', classId: 'c4', parentId: 'p3', dateOfBirth: '2011-06-14', gender: 'F' },
  st10: { matricule: 'KFT2526-4A-002', classId: 'c4', dateOfBirth: '2011-12-30', gender: 'M' },
  st11: { matricule: 'KFT2526-3A-001', classId: 'c5', parentId: 'p1', dateOfBirth: '2010-02-08', gender: 'F' },
  st12: { matricule: 'KFT2526-3A-002', classId: 'c5', dateOfBirth: '2010-07-17', gender: 'M' },
  st13: { matricule: 'KFT2526-2A-001', classId: 'c6', parentId: 'p2', dateOfBirth: '2009-10-03', gender: 'F' },
  st14: { matricule: 'KFT2526-2A-002', classId: 'c6', dateOfBirth: '2009-05-28', gender: 'M' },
  st15: { matricule: 'KFT2526-1A-001', classId: 'c7', parentId: 'p3', dateOfBirth: '2008-08-19', gender: 'F' },
  st16: { matricule: 'KFT2526-1A-002', classId: 'c7', dateOfBirth: '2008-03-11', gender: 'M' },
  st17: { matricule: 'KFT2526-TA-001', classId: 'c8', parentId: 'p1', dateOfBirth: '2007-11-24', gender: 'F' },
  st18: { matricule: 'KFT2526-TA-002', classId: 'c8', dateOfBirth: '2007-06-07', gender: 'M' },
};

// Données étendues pour les parents
export const parentData: Record<string, { childrenIds: string[] }> = {
  p1: { childrenIds: ['st1', 'st5', 'st11', 'st17'] },
  p2: { childrenIds: ['st2', 'st7', 'st13'] },
  p3: { childrenIds: ['st3', 'st9', 'st15'] },
};

const grades: Grade[] = [
  // st1 - Aminata BA - 6ème A
  { id: 'g1', studentId: 'st1', subjectId: 's1', classId: 'c1', teacherId: 't1', value: 15, type: 'Devoir', trimester: 1, date: '2025-10-15' },
  { id: 'g2', studentId: 'st1', subjectId: 's1', classId: 'c1', teacherId: 't1', value: 17, type: 'Composition', trimester: 1, date: '2025-11-20' },
  { id: 'g3', studentId: 'st1', subjectId: 's2', classId: 'c1', teacherId: 't2', value: 14, type: 'Devoir', trimester: 1, date: '2025-10-10' },
  { id: 'g4', studentId: 'st1', subjectId: 's2', classId: 'c1', teacherId: 't2', value: 16, type: 'Composition', trimester: 1, date: '2025-11-18' },
  { id: 'g5', studentId: 'st1', subjectId: 's3', classId: 'c1', teacherId: 't4', value: 13, type: 'Devoir', trimester: 1, date: '2025-10-12' },
  { id: 'g6', studentId: 'st1', subjectId: 's5', classId: 'c1', teacherId: 't3', value: 18, type: 'Devoir', trimester: 1, date: '2025-10-20' },
  { id: 'g7', studentId: 'st1', subjectId: 's4', classId: 'c1', teacherId: 't4', value: 15, type: 'Composition', trimester: 1, date: '2025-11-22' },
  { id: 'g8', studentId: 'st1', subjectId: 's7', classId: 'c1', teacherId: 't2', value: 16, type: 'Devoir', trimester: 1, date: '2025-10-25' },
  // st2 - Cheikh NDIAYE
  { id: 'g9', studentId: 'st2', subjectId: 's1', classId: 'c1', teacherId: 't1', value: 12, type: 'Devoir', trimester: 1, date: '2025-10-15' },
  { id: 'g10', studentId: 'st2', subjectId: 's1', classId: 'c1', teacherId: 't1', value: 14, type: 'Composition', trimester: 1, date: '2025-11-20' },
  { id: 'g11', studentId: 'st2', subjectId: 's2', classId: 'c1', teacherId: 't2', value: 11, type: 'Devoir', trimester: 1, date: '2025-10-10' },
  { id: 'g12', studentId: 'st2', subjectId: 's3', classId: 'c1', teacherId: 't4', value: 15, type: 'Devoir', trimester: 1, date: '2025-10-12' },
  // st3 - Rokhaya SARR
  { id: 'g13', studentId: 'st3', subjectId: 's1', classId: 'c1', teacherId: 't1', value: 16, type: 'Devoir', trimester: 1, date: '2025-10-15' },
  { id: 'g14', studentId: 'st3', subjectId: 's2', classId: 'c1', teacherId: 't2', value: 18, type: 'Composition', trimester: 1, date: '2025-11-18' },
  { id: 'g15', studentId: 'st3', subjectId: 's5', classId: 'c1', teacherId: 't3', value: 17, type: 'Devoir', trimester: 1, date: '2025-10-20' },
  // st17 - Marème CAMARA - Tle A
  { id: 'g16', studentId: 'st17', subjectId: 's1', classId: 'c8', teacherId: 't1', value: 14, type: 'Devoir', trimester: 1, date: '2025-10-15' },
  { id: 'g17', studentId: 'st17', subjectId: 's10', classId: 'c8', teacherId: 't4', value: 16, type: 'Composition', trimester: 1, date: '2025-11-20' },
  { id: 'g18', studentId: 'st17', subjectId: 's3', classId: 'c8', teacherId: 't4', value: 15, type: 'Devoir', trimester: 1, date: '2025-10-12' },
  // st11 - Penda DIOUF - 3ème A
  { id: 'g19', studentId: 'st11', subjectId: 's1', classId: 'c5', teacherId: 't1', value: 13, type: 'Devoir', trimester: 1, date: '2025-10-15' },
  { id: 'g20', studentId: 'st11', subjectId: 's2', classId: 'c5', teacherId: 't2', value: 15, type: 'Composition', trimester: 1, date: '2025-11-18' },
  { id: 'g21', studentId: 'st11', subjectId: 's4', classId: 'c5', teacherId: 't4', value: 14, type: 'Devoir', trimester: 1, date: '2025-10-20' },
  // st5 - Fatoumata GUEYE - 6ème B  
  { id: 'g22', studentId: 'st5', subjectId: 's1', classId: 'c2', teacherId: 't1', value: 16, type: 'Devoir', trimester: 1, date: '2025-10-15' },
  { id: 'g23', studentId: 'st5', subjectId: 's2', classId: 'c2', teacherId: 't2', value: 17, type: 'Composition', trimester: 1, date: '2025-11-18' },
];

const absences: Absence[] = [
  { id: 'ab1', studentId: 'st1', classId: 'c1', date: '2025-10-08', type: 'Absence', justified: true, reason: 'Maladie', teacherId: 't1' },
  { id: 'ab2', studentId: 'st2', classId: 'c1', date: '2025-10-15', type: 'Retard', justified: false, teacherId: 't2' },
  { id: 'ab3', studentId: 'st3', classId: 'c1', date: '2025-11-05', type: 'Absence', justified: false, teacherId: 't1' },
  { id: 'ab4', studentId: 'st17', classId: 'c8', date: '2025-10-20', type: 'Retard', justified: true, reason: 'Transport', teacherId: 't4' },
  { id: 'ab5', studentId: 'st11', classId: 'c5', date: '2025-10-28', type: 'Absence', justified: true, reason: 'Deuil familial', teacherId: 't2' },
  { id: 'ab6', studentId: 'st5', classId: 'c2', date: '2025-11-12', type: 'Retard', justified: false, teacherId: 't1' },
];

const months = ['Octobre', 'Novembre', 'Décembre', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];

const payments: Payment[] = [];
let payId = 1;

// Générer les paiements pour tous les élèves
['st1', 'st2', 'st3', 'st4', 'st5', 'st6', 'st7', 'st8', 'st9', 'st10', 'st11', 'st12', 'st13', 'st14', 'st15', 'st16', 'st17', 'st18'].forEach(stId => {
  // Inscription
  payments.push({
    id: `pay${payId++}`,
    studentId: stId,
    type: 'Inscription',
    amount: 50000,
    paid: true,
    paidDate: '2025-09-05',
    receiptNumber: `REC-2526-${stId.toUpperCase()}-INS`,
  });

  // Mensualités
  months.forEach((month, idx) => {
    const paid = idx < 3; // Oct, Nov, Déc payés
    payments.push({
      id: `pay${payId++}`,
      studentId: stId,
      type: 'Mensualité',
      month,
      amount: 15000,
      paid,
      paidDate: paid ? `2025-${(idx + 10).toString().padStart(2, '0')}-05` : undefined,
      receiptNumber: paid ? `REC-2526-${stId.toUpperCase()}-${month.toUpperCase().slice(0, 3)}` : undefined,
    });
  });
});

const activities: SchoolActivity[] = [
  {
    id: 'act1',
    title: 'Journée Culturelle 2025',
    description: 'Grande fête culturelle avec danses traditionnelles, expositions artistiques et représentations théâtrales. Tous les élèves sont invités à participer.',
    type: 'Extrascolaire',
    date: '2025-12-15',
    location: 'Cour de l\'école KEUR FATOU TALL',
  },
  {
    id: 'act2',
    title: 'Compétition de Mathématiques',
    description: 'Olympiade de mathématiques inter-classes pour tous les niveaux. Les meilleurs élèves représenteront l\'école au niveau régional.',
    type: 'Pédagogique',
    date: '2026-01-20',
    location: 'Salle polyvalente',
  },
  {
    id: 'act3',
    title: 'Tournoi de Football Inter-classes',
    description: 'Grand tournoi de football opposant toutes les classes de l\'établissement. Venez encourager vos équipes !',
    type: 'Extrascolaire',
    date: '2025-12-06',
    location: 'Terrain de sport',
  },
  {
    id: 'act4',
    title: 'Voyage Pédagogique à Dakar',
    description: 'Visite du Musée des Civilisations Noires et de l\'IFAN pour les classes de 3ème, 2nde et 1ère.',
    type: 'Pédagogique',
    date: '2026-02-14',
    location: 'Dakar',
  },
  {
    id: 'act5',
    title: 'Concours de Lecture en Français',
    description: 'Concours de lecture et de diction pour les classes de 6ème et 5ème. Prix remis aux meilleurs lecteurs.',
    type: 'Pédagogique',
    date: '2026-01-10',
    location: 'Bibliothèque scolaire',
  },
  {
    id: 'act6',
    title: 'Journée Sport et Santé',
    description: 'Activités sportives, sensibilisation à la nutrition et à la santé avec la participation de professionnels de santé locaux.',
    type: 'Extrascolaire',
    date: '2026-03-07',
    location: 'Stade municipal de Mbour',
  },
];

// ─── Store principal ───────────────────────────────────────────
const STORAGE_KEY = 'kft_school_data';

function loadFromStorage(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveToStorage(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function initState(): AppState {
  const saved = loadFromStorage();
  if (saved) return { ...saved, currentUser: null };
  return {
    users,
    classes,
    subjects,
    grades,
    absences,
    payments,
    activities,
    currentUser: null,
  };
}

let state: AppState = initState();

export function getState(): AppState {
  return state;
}

export function setState(updater: (prev: AppState) => AppState) {
  state = updater(state);
  saveToStorage(state);
}

export function getTeacherData() {
  return teacherData;
}

export function getStudentData() {
  return studentData;
}

export function getParentData() {
  return parentData;
}

export function getSubjects() {
  return subjects;
}

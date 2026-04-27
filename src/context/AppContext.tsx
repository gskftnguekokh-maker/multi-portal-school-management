import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  AppState, User, Class, Grade, Absence, Payment, SchoolActivity, Subject,
  getState, setState, teacherData, studentData, parentData,
} from '../data/store';

interface AppContextValue {
  state: AppState;
  login: (login: string, password: string) => User | null;
  logout: () => void;
  // Admin operations
  addClass: (cls: Omit<Class, 'id'>) => void;
  removeClass: (id: string) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => User;
  updateUser: (id: string, data: Partial<User>) => void;
  removeUser: (id: string) => void;
  assignTeacherToClass: (teacherId: string, classId: string) => void;
  removeTeacherFromClass: (teacherId: string, classId: string) => void;
  assignSubjectToTeacher: (teacherId: string, subjectId: string) => void;
  removeSubjectFromTeacher: (teacherId: string, subjectId: string) => void;
  assignChildToParent: (parentId: string, studentId: string) => void;
  setStudentClass: (studentId: string, classId: string) => void;
  // Grade operations
  addGrade: (grade: Omit<Grade, 'id'>) => void;
  updateGrade: (id: string, data: Partial<Grade>) => void;
  removeGrade: (id: string) => void;
  // Absence operations
  addAbsence: (absence: Omit<Absence, 'id'>) => void;
  removeAbsence: (id: string) => void;
  // Payment operations
  markPaymentPaid: (id: string) => void;
  // Activity operations
  addActivity: (activity: Omit<SchoolActivity, 'id'>) => void;
  updateActivity: (id: string, data: Partial<SchoolActivity>) => void;
  removeActivity: (id: string) => void;
  // Helper getters
  getClassById: (id: string) => Class | undefined;
  getSubjectById: (id: string) => Subject | undefined;
  getUserById: (id: string) => User | undefined;
  getStudentGrades: (studentId: string) => Grade[];
  getStudentAbsences: (studentId: string) => Absence[];
  getStudentPayments: (studentId: string) => Payment[];
  getTeacherClasses: (teacherId: string) => Class[];
  getClassStudents: (classId: string) => User[];
  getParentChildren: (parentId: string) => User[];
  getStudentClass: (studentId: string) => Class | undefined;
  getTeacherSubjects: (teacherId: string) => Subject[];
  getTeacherClassIds: (teacherId: string) => string[];
  getStudentMatricule: (studentId: string) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// In-memory extended data (mirrors store)
const teacherExt = { ...teacherData };
const studentExt = { ...studentData };
const parentExt = { ...parentData };

export function AppProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<AppState>(getState());

  const sync = useCallback((updater: (prev: AppState) => AppState) => {
    setAppState(prev => {
      const next = updater(prev);
      setState(() => next);
      return next;
    });
  }, []);

  const login = useCallback((login: string, password: string): User | null => {
    const user = appState.users.find(u => u.login === login && u.password === password);
    if (user) {
      sync(prev => ({ ...prev, currentUser: user }));
      return user;
    }
    return null;
  }, [appState.users, sync]);

  const logout = useCallback(() => {
    sync(prev => ({ ...prev, currentUser: null }));
  }, [sync]);

  const addClass = useCallback((cls: Omit<Class, 'id'>) => {
    const newClass: Class = { ...cls, id: generateId() };
    sync(prev => ({ ...prev, classes: [...prev.classes, newClass] }));
  }, [sync]);

  const removeClass = useCallback((id: string) => {
    sync(prev => ({ ...prev, classes: prev.classes.filter(c => c.id !== id) }));
  }, [sync]);

  const addUser = useCallback((userData: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    if (newUser.role === 'teacher') {
      teacherExt[newUser.id] = { classIds: [], subjectIds: [], speciality: '' };
    }
    if (newUser.role === 'student') {
      const cls = appState.classes.find(c => c.id === (newUser as any).classId);
      const classCode = cls ? cls.name.replace(/\s+/g, '').replace('ème', '').replace('ère', '').replace('nde', '').toUpperCase() : 'XX';
      const count = appState.users.filter(u => u.role === 'student' && studentExt[u.id]?.classId === (newUser as any).classId).length + 1;
      const mat = `KFT2526-${classCode}-${count.toString().padStart(3, '0')}`;
      studentExt[newUser.id] = {
        matricule: mat,
        classId: (newUser as any).classId || '',
        parentId: (newUser as any).parentId,
        dateOfBirth: (newUser as any).dateOfBirth,
        gender: (newUser as any).gender,
      };
    }
    if (newUser.role === 'parent') {
      parentExt[newUser.id] = { childrenIds: [] };
    }
    sync(prev => ({ ...prev, users: [...prev.users, newUser] }));
    return newUser;
  }, [appState, sync]);

  const updateUser = useCallback((id: string, data: Partial<User>) => {
    sync(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, ...data } : u),
      currentUser: prev.currentUser?.id === id ? { ...prev.currentUser, ...data } : prev.currentUser,
    }));
  }, [sync]);

  const removeUser = useCallback((id: string) => {
    sync(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
  }, [sync]);

  const assignTeacherToClass = useCallback((teacherId: string, classId: string) => {
    if (!teacherExt[teacherId]) teacherExt[teacherId] = { classIds: [], subjectIds: [], speciality: '' };
    if (!teacherExt[teacherId].classIds.includes(classId)) {
      teacherExt[teacherId].classIds.push(classId);
    }
    sync(prev => ({
      ...prev,
      classes: prev.classes.map(c => c.id === classId
        ? { ...c, teacherIds: c.teacherIds.includes(teacherId) ? c.teacherIds : [...c.teacherIds, teacherId] }
        : c),
    }));
  }, [sync]);

  const removeTeacherFromClass = useCallback((teacherId: string, classId: string) => {
    if (teacherExt[teacherId]) {
      teacherExt[teacherId].classIds = teacherExt[teacherId].classIds.filter(id => id !== classId);
    }
    sync(prev => ({
      ...prev,
      classes: prev.classes.map(c => c.id === classId
        ? { ...c, teacherIds: c.teacherIds.filter(tid => tid !== teacherId) }
        : c),
    }));
  }, [sync]);

  const assignSubjectToTeacher = useCallback((teacherId: string, subjectId: string) => {
    if (!teacherExt[teacherId]) teacherExt[teacherId] = { classIds: [], subjectIds: [], speciality: '' };
    if (!teacherExt[teacherId].subjectIds.includes(subjectId)) {
      teacherExt[teacherId].subjectIds.push(subjectId);
    }
    sync(prev => prev);
  }, [sync]);

  const removeSubjectFromTeacher = useCallback((teacherId: string, subjectId: string) => {
    if (teacherExt[teacherId]) {
      teacherExt[teacherId].subjectIds = teacherExt[teacherId].subjectIds.filter(id => id !== subjectId);
    }
    sync(prev => prev);
  }, [sync]);

  const assignChildToParent = useCallback((parentId: string, studentId: string) => {
    if (!parentExt[parentId]) parentExt[parentId] = { childrenIds: [] };
    if (!parentExt[parentId].childrenIds.includes(studentId)) {
      parentExt[parentId].childrenIds.push(studentId);
    }
    if (studentExt[studentId]) studentExt[studentId].parentId = parentId;
    sync(prev => prev);
  }, [sync]);

  const setStudentClass = useCallback((studentId: string, classId: string) => {
    if (studentExt[studentId]) studentExt[studentId].classId = classId;
    sync(prev => ({
      ...prev,
      classes: prev.classes.map(c => ({
        ...c,
        studentIds: c.id === classId
          ? c.studentIds.includes(studentId) ? c.studentIds : [...c.studentIds, studentId]
          : c.studentIds.filter(id => id !== studentId),
      })),
    }));
  }, [sync]);

  const addGrade = useCallback((grade: Omit<Grade, 'id'>) => {
    const newGrade: Grade = { ...grade, id: generateId() };
    sync(prev => ({ ...prev, grades: [...prev.grades, newGrade] }));
  }, [sync]);

  const updateGrade = useCallback((id: string, data: Partial<Grade>) => {
    sync(prev => ({ ...prev, grades: prev.grades.map(g => g.id === id ? { ...g, ...data } : g) }));
  }, [sync]);

  const removeGrade = useCallback((id: string) => {
    sync(prev => ({ ...prev, grades: prev.grades.filter(g => g.id !== id) }));
  }, [sync]);

  const addAbsence = useCallback((absence: Omit<Absence, 'id'>) => {
    const newAbsence: Absence = { ...absence, id: generateId() };
    sync(prev => ({ ...prev, absences: [...prev.absences, newAbsence] }));
  }, [sync]);

  const removeAbsence = useCallback((id: string) => {
    sync(prev => ({ ...prev, absences: prev.absences.filter(a => a.id !== id) }));
  }, [sync]);

  const markPaymentPaid = useCallback((id: string) => {
    sync(prev => ({
      ...prev,
      payments: prev.payments.map(p => p.id === id
        ? { ...p, paid: true, paidDate: new Date().toISOString().split('T')[0], receiptNumber: `REC-${Date.now()}` }
        : p),
    }));
  }, [sync]);

  const addActivity = useCallback((activity: Omit<SchoolActivity, 'id'>) => {
    const newActivity: SchoolActivity = { ...activity, id: generateId() };
    sync(prev => ({ ...prev, activities: [...prev.activities, newActivity] }));
  }, [sync]);

  const updateActivity = useCallback((id: string, data: Partial<SchoolActivity>) => {
    sync(prev => ({ ...prev, activities: prev.activities.map(a => a.id === id ? { ...a, ...data } : a) }));
  }, [sync]);

  const removeActivity = useCallback((id: string) => {
    sync(prev => ({ ...prev, activities: prev.activities.filter(a => a.id !== id) }));
  }, [sync]);

  // Helpers
  const getClassById = (id: string) => appState.classes.find(c => c.id === id);
  const getSubjectById = (id: string) => appState.subjects.find(s => s.id === id);
  const getUserById = (id: string) => appState.users.find(u => u.id === id);
  const getStudentGrades = (studentId: string) => appState.grades.filter(g => g.studentId === studentId);
  const getStudentAbsences = (studentId: string) => appState.absences.filter(a => a.studentId === studentId);
  const getStudentPayments = (studentId: string) => appState.payments.filter(p => p.studentId === studentId);
  
  const getTeacherClasses = (teacherId: string) => {
    const ext = teacherExt[teacherId];
    if (!ext) return appState.classes.filter(c => c.teacherIds.includes(teacherId));
    return appState.classes.filter(c => ext.classIds.includes(c.id) || c.teacherIds.includes(teacherId));
  };

  const getClassStudents = (classId: string) => {
    const cls = appState.classes.find(c => c.id === classId);
    if (!cls) return [];
    return appState.users.filter(u => cls.studentIds.includes(u.id) || (u.role === 'student' && studentExt[u.id]?.classId === classId));
  };

  const getParentChildren = (parentId: string) => {
    const ext = parentExt[parentId];
    if (!ext) return [];
    return appState.users.filter(u => ext.childrenIds.includes(u.id));
  };

  const getStudentClass = (studentId: string) => {
    const ext = studentExt[studentId];
    if (ext?.classId) return appState.classes.find(c => c.id === ext.classId);
    return appState.classes.find(c => c.studentIds.includes(studentId));
  };

  const getTeacherSubjects = (teacherId: string) => {
    const ext = teacherExt[teacherId];
    if (!ext) return [];
    return appState.subjects.filter(s => ext.subjectIds.includes(s.id));
  };

  const getTeacherClassIds = (teacherId: string) => {
    const ext = teacherExt[teacherId];
    return ext?.classIds ?? appState.classes.filter(c => c.teacherIds.includes(teacherId)).map(c => c.id);
  };

  const getStudentMatricule = (studentId: string) => {
    return studentExt[studentId]?.matricule ?? studentId;
  };

  return (
    <AppContext.Provider value={{
      state: appState,
      login, logout,
      addClass, removeClass,
      addUser, updateUser, removeUser,
      assignTeacherToClass, removeTeacherFromClass,
      assignSubjectToTeacher, removeSubjectFromTeacher,
      assignChildToParent, setStudentClass,
      addGrade, updateGrade, removeGrade,
      addAbsence, removeAbsence,
      markPaymentPaid,
      addActivity, updateActivity, removeActivity,
      getClassById, getSubjectById, getUserById,
      getStudentGrades, getStudentAbsences, getStudentPayments,
      getTeacherClasses, getClassStudents, getParentChildren,
      getStudentClass, getTeacherSubjects, getTeacherClassIds,
      getStudentMatricule,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

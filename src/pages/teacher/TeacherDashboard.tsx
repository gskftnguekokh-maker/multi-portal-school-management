import { useState } from 'react';
import { BookOpen, Users, Calendar, Plus, Trash2, X, Save, Activity, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Grade } from '../../data/store';
import ActivitiesPage from '../shared/ActivitiesPage';

const tabs = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'classes', label: 'Mes Classes', icon: Users },
  { id: 'grades', label: 'Saisie Notes', icon: BookOpen },
  { id: 'absences', label: 'Absences', icon: Calendar },
  { id: 'activities', label: 'Activités', icon: Activity },
];

export default function TeacherDashboard() {
  const { state, addGrade, removeGrade, addAbsence, removeAbsence, getTeacherClasses, getClassStudents } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [showAbsenceForm, setShowAbsenceForm] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    subjectId: '', value: '', type: 'Devoir' as Grade['type'],
    trimester: 1 as 1 | 2 | 3, date: new Date().toISOString().split('T')[0], comment: '',
  });
  const [absenceForm, setAbsenceForm] = useState({
    studentId: '', date: new Date().toISOString().split('T')[0],
    type: 'Absence' as 'Absence' | 'Retard', justified: false, reason: '',
  });

  const teacher = state.currentUser!;
  const myClasses = getTeacherClasses(teacher.id);
  const subjectIds = (state as any).teacherData?.[teacher.id]?.subjectIds ?? [];
  
  // Get teacher's subjects from subjects list based on teacherData
  const teacherSubjects = state.subjects; // Teachers can add notes for any subject in their classes

  const classStudents = selectedClass ? getClassStudents(selectedClass) : [];
  const classGrades = selectedClass
    ? state.grades.filter(g => g.classId === selectedClass && (selectedStudent ? g.studentId === selectedStudent : true))
    : [];
  const classAbsences = selectedClass
    ? state.absences.filter(a => a.classId === selectedClass)
    : [];

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedClass) return;
    addGrade({
      studentId: selectedStudent,
      subjectId: gradeForm.subjectId,
      classId: selectedClass,
      teacherId: teacher.id,
      value: parseFloat(gradeForm.value),
      type: gradeForm.type,
      trimester: gradeForm.trimester,
      date: gradeForm.date,
      comment: gradeForm.comment,
    });
    setShowGradeForm(false);
    setGradeForm({ subjectId: '', value: '', type: 'Devoir', trimester: 1, date: new Date().toISOString().split('T')[0], comment: '' });
  };

  const handleAbsenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    addAbsence({
      studentId: absenceForm.studentId,
      classId: selectedClass,
      date: absenceForm.date,
      type: absenceForm.type,
      justified: absenceForm.justified,
      reason: absenceForm.reason,
      teacherId: teacher.id,
    });
    setShowAbsenceForm(false);
    setAbsenceForm({ studentId: '', date: new Date().toISOString().split('T')[0], type: 'Absence', justified: false, reason: '' });
  };

  const getStudentName = (id: string) => state.users.find(u => u.id === id)?.name || id;
  const getSubjectName = (id: string) => state.subjects.find(s => s.id === id)?.name || id;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${activeTab === id ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Home tab */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Bonjour, {teacher.name} 👋</h2>
              <p className="text-gray-500 text-sm">Année scolaire 2025/2026 – Tableau de bord enseignant</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{myClasses.length}</p>
                <p className="text-sm text-gray-500">Classes attribuées</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {state.grades.filter(g => g.teacherId === teacher.id).length}
                </p>
                <p className="text-sm text-gray-500">Notes saisies</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {state.absences.filter(a => a.teacherId === teacher.id).length}
                </p>
                <p className="text-sm text-gray-500">Absences signalées</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Mes Classes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myClasses.map(cls => {
                  const students = getClassStudents(cls.id);
                  return (
                    <div key={cls.id} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-blue-800 text-lg">{cls.name}</p>
                          <p className="text-sm text-blue-600">{students.length} élèves</p>
                        </div>
                        <button onClick={() => { setSelectedClass(cls.id); setActiveTab('grades'); }}
                          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                          Saisir notes
                        </button>
                      </div>
                    </div>
                  );
                })}
                {myClasses.length === 0 && <p className="text-gray-400 text-sm">Aucune classe attribuée</p>}
              </div>
            </div>
          </div>
        )}

        {/* Classes tab */}
        {activeTab === 'classes' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Mes Classes & Élèves</h2>
            {myClasses.map(cls => {
              const students = getClassStudents(cls.id);
              return (
                <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-blue-600 px-5 py-3">
                    <h3 className="text-white font-bold text-lg">{cls.name}</h3>
                    <p className="text-blue-100 text-sm">{students.length} élèves inscrits</p>
                  </div>
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500">#</th>
                            <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500">Nom</th>
                            <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 hidden sm:table-cell">Matricule</th>
                            <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500">Moy.</th>
                            <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500">Abs.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student, i) => {
                            const grades = state.grades.filter(g => g.studentId === student.id && g.classId === cls.id);
                            const avg = grades.length ? (grades.reduce((s, g) => s + g.value, 0) / grades.length).toFixed(2) : '–';
                            const absences = state.absences.filter(a => a.studentId === student.id && a.classId === cls.id).length;
                            return (
                              <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-2 px-2 text-gray-400 text-xs">{i + 1}</td>
                                <td className="py-2 px-2 font-medium text-gray-800">{student.name}</td>
                                <td className="py-2 px-2 text-gray-400 text-xs hidden sm:table-cell">
                                  <code>{student.login}</code>
                                </td>
                                <td className="py-2 px-2">
                                  <span className={`font-bold text-sm ${parseFloat(avg) >= 14 ? 'text-green-600' : parseFloat(avg) >= 10 ? 'text-orange-500' : avg === '–' ? 'text-gray-400' : 'text-red-500'}`}>
                                    {avg}
                                  </span>
                                </td>
                                <td className="py-2 px-2 text-red-500 font-semibold text-sm">{absences || 0}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Grades tab */}
        {activeTab === 'grades' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Saisie des Notes</h2>
              {selectedClass && selectedStudent && (
                <button onClick={() => setShowGradeForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition-colors">
                  <Plus className="w-4 h-4" /> Ajouter une note
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-gray-100">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Classe *</label>
                <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedStudent(''); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">– Choisir une classe –</option>
                  {myClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {selectedClass && (
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Élève *</label>
                  <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Tous les élèves</option>
                    {classStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
            </div>

            {selectedClass && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Élève</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Matière</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Note</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Trim.</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {classGrades.map(g => (
                        <tr key={g.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{getStudentName(g.studentId)}</td>
                          <td className="px-4 py-3 text-gray-600">{getSubjectName(g.subjectId)}</td>
                          <td className="px-4 py-3">
                            <span className={`font-bold ${g.value >= 14 ? 'text-green-600' : g.value >= 10 ? 'text-orange-500' : 'text-red-500'}`}>
                              {g.value}/20
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${g.type === 'Composition' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {g.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-gray-500">T{g.trimester}</td>
                          <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">{g.date}</td>
                          <td className="px-4 py-3">
                            {g.teacherId === teacher.id && (
                              <button onClick={() => removeGrade(g.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {classGrades.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucune note pour cette sélection</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Absences tab */}
        {activeTab === 'absences' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Gestion des Absences</h2>
              {selectedClass && (
                <button onClick={() => setShowAbsenceForm(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition-colors">
                  <Plus className="w-4 h-4" /> Signaler
                </button>
              )}
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Classe</label>
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">– Choisir –</option>
                {myClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {selectedClass && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Élève</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Justifié</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Motif</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {classAbsences.map(ab => (
                        <tr key={ab.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{getStudentName(ab.studentId)}</td>
                          <td className="px-4 py-3 text-gray-600">{ab.date}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ab.type === 'Absence' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                              {ab.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold ${ab.justified ? 'text-green-600' : 'text-red-500'}`}>
                              {ab.justified ? '✓ Oui' : '✗ Non'}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{ab.reason || '–'}</td>
                          <td className="px-4 py-3">
                            {ab.teacherId === teacher.id && (
                              <button onClick={() => removeAbsence(ab.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {classAbsences.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucune absence pour cette classe</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && <ActivitiesPage />}
      </div>

      {/* Grade form modal */}
      {showGradeForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Ajouter une note</h3>
              <button onClick={() => setShowGradeForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleGradeSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Matière *</label>
                  <select value={gradeForm.subjectId} onChange={e => setGradeForm(f => ({ ...f, subjectId: e.target.value }))}
                    required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">– Choisir –</option>
                    {state.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Note /20 *</label>
                  <input type="number" min="0" max="20" step="0.25" value={gradeForm.value}
                    onChange={e => setGradeForm(f => ({ ...f, value: e.target.value }))} required
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                  <select value={gradeForm.type} onChange={e => setGradeForm(f => ({ ...f, type: e.target.value as Grade['type'] }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Devoir</option><option>Composition</option><option>Examen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Trimestre</label>
                  <select value={gradeForm.trimester} onChange={e => setGradeForm(f => ({ ...f, trimester: parseInt(e.target.value) as 1 | 2 | 3 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={1}>1er</option><option value={2}>2e</option><option value={3}>3e</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                  <input type="date" value={gradeForm.date} onChange={e => setGradeForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Commentaire</label>
                  <input value={gradeForm.comment} onChange={e => setGradeForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Optionnel"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowGradeForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Annuler</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Absence form modal */}
      {showAbsenceForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-500" /> Signaler une absence</h3>
              <button onClick={() => setShowAbsenceForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAbsenceSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Élève *</label>
                <select value={absenceForm.studentId} onChange={e => setAbsenceForm(f => ({ ...f, studentId: e.target.value }))}
                  required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">– Choisir –</option>
                  {classStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                  <input type="date" value={absenceForm.date} onChange={e => setAbsenceForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                  <select value={absenceForm.type} onChange={e => setAbsenceForm(f => ({ ...f, type: e.target.value as 'Absence' | 'Retard' }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Absence</option><option>Retard</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="justified" checked={absenceForm.justified} onChange={e => setAbsenceForm(f => ({ ...f, justified: e.target.checked }))}
                  className="w-4 h-4 accent-green-600" />
                <label htmlFor="justified" className="text-sm text-gray-700 font-medium">Justifiée</label>
              </div>
              {absenceForm.justified && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Motif</label>
                  <input value={absenceForm.reason} onChange={e => setAbsenceForm(f => ({ ...f, reason: e.target.value }))}
                    placeholder="Raison de l'absence"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAbsenceForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Annuler</button>
                <button type="submit" className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Signaler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Plus, Trash2, Users, BookOpen, X, Save, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { teacherData } from '../../data/store';

export default function AdminClasses() {
  const { state, addClass, removeClass, assignTeacherToClass, removeTeacherFromClass,
    assignSubjectToTeacher, removeSubjectFromTeacher, getClassStudents } = useApp();

  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const teachers = state.users.filter(u => u.role === 'teacher');
  const subjects = state.subjects;

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    addClass({ name: newClassName.trim(), level: newClassLevel.trim(), teacherIds: [], studentIds: [] });
    setNewClassName('');
    setNewClassLevel('');
    setShowAddClass(false);
  };



  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestion des Classes</h2>
          <p className="text-sm text-gray-500">{state.classes.length} classes · Année 2025/2026</p>
        </div>
        <button onClick={() => setShowAddClass(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition-colors">
          <Plus className="w-4 h-4" /> Nouvelle classe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.classes.map(cls => {
          const students = getClassStudents(cls.id);
          const clsTeachers = teachers.filter(t => cls.teacherIds.includes(t.id));
          return (
            <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">{cls.name}</h3>
                  <p className="text-green-100 text-xs">{cls.level}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setSelectedClass(cls.id)} className="p-1.5 text-white hover:bg-green-500 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeClass(cls.id)} className="p-1.5 text-white hover:bg-red-500 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold">{students.length}</span>
                    <span className="text-gray-400">élèves</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">{clsTeachers.length}</span>
                    <span className="text-gray-400">profs</span>
                  </div>
                </div>

                {clsTeachers.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Enseignants</p>
                    {clsTeachers.map(t => {
                      const td = teacherData[t.id];
                      const subNames = td ? state.subjects.filter(s => td.subjectIds.includes(s.id)).map(s => s.name).join(', ') : '';
                      return (
                        <div key={t.id} className="flex items-center justify-between bg-blue-50 rounded-lg px-2 py-1.5">
                          <div>
                            <p className="text-xs font-semibold text-blue-800">{t.name}</p>
                            {subNames && <p className="text-xs text-blue-500 truncate max-w-[160px]">{subNames}</p>}
                          </div>
                          <button onClick={() => removeTeacherFromClass(t.id, cls.id)} className="text-red-400 hover:text-red-600 p-0.5">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {students.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Élèves</p>
                    <div className="flex flex-wrap gap-1">
                      {students.slice(0, 5).map(s => (
                        <span key={s.id} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{s.name.split(' ')[0]}</span>
                      ))}
                      {students.length > 5 && <span className="text-xs text-gray-400">+{students.length - 5}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign teacher to class */}
      {selectedClass && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">
              Attribuer des enseignants – {state.classes.find(c => c.id === selectedClass)?.name}
            </h3>
            <button onClick={() => setSelectedClass(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teachers.map(t => {
              const isAssigned = state.classes.find(c => c.id === selectedClass)?.teacherIds.includes(t.id);
              const td = teacherData[t.id];
              return (
                <div key={t.id} className={`flex items-center justify-between p-3 rounded-xl border-2 ${isAssigned ? 'border-green-300 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{t.name}</p>
                    {td && <p className="text-xs text-gray-500">{td.speciality}</p>}
                  </div>
                  <button
                    onClick={() => isAssigned ? removeTeacherFromClass(t.id, selectedClass) : assignTeacherToClass(t.id, selectedClass)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${isAssigned ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    {isAssigned ? 'Retirer' : 'Assigner'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Teacher subject config */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">Matières par Enseignant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teachers.map(t => {
            const td = teacherData[t.id];
            const teacherSubjects = td ? state.subjects.filter(s => td.subjectIds.includes(s.id)) : [];
            return (
              <div key={t.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{td?.speciality || '–'}</p>
                  </div>
                  <button onClick={() => setSelectedTeacher(selectedTeacher === t.id ? null : t.id)}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200 transition-colors">
                    Modifier
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {teacherSubjects.map(s => (
                    <span key={s.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s.name}</span>
                  ))}
                  {teacherSubjects.length === 0 && <span className="text-xs text-gray-400">Aucune matière assignée</span>}
                </div>
                {selectedTeacher === t.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Assigner des matières:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {subjects.map(s => {
                        const has = td?.subjectIds.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            onClick={() => has ? removeSubjectFromTeacher(t.id, s.id) : assignSubjectToTeacher(t.id, s.id)}
                            className={`text-xs px-2 py-0.5 rounded-full border transition-all ${has ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
                          >
                            {s.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add class modal */}
      {showAddClass && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Nouvelle classe</h3>
              <button onClick={() => setShowAddClass(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddClass} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom de la classe *</label>
                <input value={newClassName} onChange={e => setNewClassName(e.target.value)} required
                  placeholder="ex: 6ème C, 3ème B, Tle S"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Niveau</label>
                <select value={newClassLevel} onChange={e => setNewClassLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">– Choisir –</option>
                  {['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddClass(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Annuler</button>
                <button type="submit" className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

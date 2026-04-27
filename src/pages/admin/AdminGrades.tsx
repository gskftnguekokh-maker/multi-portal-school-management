import { useState } from 'react';
import { Plus, Trash2, X, Save, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Grade } from '../../data/store';

export default function AdminGrades() {
  const { state, addGrade, removeGrade, getClassStudents } = useApp();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    subjectId: '', value: '', type: 'Devoir' as Grade['type'], trimester: 1 as 1 | 2 | 3,
    date: new Date().toISOString().split('T')[0], comment: '',
  });

  const classStudents = selectedClass ? getClassStudents(selectedClass) : [];
  const studentGrades = selectedStudent
    ? state.grades.filter(g => g.studentId === selectedStudent)
    : selectedClass
    ? state.grades.filter(g => g.classId === selectedClass)
    : state.grades;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !form.subjectId) return;
    addGrade({
      studentId: selectedStudent,
      subjectId: form.subjectId,
      classId: selectedClass,
      teacherId: 'admin1',
      value: parseFloat(form.value),
      type: form.type,
      trimester: form.trimester,
      date: form.date,
      comment: form.comment,
    });
    setShowForm(false);
    setForm({ subjectId: '', value: '', type: 'Devoir', trimester: 1, date: new Date().toISOString().split('T')[0], comment: '' });
  };

  const getStudentName = (id: string) => state.users.find(u => u.id === id)?.name || id;
  const getSubjectName = (id: string) => state.subjects.find(s => s.id === id)?.name || id;
  const getClassName = (id: string) => state.classes.find(c => c.id === id)?.name || id;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestion des Notes</h2>
          <p className="text-sm text-gray-500">{state.grades.length} notes enregistrées</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition-colors">
          <Plus className="w-4 h-4" /> Ajouter une note
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Filtrer par classe</label>
          <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedStudent(''); }}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="">Toutes les classes</option>
            {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {selectedClass && (
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Filtrer par élève</label>
            <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Tous les élèves</option>
              {classStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Grades table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Élève</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Classe</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Matière</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Note</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Trimestre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {studentGrades.map(g => (
                <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{getStudentName(g.studentId)}</td>
                  <td className="px-4 py-3 text-gray-500">{getClassName(g.classId)}</td>
                  <td className="px-4 py-3 text-gray-700">{getSubjectName(g.subjectId)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-base ${g.value >= 14 ? 'text-green-600' : g.value >= 10 ? 'text-orange-500' : 'text-red-500'}`}>
                      {g.value}/20
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${g.type === 'Composition' ? 'bg-purple-100 text-purple-700' : g.type === 'Examen' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {g.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500">T{g.trimester}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">{g.date}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => removeGrade(g.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {studentGrades.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Aucune note trouvée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add grade modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><BookOpen className="w-5 h-5 text-green-600" /> Ajouter une note</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Classe *</label>
                  <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedStudent(''); }}
                    required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">– Choisir –</option>
                    {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Élève *</label>
                  <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
                    required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">– Choisir –</option>
                    {getClassStudents(selectedClass).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Matière *</label>
                  <select value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
                    required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">– Choisir –</option>
                    {state.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Note /20 *</label>
                  <input type="number" min="0" max="20" step="0.25" value={form.value}
                    onChange={e => setForm(f => ({ ...f, value: e.target.value }))} required
                    placeholder="0–20"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Grade['type'] }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Devoir</option>
                    <option>Composition</option>
                    <option>Examen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Trimestre</label>
                  <select value={form.trimester} onChange={e => setForm(f => ({ ...f, trimester: parseInt(e.target.value) as 1 | 2 | 3 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value={1}>1er Trimestre</option>
                    <option value={2}>2e Trimestre</option>
                    <option value={3}>3e Trimestre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Commentaire</label>
                  <input value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Optionnel"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Annuler</button>
                <button type="submit" className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

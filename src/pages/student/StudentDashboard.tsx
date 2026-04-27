import { useState } from 'react';
import { BookOpen, Calendar, Activity, User, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GradesView from '../shared/GradesView';
import ActivitiesPage from '../shared/ActivitiesPage';
import { studentData } from '../../data/store';

const tabs = [
  { id: 'grades', label: 'Mes Notes', icon: BookOpen },
  { id: 'absences', label: 'Absences', icon: Calendar },
  { id: 'activities', label: 'Activités', icon: Activity },
  { id: 'profile', label: 'Mon Profil', icon: User },
];

export default function StudentDashboard() {
  const { state, getStudentAbsences, getStudentClass } = useApp();
  const [activeTab, setActiveTab] = useState('grades');
  
  const student = state.currentUser!;
  const sData = studentData[student.id];
  const studentClass = getStudentClass(student.id);
  const absences = getStudentAbsences(student.id);
  const grades = state.grades.filter(g => g.studentId === student.id);
  const avg = grades.length ? (grades.reduce((s, g) => s + g.value, 0) / grades.length).toFixed(2) : '–';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Student header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-5">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
            {student.name.charAt(0)}
          </div>
          <div>
            <p className="text-orange-100 text-sm">Portail Élève</p>
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p className="text-orange-100 text-sm">
              {studentClass?.name || '–'} · Matricule: <code className="bg-white/20 px-1.5 py-0.5 rounded text-xs">{student.login}</code>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{grades.length}</p>
            <p className="text-xs text-gray-500">Notes</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className={`text-2xl font-bold ${avg !== '–' && parseFloat(avg) >= 10 ? 'text-green-600' : 'text-red-500'}`}>{avg}</p>
            <p className="text-xs text-gray-500">Moyenne</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{absences.filter(a => a.type === 'Absence').length}</p>
            <p className="text-xs text-gray-500">Absences</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 gap-1 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-1 justify-center flex-shrink-0 ${
                activeTab === id ? 'bg-orange-500 text-white shadow' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'grades' && <GradesView studentId={student.id} />}

        {activeTab === 'absences' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{absences.filter(a => a.type === 'Absence').length}</p>
                <p className="text-xs text-gray-500">Absences</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-orange-500">{absences.filter(a => a.type === 'Retard').length}</p>
                <p className="text-xs text-gray-500">Retards</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{absences.filter(a => a.justified).length}</p>
                <p className="text-xs text-gray-500">Justifiés</p>
              </div>
            </div>

            {absences.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Date</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Justifié</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">Motif</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {absences.map(ab => (
                        <tr key={ab.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700 font-medium">{ab.date}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ab.type === 'Absence' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                              {ab.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-semibold text-sm ${ab.justified ? 'text-green-600' : 'text-red-500'}`}>
                              {ab.justified ? '✓' : '✗'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{ab.reason || '–'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Aucune absence enregistrée. Bravo ! 🎉</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && <ActivitiesPage />}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-5 py-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-bold text-2xl">
                {student.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                <p className="text-sm text-gray-500">{studentClass?.name || '–'}</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Matricule', value: student.login, icon: '🎫' },
                  { label: 'Classe', value: studentClass?.name || '–', icon: '🏫' },
                  { label: 'Niveau', value: studentClass?.level || '–', icon: '📚' },
                  { label: 'Année scolaire', value: '2025 – 2026', icon: '📅' },
                  { label: 'Date de naissance', value: sData?.dateOfBirth || '–', icon: '🎂' },
                  { label: 'Genre', value: sData?.gender === 'M' ? 'Masculin' : sData?.gender === 'F' ? 'Féminin' : '–', icon: '👤' },
                  { label: 'Email', value: student.email || '–', icon: '📧' },
                  { label: 'Téléphone', value: student.phone || '–', icon: '📱' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-orange-600" />
                  <p className="font-bold text-orange-800">Statistiques académiques</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-orange-600">{grades.length}</p>
                    <p className="text-xs text-gray-500">Notes</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-orange-600">{avg}</p>
                    <p className="text-xs text-gray-500">Moyenne</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-orange-600">{absences.length}</p>
                    <p className="text-xs text-gray-500">Absences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

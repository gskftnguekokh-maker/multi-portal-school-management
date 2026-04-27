import { useState } from 'react';
import { Users, BookOpen, GraduationCap, Shield, Calendar, CreditCard, ChevronRight, TrendingUp, Award, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AdminUsers from './AdminUsers';
import AdminClasses from './AdminClasses';
import AdminGrades from './AdminGrades';
import AdminPayments from './AdminPayments';
import AdminActivities from './AdminActivities';

const tabs = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Shield },
  { id: 'classes', label: 'Classes', icon: GraduationCap },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'grades', label: 'Notes', icon: BookOpen },
  { id: 'payments', label: 'Paiements', icon: CreditCard },
  { id: 'activities', label: 'Activités', icon: Activity },
];

export default function AdminDashboard() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  const teachers = state.users.filter(u => u.role === 'teacher');
  const parents = state.users.filter(u => u.role === 'parent');
  const students = state.users.filter(u => u.role === 'student');
  const totalPaid = state.payments.filter(p => p.paid).reduce((s, p) => s + p.amount, 0);
  const totalDue = state.payments.reduce((s, p) => s + p.amount, 0);
  const paymentRate = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;
  const totalAbsences = state.absences.filter(a => a.type === 'Absence').length;
  const totalLate = state.absences.filter(a => a.type === 'Retard').length;

  const statCards = [
    { label: 'Élèves', value: students.length, icon: GraduationCap, color: 'from-orange-400 to-orange-600', sub: `${state.classes.length} classes` },
    { label: 'Enseignants', value: teachers.length, icon: BookOpen, color: 'from-blue-400 to-blue-600', sub: 'Personnel pédagogique' },
    { label: 'Parents', value: parents.length, icon: Users, color: 'from-green-400 to-green-600', sub: 'Comptes actifs' },
    { label: 'Taux de paiement', value: `${paymentRate}%`, icon: CreditCard, color: 'from-purple-400 to-purple-600', sub: `${(totalPaid / 1000).toFixed(0)}k / ${(totalDue / 1000).toFixed(0)}k FCFA` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex overflow-x-auto scrollbar-hide gap-0">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                  activeTab === id
                    ? 'border-green-600 text-green-700 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Tableau de bord</h2>
              <p className="text-gray-500 text-sm">Vue d'ensemble de l'établissement – 2025/2026</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map(({ label, value, icon: Icon, color, sub }) => (
                <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                    <p className="text-sm font-semibold text-gray-600">{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Classes overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-green-600" /> Effectifs par classe
                </h3>
                <button onClick={() => setActiveTab('classes')} className="text-green-600 text-sm flex items-center gap-1 hover:underline">
                  Gérer <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {state.classes.map(cls => (
                  <div key={cls.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="font-bold text-gray-700 text-sm">{cls.name}</p>
                    <p className="text-xs text-gray-500">{cls.studentIds.length} élèves</p>
                    <p className="text-xs text-gray-400">{cls.teacherIds.length} profs</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent absences + payment summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-500" /> Absences & Retards récents
                </h3>
                <div className="flex gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">{totalAbsences}</p>
                    <p className="text-xs text-gray-500">Absences</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">{totalLate}</p>
                    <p className="text-xs text-gray-500">Retards</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">
                      {state.absences.filter(a => a.justified).length}
                    </p>
                    <p className="text-xs text-gray-500">Justifiés</p>
                  </div>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {state.absences.slice(0, 5).map(ab => {
                    const student = state.users.find(u => u.id === ab.studentId);
                    return (
                      <div key={ab.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50">
                        <span className="font-medium text-gray-700">{student?.name || ab.studentId}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${ab.type === 'Absence' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                            {ab.type}
                          </span>
                          <span className="text-xs text-gray-400">{ab.date}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" /> Situation financière
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Taux de recouvrement</span>
                      <span className="font-bold text-green-600">{paymentRate}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: `${paymentRate}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-green-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Encaissé</p>
                      <p className="font-bold text-green-700">{(totalPaid / 1000).toFixed(0)}k FCFA</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">En attente</p>
                      <p className="font-bold text-red-600">{((totalDue - totalPaid) / 1000).toFixed(0)}k FCFA</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="font-bold text-gray-700">{state.payments.filter(p => p.type === 'Inscription' && p.paid).length}</p>
                      <p className="text-gray-400">Inscriptions</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-700">{state.payments.filter(p => p.type === 'Mensualité' && p.paid).length}</p>
                      <p className="text-gray-400">Mensualités</p>
                    </div>
                    <div>
                      <p className="font-bold text-red-500">{state.payments.filter(p => !p.paid).length}</p>
                      <p className="text-gray-400">Impayés</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Activities */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" /> Prochaines activités
                </h3>
                <button onClick={() => setActiveTab('activities')} className="text-green-600 text-sm flex items-center gap-1 hover:underline">
                  Gérer <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {state.activities.slice(0, 3).map(act => (
                  <div key={act.id} className={`rounded-xl p-4 border ${act.type === 'Pédagogique' ? 'bg-blue-50 border-blue-100' : 'bg-purple-50 border-purple-100'}`}>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${act.type === 'Pédagogique' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {act.type}
                    </span>
                    <p className="font-bold text-gray-800 text-sm mt-2">{act.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(act.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && <AdminClasses />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'grades' && <AdminGrades />}
        {activeTab === 'payments' && <AdminPayments />}
        {activeTab === 'activities' && <AdminActivities />}
      </div>
    </div>
  );
}

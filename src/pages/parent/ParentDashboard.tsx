import { useState } from 'react';
import { Users, BookOpen, Calendar, CreditCard, Activity, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GradesView from '../shared/GradesView';
import ActivitiesPage from '../shared/ActivitiesPage';

const months = ['Octobre', 'Novembre', 'Décembre', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];

const tabs = [
  { id: 'grades', label: 'Notes', icon: BookOpen },
  { id: 'absences', label: 'Absences', icon: Calendar },
  { id: 'payments', label: 'Paiements', icon: CreditCard },
  { id: 'activities', label: 'Activités', icon: Activity },
];

export default function ParentDashboard() {
  const { state, getParentChildren, getStudentAbsences, getStudentPayments, getStudentClass } = useApp();
  const [activeTab, setActiveTab] = useState('grades');
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  
  const parent = state.currentUser!;
  const children = getParentChildren(parent.id);

  // Auto-select first child
  const effectiveChildId = selectedChildId || children[0]?.id || '';
  const selectedChild = state.users.find(u => u.id === effectiveChildId);
  const childClass = effectiveChildId ? getStudentClass(effectiveChildId) : undefined;
  const childAbsences = effectiveChildId ? getStudentAbsences(effectiveChildId) : [];
  const childPayments = effectiveChildId ? getStudentPayments(effectiveChildId) : [];

  const inscription = childPayments.find(p => p.type === 'Inscription');
  const mensualites = childPayments.filter(p => p.type === 'Mensualité');
  const paidAmount = childPayments.filter(p => p.paid).reduce((s, p) => s + p.amount, 0);
  const totalAmount = childPayments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-green-200 text-sm">Portail Parents</p>
          <h2 className="text-xl font-bold">{parent.name}</h2>
          {children.length > 0 && (
            <p className="text-green-100 text-sm mt-1">
              {children.length} enfant{children.length > 1 ? 's' : ''} inscrit{children.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Child selector */}
        {children.length > 1 && (
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sélectionner un enfant</label>
            <div className="relative">
              <select
                value={effectiveChildId}
                onChange={e => setSelectedChildId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm font-semibold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              >
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name} – {getStudentClass(child.id)?.name || 'Classe inconnue'}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {children.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Aucun enfant associé à votre compte</p>
            <p className="text-sm">Contactez l'administration pour l'association de votre compte</p>
          </div>
        )}

        {selectedChild && (
          <>
            {/* Child info card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg">
                {selectedChild.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{selectedChild.name}</p>
                <p className="text-sm text-gray-500">{childClass?.name || '–'} · Matricule: {selectedChild.login}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">{childAbsences.filter(a => a.type === 'Absence').length} abs.</p>
                <p className="text-xs text-gray-400">{childAbsences.filter(a => a.type === 'Retard').length} retard(s)</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 gap-1 overflow-x-auto">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0 flex-1 justify-center ${
                    activeTab === id
                      ? 'bg-green-600 text-white shadow'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'grades' && <GradesView studentId={effectiveChildId} />}

            {activeTab === 'absences' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{childAbsences.filter(a => a.type === 'Absence').length}</p>
                    <p className="text-xs text-gray-500">Absences</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-orange-500">{childAbsences.filter(a => a.type === 'Retard').length}</p>
                    <p className="text-xs text-gray-500">Retards</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{childAbsences.filter(a => a.justified).length}</p>
                    <p className="text-xs text-gray-500">Justifiés</p>
                  </div>
                </div>

                {childAbsences.length > 0 ? (
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
                          {childAbsences.map(ab => (
                            <tr key={ab.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-700">{ab.date}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ab.type === 'Absence' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                  {ab.type}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-sm font-semibold ${ab.justified ? 'text-green-600' : 'text-red-500'}`}>
                                  {ab.justified ? '✓ Oui' : '✗ Non'}
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
                    <p>Aucune absence enregistrée</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <p className="text-xs text-gray-500">Total payé</p>
                    <p className="text-xl font-bold text-green-600">{paidAmount.toLocaleString()} FCFA</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                    <p className="text-xs text-gray-500">Restant dû</p>
                    <p className="text-xl font-bold text-red-500">{(totalAmount - paidAmount).toLocaleString()} FCFA</p>
                  </div>
                </div>

                {/* Inscription */}
                {inscription && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Frais d'inscription</p>
                          <p className="text-sm text-gray-500">{inscription.amount.toLocaleString()} FCFA</p>
                        </div>
                      </div>
                      {inscription.paid ? (
                        <div className="text-right">
                          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">✓ Payé</span>
                          <p className="text-xs text-gray-400 mt-1">{inscription.paidDate}</p>
                        </div>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-semibold">✗ Impayé</span>
                      )}
                    </div>
                    {inscription.receiptNumber && (
                      <p className="text-xs text-gray-400 mt-2 border-t border-gray-50 pt-2">Reçu: {inscription.receiptNumber}</p>
                    )}
                  </div>
                )}

                {/* Mensualités grid */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-800 mb-4">Mensualités (15 000 FCFA/mois)</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {months.map(month => {
                      const pay = mensualites.find(p => p.month === month);
                      return (
                        <div key={month} className={`rounded-xl p-3 text-center border-2 ${pay?.paid ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-200'}`}>
                          <p className="text-xs font-bold text-gray-700 mb-1">{month.slice(0, 3)}</p>
                          <div className={`text-lg ${pay?.paid ? 'text-green-500' : 'text-red-400'}`}>
                            {pay?.paid ? '✓' : '✗'}
                          </div>
                          <p className={`text-xs font-semibold mt-0.5 ${pay?.paid ? 'text-green-600' : 'text-red-500'}`}>
                            {pay?.paid ? 'Payé' : 'Dû'}
                          </p>
                          {pay?.paidDate && <p className="text-xs text-gray-400">{pay.paidDate.slice(5)}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activities' && <ActivitiesPage />}
          </>
        )}
      </div>
    </div>
  );
}

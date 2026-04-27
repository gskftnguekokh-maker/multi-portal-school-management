import { useState } from 'react';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const months = ['Octobre', 'Novembre', 'Décembre', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];

export default function AdminPayments() {
  const { state, markPaymentPaid, getClassStudents } = useApp();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [filterPaid, setFilterPaid] = useState<'all' | 'paid' | 'unpaid'>('all');

  const classStudents = selectedClass ? getClassStudents(selectedClass) : [];
  const allStudents = state.users.filter(u => u.role === 'student');

  const filteredStudents = selectedClass ? classStudents : allStudents;
  const displayStudents = selectedStudent
    ? filteredStudents.filter(s => s.id === selectedStudent)
    : filteredStudents;

  const getStudentPayments = (studentId: string) => {
    let pays = state.payments.filter(p => p.studentId === studentId);
    if (filterPaid === 'paid') pays = pays.filter(p => p.paid);
    if (filterPaid === 'unpaid') pays = pays.filter(p => !p.paid);
    return pays;
  };

  const totalPaid = state.payments.filter(p => p.paid).reduce((s, p) => s + p.amount, 0);
  const totalDue = state.payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Gestion des Paiements</h2>
        <p className="text-sm text-gray-500">Inscriptions et mensualités 2025/2026</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total encaissé', value: `${(totalPaid / 1000).toFixed(0)}k`, color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
          { label: 'En attente', value: `${((totalDue - totalPaid) / 1000).toFixed(0)}k`, color: 'bg-red-50 text-red-700 border-red-200', icon: Clock },
          { label: 'Paiements effectués', value: state.payments.filter(p => p.paid).length, color: 'bg-blue-50 text-blue-700 border-blue-200', icon: CreditCard },
          { label: 'Impayés', value: state.payments.filter(p => !p.paid).length, color: 'bg-orange-50 text-orange-700 border-orange-200', icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className={`rounded-2xl border p-4 ${color}`}>
            <Icon className="w-5 h-5 mb-2 opacity-70" />
            <p className="text-xl font-bold">{value} {typeof value === 'number' ? '' : 'FCFA'}</p>
            <p className="text-xs font-medium opacity-70">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Classe</label>
          <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedStudent(''); }}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="">Toutes les classes</option>
            {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Élève</label>
          <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="">Tous les élèves</option>
            {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Statut</label>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(['all', 'paid', 'unpaid'] as const).map(f => (
              <button key={f} onClick={() => setFilterPaid(f)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterPaid === f ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>
                {f === 'all' ? 'Tous' : f === 'paid' ? 'Payés' : 'Impayés'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payments per student */}
      <div className="space-y-4">
        {displayStudents.slice(0, 10).map(student => {
          const pays = getStudentPayments(student.id);
          if (pays.length === 0) return null;
          const studentClass = state.classes.find(c => c.studentIds.includes(student.id));
          const inscription = pays.find(p => p.type === 'Inscription');
          const mensualites = pays.filter(p => p.type === 'Mensualité');
          const paidCount = mensualites.filter(p => p.paid).length;
          const totalStudentDue = pays.reduce((s, p) => s + p.amount, 0);
          const totalStudentPaid = pays.filter(p => p.paid).reduce((s, p) => s + p.amount, 0);

          return (
            <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{student.name}</p>
                    <p className="text-xs text-gray-500">{studentClass?.name || '–'} · {paidCount}/{mensualites.length} mensualités</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{(totalStudentPaid / 1000).toFixed(0)}k FCFA</p>
                  <p className="text-xs text-gray-400">/ {(totalStudentDue / 1000).toFixed(0)}k FCFA</p>
                </div>
              </div>
              <div className="p-4">
                {/* Inscription */}
                {inscription && (filterPaid === 'all' || (filterPaid === 'paid' && inscription.paid) || (filterPaid === 'unpaid' && !inscription.paid)) && (
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold text-gray-700">Inscription</span>
                      <span className="text-xs text-gray-400">{inscription.amount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {inscription.paid ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600">{inscription.paidDate}</span>
                          <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{inscription.receiptNumber}</span>
                        </div>
                      ) : (
                        <button onClick={() => markPaymentPaid(inscription.id)}
                          className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                          Marquer payé
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Mensualités */}
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
                  {months.map(month => {
                    const pay = mensualites.find(p => p.month === month);
                    if (!pay) return null;
                    if (filterPaid === 'paid' && !pay.paid) return null;
                    if (filterPaid === 'unpaid' && pay.paid) return null;
                    return (
                      <div key={month} className={`rounded-lg p-2 text-center border ${pay.paid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <p className="text-xs font-semibold text-gray-700">{month.slice(0, 3)}</p>
                        <p className={`text-xs font-bold ${pay.paid ? 'text-green-600' : 'text-red-500'}`}>
                          {pay.paid ? '✓' : '✗'}
                        </p>
                        {!pay.paid && (
                          <button onClick={() => markPaymentPaid(pay.id)}
                            className="text-xs text-green-600 hover:text-green-800 font-semibold mt-0.5">
                            Payer
                          </button>
                        )}
                        {pay.paid && <p className="text-xs text-gray-400 truncate">{pay.paidDate?.slice(5)}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

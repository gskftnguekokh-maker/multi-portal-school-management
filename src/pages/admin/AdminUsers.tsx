import { useState } from 'react';
import { Search, Edit2, Trash2, Eye, EyeOff, X, Save, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, studentData, teacherData, parentData } from '../../data/store';

type FilterRole = 'all' | 'teacher' | 'parent' | 'student';

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  teacher: 'bg-blue-100 text-blue-800',
  parent: 'bg-green-100 text-green-800',
  student: 'bg-orange-100 text-orange-800',
};
const roleLabels: Record<string, string> = {
  admin: 'Admin',
  teacher: 'Enseignant',
  parent: 'Parent',
  student: 'Élève',
};

interface FormData {
  name: string;
  login: string;
  password: string;
  role: 'teacher' | 'parent' | 'student';
  email: string;
  phone: string;
  classId: string;
  parentId: string;
}

const defaultForm: FormData = {
  name: '', login: '', password: '', role: 'student',
  email: '', phone: '', classId: '', parentId: '',
};

export default function AdminUsers() {
  const { state, addUser, updateUser, removeUser,
    assignChildToParent, setStudentClass } = useApp();

  const [filter, setFilter] = useState<FilterRole>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [showPwd, setShowPwd] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const users = state.users.filter(u => u.role !== 'admin');
  const filtered = users.filter(u => {
    const matchRole = filter === 'all' || u.role === filter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.login.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const openAdd = () => {
    setEditUser(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name,
      login: user.login,
      password: user.password,
      role: user.role as any,
      email: user.email || '',
      phone: user.phone || '',
      classId: studentData[user.id]?.classId || '',
      parentId: studentData[user.id]?.parentId || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser) {
      updateUser(editUser.id, {
        name: form.name,
        login: form.login,
        password: form.password,
        email: form.email,
        phone: form.phone,
      });
      if (editUser.role === 'student' && form.classId) {
        setStudentClass(editUser.id, form.classId);
      }
    } else {
      const newUser = addUser({
        name: form.name,
        login: form.login,
        password: form.password,
        role: form.role,
        email: form.email,
        phone: form.phone,
      } as any);

      if (form.role === 'student' && form.classId) {
        setStudentClass(newUser.id, form.classId);
      }
      if (form.role === 'student' && form.parentId) {
        assignChildToParent(form.parentId, newUser.id);
      }
    }
    setShowForm(false);
  };

  const teachers = state.users.filter(u => u.role === 'teacher');
  const parents = state.users.filter(u => u.role === 'parent');
  const students = state.users.filter(u => u.role === 'student');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
          <p className="text-sm text-gray-500">{teachers.length} enseignants · {parents.length} parents · {students.length} élèves</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition-colors">
          <UserPlus className="w-4 h-4" /> Ajouter un utilisateur
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou login…"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(['all', 'teacher', 'parent', 'student'] as FilterRole[]).map(r => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === r ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {r === 'all' ? 'Tous' : r === 'teacher' ? 'Enseignants' : r === 'parent' ? 'Parents' : 'Élèves'}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nom</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Login / Matricule</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Mot de passe</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rôle</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Info</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(user => {
                const sData = studentData[user.id];
                const tIds = teacherData[user.id];
                const pData = parentData[user.id];
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800 truncate max-w-[120px] sm:max-w-none">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{user.login}</code>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <code className="text-xs bg-yellow-50 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200">
                          {showPwd[user.id] ? user.password : '••••••••'}
                        </code>
                        <button onClick={() => setShowPwd(prev => ({ ...prev, [user.id]: !prev[user.id] }))}
                          className="text-gray-400 hover:text-gray-600">
                          {showPwd[user.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">
                      {user.role === 'student' && sData && (
                        <span>Classe: {state.classes.find(c => c.id === sData.classId)?.name || '–'}</span>
                      )}
                      {user.role === 'teacher' && tIds && (
                        <span>{(tIds.classIds || []).length} classe(s)</span>
                      )}
                      {user.role === 'parent' && pData && (
                        <span>{pData.childrenIds.length} enfant(s)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(user)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(user.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">Aucun utilisateur trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Confirmer la suppression</h3>
            <p className="text-gray-500 text-sm mb-4">Cette action est irréversible. L'utilisateur perdra l'accès à l'application.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Annuler</button>
              <button onClick={() => { removeUser(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-green-600" />
                {editUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editUser && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rôle *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['teacher', 'parent', 'student'] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, role: r }))}
                        className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${form.role === r ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                      >
                        {r === 'teacher' ? '👨‍🏫 Enseignant' : r === 'parent' ? '👨‍👩‍👧 Parent' : '🎒 Élève'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required placeholder="Prénom NOM"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Login *</label>
                  <input value={form.login} onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
                    required placeholder="ex: prof.fall"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe *</label>
                  <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required placeholder="Mot de passe"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="77 xxx xx xx"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                {(form.role === 'student' || (editUser?.role === 'student')) && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Classe</label>
                      <select value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="">– Choisir –</option>
                        {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parent</label>
                      <select value={form.parentId} onChange={e => setForm(f => ({ ...f, parentId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="">– Choisir –</option>
                        {state.users.filter(u => u.role === 'parent').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {editUser ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

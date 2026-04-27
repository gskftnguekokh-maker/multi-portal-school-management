import { useState } from 'react';
import { Plus, Trash2, Edit2, X, Save, Calendar, MapPin, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SchoolActivity } from '../../data/store';

export default function AdminActivities() {
  const { state, addActivity, updateActivity, removeActivity } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', type: 'Pédagogique' as SchoolActivity['type'],
    date: '', location: '',
  });

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', description: '', type: 'Pédagogique', date: '', location: '' });
    setShowForm(true);
  };

  const openEdit = (act: SchoolActivity) => {
    setEditId(act.id);
    setForm({ title: act.title, description: act.description, type: act.type, date: act.date, location: act.location || '' });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateActivity(editId, form);
    } else {
      addActivity(form);
    }
    setShowForm(false);
  };

  const sorted = [...state.activities].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Activités Scolaires</h2>
          <p className="text-sm text-gray-500">{state.activities.length} activités planifiées</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition-colors">
          <Plus className="w-4 h-4" /> Nouvelle activité
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map(act => (
          <div key={act.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${act.type === 'Pédagogique' ? 'border-blue-100' : 'border-purple-100'}`}>
            <div className={`px-5 py-3 flex items-start justify-between ${act.type === 'Pédagogique' ? 'bg-blue-50' : 'bg-purple-50'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${act.type === 'Pédagogique' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {act.type}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800">{act.title}</h3>
              </div>
              <div className="flex gap-1 ml-2">
                <button onClick={() => openEdit(act)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => removeActivity(act.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">{act.description}</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(act.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                {act.location && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {act.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="col-span-2 py-12 text-center text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucune activité planifiée</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                {editId ? 'Modifier l\'activité' : 'Nouvelle activité'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type</label>
                <div className="flex gap-2">
                  {(['Pédagogique', 'Extrascolaire'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${form.type === t ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                  placeholder="Titre de l'activité"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={3}
                  placeholder="Description de l'activité"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lieu</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Lieu de l'activité"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Annuler</button>
                <button type="submit" className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {editId ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

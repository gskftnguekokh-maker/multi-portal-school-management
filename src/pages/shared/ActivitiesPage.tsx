import { Calendar, MapPin, BookOpen, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ActivitiesPage() {
  const { state } = useApp();
  const sorted = [...state.activities].sort((a, b) => a.date.localeCompare(b.date));
  const pedagogique = sorted.filter(a => a.type === 'Pédagogique');
  const extrascolaire = sorted.filter(a => a.type === 'Extrascolaire');

  const ActivityCard = ({ act }: { act: typeof state.activities[0] }) => (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${act.type === 'Pédagogique' ? 'border-blue-100' : 'border-purple-100'}`}>
      <div className={`px-5 py-4 ${act.type === 'Pédagogique' ? 'bg-gradient-to-r from-blue-50 to-blue-100' : 'bg-gradient-to-r from-purple-50 to-purple-100'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${act.type === 'Pédagogique' ? 'bg-blue-500' : 'bg-purple-500'}`}>
            {act.type === 'Pédagogique' ? <BookOpen className="w-5 h-5 text-white" /> : <Star className="w-5 h-5 text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${act.type === 'Pédagogique' ? 'bg-blue-200 text-blue-800' : 'bg-purple-200 text-purple-800'}`}>
              {act.type}
            </span>
            <h3 className="font-bold text-gray-800 mt-1">{act.title}</h3>
          </div>
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-sm text-gray-600 leading-relaxed">{act.description}</p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {new Date(act.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          {act.location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {act.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Activités de l'École</h2>
        <p className="text-sm text-gray-500">Calendrier des activités pédagogiques et extrascolaires 2025/2026</p>
      </div>

      {extrascolaire.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-purple-500 rounded-full" />
            <h3 className="font-bold text-gray-700 text-lg">Activités Extrascolaires</h3>
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">{extrascolaire.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extrascolaire.map(act => <ActivityCard key={act.id} act={act} />)}
          </div>
        </div>
      )}

      {pedagogique.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-blue-500 rounded-full" />
            <h3 className="font-bold text-gray-700 text-lg">Activités Pédagogiques</h3>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{pedagogique.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pedagogique.map(act => <ActivityCard key={act.id} act={act} />)}
          </div>
        </div>
      )}

      {state.activities.length === 0 && (
        <div className="py-16 text-center text-gray-400">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Aucune activité planifiée</p>
          <p className="text-sm">Les activités seront affichées ici</p>
        </div>
      )}
    </div>
  );
}

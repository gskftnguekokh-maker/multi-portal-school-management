import { useApp } from '../../context/AppContext';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

interface GradesViewProps {
  studentId: string;
}

const gradeColor = (v: number) =>
  v >= 16 ? 'text-green-700 bg-green-100' :
  v >= 14 ? 'text-blue-700 bg-blue-100' :
  v >= 10 ? 'text-orange-600 bg-orange-100' :
  'text-red-600 bg-red-100';

const mention = (avg: number) =>
  avg >= 16 ? { label: 'Très Bien', color: 'text-green-600' } :
  avg >= 14 ? { label: 'Bien', color: 'text-blue-600' } :
  avg >= 12 ? { label: 'Assez Bien', color: 'text-teal-600' } :
  avg >= 10 ? { label: 'Passable', color: 'text-orange-600' } :
  { label: 'Insuffisant', color: 'text-red-600' };

export default function GradesView({ studentId }: GradesViewProps) {
  const { state, getStudentGrades, getStudentClass } = useApp();
  const grades = getStudentGrades(studentId);
  const studentClass = getStudentClass(studentId);

  const trimesterGroups = [1, 2, 3].map(t => ({
    trimester: t,
    grades: grades.filter(g => g.trimester === t),
  }));

  // Calculate subject averages
  const subjectAverages = state.subjects.map(subject => {
    const subGrades = grades.filter(g => g.subjectId === subject.id);
    const avg = subGrades.length ? subGrades.reduce((s, g) => s + g.value, 0) / subGrades.length : null;
    return { subject, avg, count: subGrades.length };
  }).filter(x => x.avg !== null);

  const overallAvg = subjectAverages.length
    ? subjectAverages.reduce((s, x) => s + (x.avg! * x.subject.coefficient), 0) /
      subjectAverages.reduce((s, x) => s + x.subject.coefficient, 0)
    : null;

  const men = overallAvg !== null ? mention(overallAvg) : null;

  return (
    <div className="space-y-5">
      {/* Summary */}
      {overallAvg !== null && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-5 border border-green-100">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-700">{overallAvg.toFixed(2)}</p>
              <p className="text-xs text-gray-500">/20 Moyenne générale</p>
            </div>
            <div className="flex-1">
              <div className={`text-lg font-bold ${men?.color}`}>{men?.label}</div>
              <p className="text-xs text-gray-500">Classe : {studentClass?.name || '–'}</p>
              <p className="text-xs text-gray-500">{grades.length} note(s) · {subjectAverages.length} matière(s)</p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map(t => {
                const tGrades = grades.filter(g => g.trimester === t);
                const tAvg = tGrades.length ? tGrades.reduce((s, g) => s + g.value, 0) / tGrades.length : null;
                return (
                  <div key={t} className="text-center bg-white rounded-xl px-3 py-2 border border-gray-100 shadow-sm">
                    <p className="text-sm font-bold text-gray-700">{tAvg ? tAvg.toFixed(1) : '–'}</p>
                    <p className="text-xs text-gray-400">T{t}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Subject averages */}
      {subjectAverages.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" /> Moyennes par matière
          </h3>
          <div className="space-y-3">
            {subjectAverages.map(({ subject, avg, count }) => (
              <div key={subject.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 truncate">{subject.name}</span>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-xs text-gray-400">Coef. {subject.coefficient}</span>
                      <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${gradeColor(avg!)}`}>
                        {avg!.toFixed(2)}/20
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${avg! >= 14 ? 'bg-green-500' : avg! >= 10 ? 'bg-orange-400' : 'bg-red-400'}`}
                      style={{ width: `${(avg! / 20) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-trimester detail */}
      {trimesterGroups.map(({ trimester, grades: tGrades }) => {
        if (tGrades.length === 0) return null;
        const tAvg = tGrades.reduce((s, g) => s + g.value, 0) / tGrades.length;
        return (
          <div key={trimester} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-600" />
                {trimester === 1 ? '1er' : `${trimester}e`} Trimestre
              </h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className={`font-bold text-sm px-2 py-0.5 rounded-lg ${gradeColor(tAvg)}`}>
                  Moy. {tAvg.toFixed(2)}/20
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Matière</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Type</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Note</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hidden sm:table-cell">Date</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hidden md:table-cell">Commentaire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tGrades.map(g => {
                    const subject = state.subjects.find(s => s.id === g.subjectId);
                    return (
                      <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-700">{subject?.name || g.subjectId}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${g.type === 'Composition' ? 'bg-purple-100 text-purple-700' : g.type === 'Examen' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {g.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold text-base px-2 py-0.5 rounded-lg ${gradeColor(g.value)}`}>
                            {g.value}/20
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">{g.date}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{g.comment || '–'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {grades.length === 0 && (
        <div className="py-12 text-center text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Aucune note enregistrée pour le moment</p>
        </div>
      )}
    </div>
  );
}

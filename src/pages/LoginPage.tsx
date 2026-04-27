import { useState } from 'react';
import { School, Lock, User, Eye, EyeOff, Shield, BookOpen, Users, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SenegalFlag = () => (
  <svg width="48" height="32" viewBox="0 0 48 32" className="rounded-md shadow-md border border-gray-200">
    <rect width="16" height="32" fill="#00853F" />
    <rect x="16" width="16" height="32" fill="#FDEF42" />
    <rect x="32" width="16" height="32" fill="#E31B23" />
    <g transform="translate(24,16)">
      <polygon points="0,-7 1.6,−2.2 6.6,-2.2 2.7,0.9 4.2,5.7 0,2.8 -4.2,5.7 -2.7,0.9 -6.6,-2.2 -1.6,-2.2"
        fill="#00853F" transform="scale(0.9)" />
    </g>
  </svg>
);

const portals = [
  {
    role: 'admin',
    label: 'Administration',
    icon: Shield,
    color: 'from-purple-600 to-purple-800',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    desc: 'Gestion complète de l\'établissement',
    hint: 'login: admin / Mot de passe: Admin@2025',
  },
  {
    role: 'teacher',
    label: 'Professeurs',
    icon: BookOpen,
    color: 'from-blue-600 to-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    desc: 'Notes, classes et informations pédagogiques',
    hint: 'login: prof.sow / Mot de passe: Prof@123',
  },
  {
    role: 'parent',
    label: 'Parents',
    icon: Users,
    color: 'from-green-600 to-green-800',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    desc: 'Suivi de vos enfants et paiements',
    hint: 'login: parent.ba / Mot de passe: Parent@123',
  },
  {
    role: 'student',
    label: 'Élèves',
    icon: GraduationCap,
    color: 'from-orange-500 to-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    desc: 'Vos notes, absences et actualités',
    hint: 'Matricule: KFT2526-6A-001 / MDP: Eleve@001',
  },
];

export default function LoginPage() {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loginVal, setLoginVal] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedPortal = portals.find(p => p.role === selectedRole);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const user = login(loginVal.trim(), password);
    if (!user) {
      setError('Identifiant ou mot de passe incorrect. Vérifiez vos informations.');
    }
    setLoading(false);
  };

  const handlePortalSelect = (role: string) => {
    setSelectedRole(role);
    setLoginVal('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex flex-col">
      {/* Header */}
      <div className="bg-green-950/60 text-green-100 text-xs py-1.5 px-4 text-center">
        🇸🇳 Académie de Thiès – IEF Mbour1 &nbsp;|&nbsp; Année Scolaire 2025–2026
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-4 py-8 gap-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="bg-white rounded-full p-4 shadow-2xl">
              <School className="w-12 h-12 text-green-700" />
            </div>
            <SenegalFlag />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide font-poppins drop-shadow-lg">
            KEUR FATOU TALL
          </h1>
          <p className="text-green-200 text-sm mt-1">Établissement Moyen Secondaire Privé</p>
          <p className="text-green-300 text-xs mt-1">Gestion Scolaire 2025 – 2026</p>
        </div>

        {/* Portals */}
        <div className="w-full max-w-4xl">
          <h2 className="text-center text-white font-semibold text-lg mb-4">
            Choisissez votre portail de connexion
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {portals.map(({ role, label, icon: Icon, color, bg, border, text, desc }) => (
              <button
                key={role}
                onClick={() => handlePortalSelect(role)}
                className={`relative flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 ${
                  selectedRole === role
                    ? `${bg} ${border} scale-105 shadow-xl ring-2 ring-offset-1 ring-green-400`
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`font-bold text-sm sm:text-base ${selectedRole === role ? text : 'text-white'}`}>
                  {label}
                </span>
                <span className={`text-xs text-center leading-tight hidden sm:block ${selectedRole === role ? 'text-gray-500' : 'text-green-200'}`}>
                  {desc}
                </span>
                {selectedRole === role && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Login form */}
        {selectedRole && selectedPortal && (
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Form header */}
              <div className={`bg-gradient-to-r ${selectedPortal.color} px-6 py-4`}>
                <div className="flex items-center gap-3">
                  <selectedPortal.icon className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="text-white font-bold text-lg">Portail {selectedPortal.label}</h3>
                    <p className="text-white/80 text-xs">{selectedPortal.desc}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleLogin} className="p-6 flex flex-col gap-4">
                {/* Hint */}
                <div className={`text-xs ${selectedPortal.bg} ${selectedPortal.border} border rounded-lg p-3 ${selectedPortal.text}`}>
                  <span className="font-semibold">💡 Démo: </span>{selectedPortal.hint}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {selectedRole === 'student' ? 'Matricule' : 'Identifiant (Login)'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={loginVal}
                      onChange={e => setLoginVal(e.target.value)}
                      placeholder={selectedRole === 'student' ? 'KFT2526-...' : 'Votre identifiant'}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Votre mot de passe"
                      required
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r ${selectedPortal.color} text-white font-bold py-3 rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 shadow-md`}
                >
                  {loading ? (
                    <><span className="animate-spin">⟳</span> Connexion…</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Se connecter</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 text-center"
                >
                  ← Changer de portail
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-green-300 text-xs text-center mt-auto">
          © 2025 KEUR FATOU TALL – Mbour, Sénégal
        </p>
      </div>
    </div>
  );
}

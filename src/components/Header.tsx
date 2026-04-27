import { School, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

const SenegalFlag = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" className="rounded shadow-sm border border-gray-200">
    <rect width="12" height="24" fill="#00853F" />
    <rect x="12" width="12" height="24" fill="#FDEF42" />
    <rect x="24" width="12" height="24" fill="#E31B23" />
    {/* Star */}
    <polygon
      points="18,8 19.5,12.5 24,12.5 20.5,15 21.5,19.5 18,17 14.5,19.5 15.5,15 12,12.5 16.5,12.5"
      fill="#00853F"
      transform="scale(0.65) translate(9.5, 3)"
    />
  </svg>
);

const roleLabels: Record<string, { label: string; color: string }> = {
  admin: { label: 'Administrateur', color: 'bg-purple-100 text-purple-800' },
  teacher: { label: 'Enseignant', color: 'bg-blue-100 text-blue-800' },
  parent: { label: 'Parent', color: 'bg-green-100 text-green-800' },
  student: { label: 'Élève', color: 'bg-orange-100 text-orange-800' },
};

export default function Header() {
  const { state, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const roleInfo = state.currentUser ? roleLabels[state.currentUser.role] : null;

  return (
    <header className="bg-gradient-to-r from-green-800 via-green-700 to-green-800 shadow-xl sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-green-900/60 text-xs text-green-100 px-4 py-1 flex items-center justify-between">
        <span className="font-medium tracking-wide">🇸🇳 Académie de Thiès – IEF Mbour1</span>
        <span className="hidden sm:block">Année Scolaire 2025 – 2026</span>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 bg-white rounded-full p-2 shadow-lg">
            <School className="w-7 h-7 text-green-700" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-white font-bold text-lg sm:text-xl leading-tight font-poppins tracking-wide truncate">
                KEUR FATOU TALL
              </h1>
              <SenegalFlag />
            </div>
            <p className="text-green-200 text-xs truncate hidden sm:block">
              Établissement Moyen Secondaire Privé
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {state.currentUser && (
            <>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white text-sm font-semibold leading-tight">{state.currentUser.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleInfo?.color}`}>
                    {roleInfo?.label}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:block">Déconnexion</span>
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-white p-1.5 rounded-lg hover:bg-green-600 transition-colors"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && state.currentUser && (
        <div className="md:hidden bg-green-900 border-t border-green-700 px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
              {state.currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{state.currentUser.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleInfo?.color}`}>
                {roleInfo?.label}
              </span>
            </div>
          </div>
          <button
            onClick={() => { logout(); setMenuOpen(false); }}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg transition-colors font-medium w-full justify-center"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}

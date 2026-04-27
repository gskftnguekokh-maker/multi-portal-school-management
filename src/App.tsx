import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

function AppRouter() {
  const { state } = useApp();
  const user = state.currentUser;

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'teacher' && <TeacherDashboard />}
        {user.role === 'parent' && <ParentDashboard />}
        {user.role === 'student' && <StudentDashboard />}
      </main>
      <footer className="bg-green-900 text-green-200 text-center text-xs py-3 px-4">
        <p>
          © 2025–2026 <strong className="text-white">KEUR FATOU TALL</strong> – Académie de Thiès, IEF Mbour1, Sénégal
          &nbsp;·&nbsp; Tous droits réservés
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

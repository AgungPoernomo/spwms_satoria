import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import DashboardPage from './pages/DashboardPage';
import SparePartsPage from './pages/SparePartsPage';
import IncomingTransactionPage from './pages/IncomingTransactionPage';
import OutgoingTransactionPage from './pages/OutgoingTransactionPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import StockGudangPage from './pages/StockGudangPage';
import DataMasterPage from './pages/DataMasterPage';
import DataSupplierPage from './pages/DataSupplierPage';
import StockOpnamePage from './pages/StockOpnamePage';
import SettingsPage from './pages/SettingsPage';
import LifetimePartPage from './pages/LifetimePartPage';
import SparePartsRepairPage from './pages/SparePartsRepairPage';
import LogAktivitasPage from './pages/LogAktivitasPage';
import { AuthProvider, useAuth } from './context/AuthContext';

import ToastContainer from './components/common/Toast';

function Layout({ children }) {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8 relative">
          <div className="max-w-[1600px] mx-auto w-full h-full pb-10">
            {children}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}


function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/data-master" element={<DataMasterPage />} />
          <Route path="/data-supplier" element={<DataSupplierPage />} />
          <Route path="/spare-parts" element={<SparePartsPage />} />
          <Route path="/stock-gudang" element={<StockGudangPage />} />
          <Route path="/barang-masuk" element={<IncomingTransactionPage />} />
          <Route path="/stock-used" element={<OutgoingTransactionPage />} />
          <Route path="/stock-opname" element={<StockOpnamePage />} />
          <Route path="/lifetime-part" element={<LifetimePartPage />} />
          <Route path="/spare-parts-repair" element={<SparePartsRepairPage />} />
          <Route path="/log-aktivitas" element={<LogAktivitasPage />} />
          <Route path="/laporan" element={<ReportsPage />} />
          <Route path="/pengaturan" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}



import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CustomerPage from "./pages/CustomerPage";
import RoomPage from "./pages/RoomPage";
import CustomersPage from "./pages/CustomersPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import TileCatalogPage from "./pages/TileCatalogPage";
import ChitArchivePage from "./pages/ChitArchivePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Auth protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('tileapp_user');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path="/customer/new" element={
              <ProtectedRoute>
                <CustomerPage />
              </ProtectedRoute>
            } />
            
            <Route path="/rooms/new" element={
              <ProtectedRoute>
                <RoomPage />
              </ProtectedRoute>
            } />
            
            <Route path="/customers" element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/tiles" element={
              <ProtectedRoute>
                <TileCatalogPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/chits" element={
              <ProtectedRoute>
                <ChitArchivePage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

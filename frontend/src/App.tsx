import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import EmployeeRegistration from "./pages/EmployeeRegistration";
import FaceRecognition from "./pages/FaceRecognition";
import AdminLogin from "./pages/AdminLogin";
import AdminOnly from "./pages/AdminOnly";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/recognition" element={<FaceRecognition />} />
          
          {/* Protected Admin Route */}
          <Route
            path="/admin-only"
            element={
              <ProtectedRoute>
                <AdminOnly />
              </ProtectedRoute>
            }
          />
          
          {/* Legacy Protected Routes (with AppLayout) */}
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute>
                  <EmployeeRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

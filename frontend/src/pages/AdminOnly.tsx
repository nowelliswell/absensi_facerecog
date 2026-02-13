import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, UserPlus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/auth-store";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Import page components
import Dashboard from "./Dashboard";
import EmployeeRegistration from "./EmployeeRegistration";
import SettingsPage from "./SettingsPage";

export default function AdminOnly() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      toast({
        title: "Logged out",
        description: "You've been logged out successfully.",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Logout locally even if API fails
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">
                  Welcome, {user?.username || "Admin"}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 mx-auto">
              <TabsTrigger value="dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="register" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Register Employee
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <Dashboard />
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <EmployeeRegistration />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <SettingsPage />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}

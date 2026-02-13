import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Clock, MapPin, Bell, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [confidence, setConfidence] = useState([75]);
  const [settings, setSettings] = useState({
    workStart: "08:00",
    workEnd: "17:00",
    lateThreshold: "15",
    geoRadius: "100",
    notifications: true,
    emailAlerts: false,
    autoCapture: true,
  });

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Your configuration has been updated." });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">Configure system preferences</p>
      </div>

      {/* Recognition */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Face Recognition</h3>
            <p className="text-xs text-muted-foreground">Adjust detection sensitivity</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Confidence Threshold</Label>
            <span className="text-sm font-medium text-primary">{confidence[0]}%</span>
          </div>
          <Slider value={confidence} onValueChange={setConfidence} max={100} min={50} step={5} />
          <p className="text-xs text-muted-foreground">Minimum confidence required to confirm identity</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Auto-Capture Mode</Label>
            <p className="text-xs text-muted-foreground">Automatically capture when a face is detected</p>
          </div>
          <Switch checked={settings.autoCapture} onCheckedChange={(v) => setSettings({ ...settings, autoCapture: v })} />
        </div>
      </motion.div>

      {/* Work Hours */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-xl border border-border bg-card p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
            <Clock className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Working Hours</h3>
            <p className="text-xs text-muted-foreground">Define office schedule</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input type="time" value={settings.workStart} onChange={(e) => setSettings({ ...settings, workStart: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>End Time</Label>
            <Input type="time" value={settings.workEnd} onChange={(e) => setSettings({ ...settings, workEnd: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Late Threshold (minutes)</Label>
          <Input type="number" value={settings.lateThreshold} onChange={(e) => setSettings({ ...settings, lateThreshold: e.target.value })} />
        </div>
      </motion.div>

      {/* Geofencing */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-card p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
            <MapPin className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Geofencing</h3>
            <p className="text-xs text-muted-foreground">Location-based attendance validation</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Allowed Radius (meters)</Label>
          <Input type="number" value={settings.geoRadius} onChange={(e) => setSettings({ ...settings, geoRadius: e.target.value })} />
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10">
            <Bell className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <p className="text-xs text-muted-foreground">Alert preferences</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label>Push Notifications</Label>
          <Switch checked={settings.notifications} onCheckedChange={(v) => setSettings({ ...settings, notifications: v })} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label>Email Alerts</Label>
          <Switch checked={settings.emailAlerts} onCheckedChange={(v) => setSettings({ ...settings, emailAlerts: v })} />
        </div>
      </motion.div>

      <Button onClick={handleSave} className="w-full gradient-bg text-primary-foreground border-0 hover:opacity-90 h-11">
        <Save className="mr-2 h-4 w-4" /> Save Settings
      </Button>
    </div>
  );
}

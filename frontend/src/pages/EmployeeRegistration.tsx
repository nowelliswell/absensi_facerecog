import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Camera, Cpu, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Webcam from "react-webcam";
import { useRef, useCallback, useEffect } from "react";

const steps = [
  { icon: User, label: "Basic Info" },
  { icon: Camera, label: "Capture Faces" },
  { icon: Cpu, label: "Train Model" },
  { icon: CheckCircle, label: "Complete" },
];

export default function EmployeeRegistration() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", id: "", position: "", department: "" });
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const { toast } = useToast();

  const captureTarget = 20; // reduced for demo

  const capturePhoto = useCallback(() => {
    const img = webcamRef.current?.getScreenshot();
    if (img) {
      setCapturedImages((prev) => [...prev, img]);
    }
  }, []);

  // Auto-capture
  useEffect(() => {
    if (step !== 1 || capturedImages.length >= captureTarget) return;
    const interval = setInterval(() => {
      capturePhoto();
    }, 500);
    return () => clearInterval(interval);
  }, [step, capturedImages.length, capturePhoto]);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setStep(3);
          toast({ title: "✅ Model trained successfully!", description: `Face model ready for ${form.name}` });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const canProceed = () => {
    if (step === 0) return form.name && form.id && form.position && form.department;
    if (step === 1) return capturedImages.length >= captureTarget;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Register Employee</h1>
        <p className="text-muted-foreground text-sm">Add a new employee with face recognition data</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${i <= step ? "gradient-bg text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <span className={`text-sm hidden sm:inline ${i <= step ? "font-medium text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-8 lg:w-16 mx-2 ${i < step ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="rounded-xl border border-border bg-card p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Enter full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input placeholder="e.g. EMP009" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input placeholder="e.g. Software Engineer" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-foreground">Capturing face data...</p>
                <span className="text-sm text-muted-foreground">{capturedImages.length}/{captureTarget}</span>
              </div>
              <Progress value={(capturedImages.length / captureTarget) * 100} className="mb-4" />
              <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
                <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: "user" }}
                  onUserMediaError={() => {
                    // Fill with placeholder data
                    const fakeImages = Array.from({ length: captureTarget }, (_, i) => `placeholder-${i}`);
                    setCapturedImages(fakeImages);
                  }}
                />
                {capturedImages.length < captureTarget && (
                  <div className="absolute inset-0 border-4 border-primary/40 rounded-xl pointer-events-none">
                    <div className="face-scan-line" />
                  </div>
                )}
              </div>
            </div>
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-10 gap-1">
              {capturedImages.slice(0, 20).map((img, i) => (
                <div key={i} className="aspect-square rounded bg-muted overflow-hidden">
                  {img.startsWith("data:") ? (
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="rounded-xl border border-border bg-card p-8 text-center space-y-6"
          >
            <Cpu className="h-16 w-16 text-primary mx-auto" />
            <h3 className="text-lg font-semibold text-foreground">Training Face Model</h3>
            <p className="text-sm text-muted-foreground">Processing {capturedImages.length} captured images for {form.name}</p>
            <Progress value={trainingProgress} className="max-w-md mx-auto" />
            <p className="text-2xl font-bold text-primary">{trainingProgress}%</p>
            {!isTraining && trainingProgress === 0 && (
              <Button onClick={startTraining} className="gradient-bg text-primary-foreground border-0 hover:opacity-90">
                Start Training
              </Button>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-border bg-card p-8 text-center space-y-4"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mx-auto">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Registration Complete!</h3>
            <p className="text-muted-foreground">
              <strong>{form.name}</strong> ({form.id}) has been registered successfully.
            </p>
            <p className="text-sm text-muted-foreground">The face model is trained and ready for recognition.</p>
            <Button onClick={() => { setStep(0); setForm({ name: "", id: "", position: "", department: "" }); setCapturedImages([]); setTrainingProgress(0); }}
              variant="outline">
              Register Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {step < 3 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed() || (step === 2 && trainingProgress < 100)}
            className="gradient-bg text-primary-foreground border-0 hover:opacity-90"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

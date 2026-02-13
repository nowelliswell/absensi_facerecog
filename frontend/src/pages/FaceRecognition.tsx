import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockAttendance } from "@/lib/mock-data";

interface RecognitionEvent {
  id: string;
  name: string;
  confidence: number;
  time: string;
  status: "recognized" | "unknown";
}

export default function FaceRecognition() {
  const webcamRef = useRef<Webcam>(null);
  const [events, setEvents] = useState<RecognitionEvent[]>([
    { id: "1", name: "Ahmad Fauzi", confidence: 98.5, time: "08:02", status: "recognized" },
    { id: "2", name: "Siti Nurhaliza", confidence: 97.2, time: "08:15", status: "recognized" },
    { id: "3", name: "Unknown Person", confidence: 32.1, time: "08:20", status: "unknown" },
  ]);
  const [scanning, setScanning] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);

  // Simulate periodic recognition
  useEffect(() => {
    if (!scanning) return;
    const names = ["Budi Santoso", "Dewi Lestari", "Rizki Pratama", "Maya Putri"];
    const interval = setInterval(() => {
      const isKnown = Math.random() > 0.3;
      const newEvent: RecognitionEvent = {
        id: Date.now().toString(),
        name: isKnown ? names[Math.floor(Math.random() * names.length)] : "Unknown Person",
        confidence: isKnown ? 85 + Math.random() * 15 : 20 + Math.random() * 25,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        status: isKnown ? "recognized" : "unknown",
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, 20));
    }, 5000);
    return () => clearInterval(interval);
  }, [scanning]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Face Recognition</h1>
          <p className="text-muted-foreground text-sm">Real-time monitoring and attendance detection</p>
        </div>
        <Badge className={scanning ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}>
          <span className={`mr-1.5 h-2 w-2 rounded-full inline-block ${scanning ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
          {scanning ? "Live" : "Paused"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 min-h-[70vh]">
        {/* Camera - 70% */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-border bg-foreground/5">
          {cameraActive ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              className="w-full h-full object-cover min-h-[400px]"
              videoConstraints={{ facingMode: "user" }}
              onUserMediaError={() => setCameraActive(false)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground gap-3">
              <ScanFace className="h-20 w-20 opacity-20" />
              <p className="text-sm">Camera preview — grant permission for live feed</p>
            </div>
          )}

          {/* Simulated bounding box */}
          {scanning && (
            <motion.div
              className="absolute border-2 border-primary rounded-lg"
              animate={{
                top: ["30%", "28%", "30%"],
                left: ["35%", "33%", "35%"],
                width: ["30%", "32%", "30%"],
                height: ["45%", "47%", "45%"],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -top-6 left-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                Scanning...
              </div>
              {/* Corner marks */}
              <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl" />
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr" />
              <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl" />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br" />
            </motion.div>
          )}
        </div>

        {/* Live Feed - 30% */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground text-sm">Live Feed</h3>
            <p className="text-xs text-muted-foreground">{events.length} events detected</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <AnimatePresence>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-lg p-3 border ${event.status === "recognized" ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"}`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full ${event.status === "recognized" ? "bg-success/10" : "bg-destructive/10"}`}>
                      {event.status === "recognized" ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{event.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{event.time}</span>
                        <span className={`text-xs font-medium ${event.status === "recognized" ? "text-success" : "text-destructive"}`}>
                          {event.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

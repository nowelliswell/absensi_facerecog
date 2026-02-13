import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CheckCircle, Clock, MapPin, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { faceAPI, attendanceAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AttendanceRecord {
  id: number;
  employeeName: string;
  clockIn: string;
  status: string;
}

export default function Attendance() {
  const webcamRef = useRef<Webcam>(null);
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognized, setRecognized] = useState<{
    name: string; id: string; position: string; confidence: number;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cameraActive, setCameraActive] = useState(true);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Get geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  // Fetch recent attendance
  useEffect(() => {
    const fetchRecentAttendance = async () => {
      try {
        const data = await attendanceAPI.getToday();
        console.log("Recent attendance data:", data);
        setRecentAttendance(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      }
    };
    fetchRecentAttendance();
    // Refresh every 30 seconds
    const interval = setInterval(fetchRecentAttendance, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) {
      toast({
        title: "❌ Camera Error",
        description: "Camera is not available",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setRecognized(null);

    try {
      // Capture image from webcam
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Failed to capture image");
      }

      console.log("Image captured, size:", imageSrc.length);
      console.log("Image format:", imageSrc.substring(0, 30));

      // Recognize face
      const recognitionResult = await faceAPI.recognize(imageSrc);
      console.log("Recognition result:", recognitionResult);

      if (recognitionResult.success && recognitionResult.recognized && recognitionResult.employee) {
        // Face recognized
        const employee = recognitionResult.employee;
        setRecognized({
          name: employee.name || "Unknown",
          id: employee.id || "N/A",
          position: employee.position || "Employee",
          confidence: employee.confidence || 0,
        });

        // Clock in
        const clockInData = {
          employeeId: employee.id,
          latitude: location?.lat?.toString() || "0",
          longitude: location?.lng?.toString() || "0",
        };

        try {
          const attendanceResult = await attendanceAPI.clockIn(clockInData);

          if (attendanceResult.success) {
            toast({
              title: "✅ Attendance Recorded",
              description: `${employee.name} clocked in at ${currentTime.toLocaleTimeString()}`,
            });

            // Refresh recent attendance
            const updatedAttendance = await attendanceAPI.getToday();
            console.log("Updated attendance after clock-in:", updatedAttendance);
            setRecentAttendance(updatedAttendance.slice(0, 4));
          }
        } catch (clockInError: any) {
          // Handle clock-in errors (including 400 for double check-in)
          const errorData = clockInError.response?.data;
          console.error("Clock-in error:", errorData);
          
          if (errorData?.already_checked_in) {
            toast({
              title: "⚠️ Sudah Check-In",
              description: errorData.message || "Anda sudah check-in hari ini",
              variant: "destructive",
            });
          } else {
            toast({
              title: "⚠️ Clock In Failed",
              description: errorData?.message || "Failed to record attendance",
              variant: "destructive",
            });
          }
        }
      } else {
        // Face not recognized
        console.warn("Face not recognized:", recognitionResult);
        toast({
          title: "❌ Face Not Recognized",
          description: recognitionResult.message || "Please try again or register first",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Recognition error:", error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to process face recognition",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast, currentTime, location]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clock In / Out</h1>
        <p className="text-muted-foreground text-sm">Use facial recognition to record attendance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 aspect-video"
          >
            {cameraActive ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "user" }}
                onUserMediaError={() => setCameraActive(false)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                <Camera className="h-16 w-16 opacity-30" />
                <p className="text-sm">Camera unavailable — grant permission or use demo mode</p>
              </div>
            )}

            {/* Scan overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                <div className="face-scan-line" />
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <span className="text-sm font-medium text-primary-foreground">Scanning face...</span>
                </div>
              </div>
            )}

            {/* Recognized overlay */}
            <AnimatePresence>
              {recognized && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{recognized.name}</p>
                    <p className="text-sm text-muted-foreground">{recognized.id} · {recognized.position}</p>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    {recognized.confidence}%
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="flex gap-3">
            <Button
              onClick={handleCapture}
              disabled={isProcessing}
              className="gradient-bg text-primary-foreground border-0 hover:opacity-90 flex-1"
            >
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                <><Camera className="mr-2 h-4 w-4" /> Capture & Clock In</>
              )}
            </Button>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4">
          {/* Current Time */}
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground tabular-nums">
              {currentTime.toLocaleTimeString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Location</span>
            </div>
            {location ? (
              <>
                <p className="text-sm text-muted-foreground">Current Location</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {location.lat.toFixed(4)}° {location.lat >= 0 ? 'N' : 'S'}, {location.lng.toFixed(4)}° {location.lng >= 0 ? 'E' : 'W'}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Getting location...</p>
            )}
          </div>

          {/* Recent */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold text-foreground text-sm mb-3">Recent Check-ins</h3>
            <div className="space-y-3">
              {recentAttendance.length > 0 ? (
                recentAttendance.map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{a.clockIn}</p>
                    </div>
                    <Badge variant="outline" className={a.status === "on-time" ? "text-success border-success/20 text-xs" : "text-warning border-warning/20 text-xs"}>
                      {a.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No check-ins today</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

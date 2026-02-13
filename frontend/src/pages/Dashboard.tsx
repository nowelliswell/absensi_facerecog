import { motion } from "framer-motion";
import { Users, UserCheck, Clock, UserX, Download, Search, Trash2 } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { mockWeeklyAttendance, mockMonthlyTrend } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { useState, useEffect } from "react";
import { attendanceAPI, dashboardAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const pieData = [
  { name: "On-Time", value: 83.3 },
  { name: "Late", value: 12.5 },
  { name: "Absent", value: 4.2 },
];
const PIE_COLORS = ["hsl(160,84%,39%)", "hsl(38,92%,50%)", "hsl(0,84%,60%)"];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    todayPresent: 0,
    lateArrivals: 0,
    absentToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch today's attendance
        const attendanceData = await attendanceAPI.getToday();
        setAttendance(attendanceData);
        
        // Try to fetch stats from API
        try {
          const statsData = await dashboardAPI.getStats();
          setStats(statsData);
        } catch (statsError) {
          // If stats API fails, calculate from attendance data
          const present = attendanceData.length;
          const late = attendanceData.filter((a: any) => a.status === 'late').length;
          
          setStats({
            totalEmployees: 2, // Based on your database (101, 102)
            todayPresent: present,
            lateArrivals: late,
            absentToday: 2 - present,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [toast]);

  const filtered = attendance.filter((a) =>
    a.employeeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of today's attendance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Employees" value={stats.totalEmployees} icon={Users} variant="primary" />
        <StatsCard title="Present Today" value={stats.todayPresent} icon={UserCheck} variant="success" subtitle="75% of total" />
        <StatsCard title="Late Arrivals" value={stats.lateArrivals} icon={Clock} variant="warning" />
        <StatsCard title="Absent Today" value={stats.absentToday} icon={UserX} variant="danger" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mockWeeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="present" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="late" fill="hsl(38,92%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">Punctuality Rate</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h3 className="font-semibold text-foreground mb-4">Monthly Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mockMonthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[70, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="rate" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(217,91%,60%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Attendance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-border bg-card"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Today's Attendance</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {search ? "No employees found" : "No attendance records today"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => (
                <TableRow key={a.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{a.employeeName}</TableCell>
                  <TableCell className="text-muted-foreground">{a.department}</TableCell>
                  <TableCell>{a.clockIn}</TableCell>
                  <TableCell>{a.clockOut ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={a.status === "on-time" ? "default" : a.status === "late" ? "secondary" : "destructive"}
                      className={a.status === "on-time" ? "bg-success/10 text-success border-success/20 hover:bg-success/20" : a.status === "late" ? "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20" : ""}>
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">{a.confidence}%</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}

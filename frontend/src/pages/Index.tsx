import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ScanFace, Users, Clock, CheckCircle, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: ScanFace, title: "Face Recognition", description: "AI-powered facial detection for instant, contactless attendance tracking" },
  { icon: Zap, title: "Real-Time Processing", description: "Instant recognition with 99%+ accuracy and sub-second response time" },
  { icon: Shield, title: "Secure & Private", description: "Encrypted face data with enterprise-grade security compliance" },
  { icon: BarChart3, title: "Smart Analytics", description: "Comprehensive dashboards with attendance trends and insights" },
];

const stats = [
  { label: "Employees Active", value: "150+", icon: Users },
  { label: "Today's Attendance", value: "142", icon: CheckCircle },
  { label: "On-Time Rate", value: "94.7%", icon: Clock },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg">
              <ScanFace className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">FaceAttend</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                Admin Panel
              </Button>
            </Link>
            <Link to="/attendance">
              <Button className="gradient-bg text-primary-foreground border-0 hover:opacity-90">
                Clock In Now
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              AI-Powered Attendance System
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-primary-foreground leading-tight">
              Smart Face
              <br />
              <span className="gradient-text">Recognition</span>
              <br />
              Attendance
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/60 max-w-lg leading-relaxed">
              Modernize your workplace attendance with AI facial recognition. Contactless, accurate, and effortless — just look and clock in.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/attendance">
                <Button size="lg" className="gradient-bg text-primary-foreground border-0 hover:opacity-90 h-12 px-8 text-base">
                  Start Clock In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card-dark rounded-2xl p-6 flex items-center gap-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/50">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background py-24">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground">Powerful Features</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Everything you need to manage attendance efficiently
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="hover-lift rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 
      <section className="gradient-hero py-20">
        <div className="max-w-3xl mx-auto text-center px-8">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to modernize your attendance?
          </h2>
          <p className="text-primary-foreground/60 mb-8">
            Get started in minutes. Register employees, train the model, and go.
          </p>
          <Link to="/register">
            <Button size="lg" className="gradient-bg text-primary-foreground border-0 hover:opacity-90 h-12 px-8">
              Register First Employee
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>*/}
    </div>
  );
}

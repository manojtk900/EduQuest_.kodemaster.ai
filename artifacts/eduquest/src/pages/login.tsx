import { useState } from "react";
import { Link } from "wouter";
import { useLoginMutation } from "@/hooks/use-auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles, Gamepad2 } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ data: { username, password } }, {
      onSuccess: () => {
        window.location.href = "/";
      },
      onError: (err) => {
        toast.error(err.message || "Login failed. Check your credentials.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
          alt="Space background" 
          className="w-full h-full object-cover opacity-30 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl gamified-gradient items-center justify-center shadow-xl shadow-primary/20 mb-6">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-black text-white mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground font-semibold">Your next quest awaits. 🚀</p>
        </div>

        <div className="glass-panel rounded-3xl p-8 shadow-2xl border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">Player Name (Username)</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border-2 border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all font-medium"
                placeholder="e.g. hero99"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">Secret Code (Password)</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border-2 border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={login.isPending}
              className="w-full mt-4 gamified-gradient text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {login.isPending ? "Connecting..." : (
                <>Enter Game <Sparkles className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-muted-foreground font-semibold">
            New player?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

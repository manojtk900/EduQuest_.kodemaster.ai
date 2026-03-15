import { useState } from "react";
import { Link } from "wouter";
import { useSignupMutation } from "@/hooks/use-auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Rocket, Gamepad2 } from "lucide-react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const signup = useSignupMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup.mutate({ data: { username, password } }, {
      onSuccess: () => {
        window.location.href = "/";
      },
      onError: (err) => {
        toast.error(err.message || "Signup failed. Try a different username.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
          alt="Space background" 
          className="w-full h-full object-cover opacity-30 mix-blend-screen scale-x-[-1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl gamified-gradient items-center justify-center shadow-xl shadow-secondary/20 mb-6">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-black text-white mb-2">Create Character</h1>
          <p className="text-muted-foreground font-semibold">Join EduQuest and start your journey.</p>
        </div>

        <div className="glass-panel rounded-3xl p-8 shadow-2xl border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">Choose Username</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border-2 border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all font-medium"
                placeholder="hero99"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">Set Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border-2 border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={signup.isPending}
              className="w-full mt-4 bg-gradient-to-r from-secondary to-blue-600 text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-secondary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {signup.isPending ? "Creating..." : (
                <>Start Adventure <Gamepad2 className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-muted-foreground font-semibold">
            Already playing?{" "}
            <Link href="/login" className="text-secondary hover:text-secondary/80 transition-colors">
              Log in here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

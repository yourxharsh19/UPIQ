import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "../components/ui/Button";
import { Wallet } from "lucide-react";
import logo from "../assets/logo.png";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(form.email, form.password);
      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4 relative overflow-hidden">
      {/* Brand Header in Corner */}
      <div className="absolute top-8 left-8 flex items-center gap-3 animate-fade-in">
        <img src={logo} alt="UPIQ" className="w-10 h-10 rounded-xl object-cover" />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-[var(--text-main)] leading-none">UPIQ</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold">Finance, Without the Friction</span>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-premium mb-4 group hover:scale-110 transition-transform duration-500">
            <Wallet className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">Welcome Back</h1>
          <p className="text-[var(--text-muted)] mt-2">Sign in to your UPIQ account</p>
        </div>

        <div className="bg-[var(--bg-card)] p-8 rounded-3xl shadow-premium border border-[var(--border-base)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm transition-all text-[var(--text-main)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm transition-all text-[var(--text-main)]"
                required
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3.5 text-base"
            >
              Sign In
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 text-xs font-medium text-center animate-shake">
              {error}
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-[var(--text-muted)]">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-primary-600 dark:text-primary-400 font-bold hover:underline underline-offset-4"
          >
            Register now
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

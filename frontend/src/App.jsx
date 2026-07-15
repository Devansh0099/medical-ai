import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "./services/api";

const diseaseCards = [
  {
    key: "diabetes",
    title: "Diabetes",
    description: "Assess glucose and metabolic indicators",
    route: "/predict/diabetes",
    accent: "from-cyan-500 to-blue-600",
    icon: "🩸",
  },
  {
    key: "heart",
    title: "Heart",
    description: "Evaluate cardiovascular risk profile",
    route: "/predict/heart",
    accent: "from-rose-500 to-orange-500",
    icon: "❤️",
  },
  {
    key: "kidney",
    title: "Kidney",
    description: "Review kidney function and fluid markers",
    route: "/predict/kidney",
    accent: "from-emerald-500 to-green-600",
    icon: "🫁",
  },
  {
    key: "liver",
    title: "Liver",
    description: "Inspect liver health and enzyme levels",
    route: "/predict/liver",
    accent: "from-violet-500 to-fuchsia-600",
    icon: "🧠",
  },
];

const diseaseConfigs = {
  diabetes: {
    title: "Diabetes Prediction",
    subtitle: "Analyze key metabolic and lifestyle indicators",
    endpoint: "/api/predict/diabetes",
    fields: [
      { name: "pregnancies", label: "Pregnancies", type: "number", placeholder: "0", step: "1" },
      { name: "glucose", label: "Glucose", type: "number", placeholder: "95", step: "0.1" },
      { name: "bloodPressure", label: "Blood Pressure", type: "number", placeholder: "70", step: "0.1" },
      { name: "skinThickness", label: "Skin Thickness", type: "number", placeholder: "20", step: "0.1" },
      { name: "insulin", label: "Insulin", type: "number", placeholder: "79", step: "0.1" },
      { name: "bmi", label: "BMI", type: "number", placeholder: "32", step: "0.1" },
      { name: "diabetesPedigreeFunction", label: "Diabetes Pedigree", type: "number", placeholder: "0.5", step: "0.001" },
      { name: "age", label: "Age", type: "number", placeholder: "35", step: "1" },
    ],
  },
  heart: {
    title: "Heart Disease Prediction",
    subtitle: "Evaluate major cardiovascular factors",
    endpoint: "/api/predict/heart",
    fields: [
      { name: "age", label: "Age", type: "number", placeholder: "45", step: "1" },
      { name: "sex", label: "Sex", type: "number", placeholder: "1", step: "1" },
      { name: "cp", label: "Chest Pain Type", type: "number", placeholder: "2", step: "1" },
      { name: "trestbps", label: "Resting BP", type: "number", placeholder: "120", step: "1" },
      { name: "chol", label: "Cholesterol", type: "number", placeholder: "200", step: "1" },
      { name: "fbs", label: "Fasting Sugar", type: "number", placeholder: "0", step: "1" },
      { name: "restecg", label: "Resting ECG", type: "number", placeholder: "1", step: "1" },
      { name: "thalach", label: "Max Heart Rate", type: "number", placeholder: "150", step: "1" },
      { name: "exang", label: "Exercise Induced Angina", type: "number", placeholder: "0", step: "1" },
      { name: "oldpeak", label: "ST Depression", type: "number", placeholder: "1.2", step: "0.1" },
      { name: "slope", label: "Slope", type: "number", placeholder: "1", step: "1" },
      { name: "ca", label: "Major Vessels", type: "number", placeholder: "0", step: "1" },
      { name: "thal", label: "Thalassemia", type: "number", placeholder: "2", step: "1" },
    ],
  },
  kidney: {
  title: "Kidney Disease Prediction",
  subtitle: "Evaluate kidney function indicators",
  endpoint: "/api/predict/kidney",
  fields: [
    {
      name: "age",
      label: "Age",
      type: "number",
      placeholder: "45",
      step: "1",
    },
    {
      name: "bloodPressure",
      label: "Blood Pressure (mm/Hg)",
      type: "number",
      placeholder: "80",
      step: "1",
    },
    {
      name: "albumin",
      label: "Albumin in Urine",
      type: "number",
      placeholder: "1",
      step: "1",
    },
    {
      name: "bloodUrea",
      label: "Blood Urea (mg/dl)",
      type: "number",
      placeholder: "25",
      step: "0.1",
    },
    {
      name: "serumCreatinine",
      label: "Serum Creatinine (mg/dl)",
      type: "number",
      placeholder: "1.2",
      step: "0.1",
    },
    {
      name: "egfr",
      label: "eGFR",
      type: "number",
      placeholder: "90",
      step: "0.1",
    },
    {
      name: "hemoglobin",
      label: "Hemoglobin (gms)",
      type: "number",
      placeholder: "13.5",
      step: "0.1",
    },
    {
      name: "diabetes",
      label: "Diabetes (0 = No, 1 = Yes)",
      type: "number",
      placeholder: "0",
      step: "1",
    },
  ],
},
  liver: {
    title: "Liver Disease Prediction",
    subtitle: "Measure liver enzyme and biochemical markers",
    endpoint: "/api/predict/liver",
    fields: [
      { name: "age", label: "Age", type: "number", placeholder: "40", step: "1" },
      { name: "gender", label: "Gender", type: "number", placeholder: "1", step: "1" },
      { name: "totalBilirubin", label: "Total Bilirubin", type: "number", placeholder: "1.2", step: "0.1" },
      { name: "directBilirubin", label: "Direct Bilirubin", type: "number", placeholder: "0.4", step: "0.1" },
      { name: "alkalinePhosphotase", label: "Alkaline Phosphotase", type: "number", placeholder: "100", step: "1" },
      { name: "alamineAminotransferase", label: "ALT", type: "number", placeholder: "35", step: "1" },
      { name: "aspartateAminotransferase", label: "AST", type: "number", placeholder: "35", step: "1" },
      { name: "totalProteins", label: "Total Proteins", type: "number", placeholder: "7.2", step: "0.1" },
      { name: "albumin", label: "Albumin", type: "number", placeholder: "3.5", step: "0.1" },
      { name: "albuminAndGlobulinRatio", label: "A/G Ratio", type: "number", placeholder: "1.0", step: "0.1" },
    ],
  },
};

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function Navbar({ user, theme, setTheme, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl shadow-glow">
            🩺
          </div>
          <div>
            <div className="text-lg font-semibold">MedAI</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Clinical Diagnostics</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium ${isActive ? "bg-cyan-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
                Dashboard
              </NavLink>
              <NavLink to="/history" className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium ${isActive ? "bg-cyan-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
                History
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium ${isActive ? "bg-cyan-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
                Profile
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium ${isActive ? "bg-cyan-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
                Login
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium ${isActive ? "bg-cyan-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
                Signup
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {user && (
            <button
              onClick={onLogout}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function LandingPage() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-cyan-700 via-blue-700 to-indigo-800 p-8 shadow-2xl dark:border-slate-800">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-cyan-100">
              Secure AI-powered medical diagnostics
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Detect, monitor, and understand health risks faster.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-cyan-50/90">
              A modern clinical dashboard for diabetes, heart, kidney, and liver prediction with secure authentication and detailed history tracking.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02]">
                Create account
              </Link>
              <Link to="/login" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20">
                Sign in
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/20 bg-slate-950/30 p-6 backdrop-blur">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4">
                <div className="text-sm text-cyan-100">Live risk scoring</div>
                <div className="mt-2 text-3xl font-semibold text-white">4 disease models</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="text-sm text-slate-200">Authentication</div>
                  <div className="mt-2 text-xl font-semibold text-white">JWT + cookies</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="text-sm text-slate-200">History</div>
                  <div className="mt-2 text-xl font-semibold text-white">Persistent records</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ["🔐", "Protected routes", "Only authorized users can access diagnosis and history features."],
          ["📊", "Dashboard overview", "Review disease cards and quickly launch a prediction workflow."],
          ["🌙", "Dark mode", "A calm, medical-grade UI that adapts to your preference."],
        ].map(([icon, title, body]) => (
          <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="text-3xl">{icon}</div>
            <h3 className="mt-4 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

function LoginPage({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/user/signin", form);
      const userData = res.data.user || { email: form.email, name: form.email.split("@")[0] };
      setUser(userData);
      localStorage.setItem("medical-user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-cyan-600 to-blue-600 p-8 text-white shadow-2xl dark:border-slate-800">
          <div className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-100">Welcome back</div>
          <h1 className="mt-4 text-3xl font-semibold">Access your medical dashboard</h1>
          <p className="mt-4 text-cyan-50/90">
            Sign in to view predictions, review history, and manage your profile securely.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950"
                placeholder="doctor@clinic.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950"
                placeholder="••••••••"
              />
            </div>
            {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Don’t have an account? <Link to="/signup" className="font-semibold text-cyan-600">Create one</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function SignupPage({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/user/signup", {
          name: form.name,
          email: form.email,
          password: form.password,
          role: "patient"
      });
      const userData = res.data.user || { name: form.name, email: form.email };
      setUser(userData);
      localStorage.setItem("medical-user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-cyan-600 to-blue-600 p-8 text-white shadow-2xl dark:border-slate-800">
          <div className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-100">New here?</div>
          <h1 className="mt-4 text-3xl font-semibold">Start your health intelligence journey</h1>
          <p className="mt-4 text-cyan-50/90">
            Create an account to begin using AI-assisted diagnostic workflows and maintain your health history.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold">Create account</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Full name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950"
                placeholder="Dr. Maya Chen"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950"
                placeholder="doctor@clinic.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950"
                placeholder="••••••••"
              />
            </div>
            {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Already have an account? <Link to="/login" className="font-semibold text-cyan-600">Log in</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function DashboardPage({ user, history, historyLoading }) {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-cyan-600/10 px-3 py-1 text-sm font-medium text-cyan-600 dark:text-cyan-400">
              Dashboard overview
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              Welcome back, {user?.name || user?.email?.split("@")[0] || "there"}.
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Choose a disease profile to run a predictive analysis and review your previous sessions.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm dark:border-slate-700 dark:bg-slate-950">
            <div className="text-slate-500 dark:text-slate-400">Recent checks</div>
            <div className="mt-2 text-3xl font-semibold">{history?.length || 0}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-cyan-600 to-blue-600 p-8 text-white shadow-xl dark:border-slate-800">
          <div className="text-sm uppercase tracking-[0.25em] text-cyan-100">Fast start</div>
          <h3 className="mt-3 text-2xl font-semibold">Run a diagnostic from a single panel</h3>
          <p className="mt-3 text-cyan-50/90">
            Access all disease prediction forms in one place and save your outputs for future review.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">History summary</h3>
            {historyLoading ? <span className="text-sm text-slate-500">Refreshing…</span> : null}
          </div>
          <div className="mt-5 grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <div className="text-sm text-slate-500 dark:text-slate-400">Stored analyses</div>
              <div className="mt-2 text-2xl font-semibold">{history?.length || 0}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <div className="text-sm text-slate-500 dark:text-slate-400">Protected access</div>
              <div className="mt-2 text-lg font-semibold">JWT-based session</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Disease cards</h2>
          <div className="text-sm text-slate-500 dark:text-slate-400">Tap a model to begin.</div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {diseaseCards.map((card) => (
            <Link
              key={card.key}
              to={card.route}
              className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`inline-flex rounded-2xl bg-gradient-to-br ${card.accent} px-3 py-2 text-2xl`}>
                {card.icon}
              </div>
              <h3 className="mt-5 text-xl font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{card.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600">
                Open form
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function PredictionPage({ diseaseKey, refreshHistory }) {
  const config = diseaseConfigs[diseaseKey];
  const initialState = useMemo(() => Object.fromEntries((config?.fields || []).map((field) => [field.name, ""])), [config]);

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(initialState);
    setResult(null);
    setError("");
  }, [initialState]);

  if (!config) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          const field = config.fields.find((item) => item.name === key);
          return [key, field?.type === "number" ? Number(value) : value];
        })
      );
      console.log(payload);
      let requestBody = {};

switch (diseaseKey) {
  case "diabetes":
    requestBody = {
      Pregnancies: payload.pregnancies,
      Glucose: payload.glucose,
      BloodPressure: payload.bloodPressure,
      SkinThickness: payload.skinThickness,
      Insulin: payload.insulin,
      BMI: payload.bmi,
      DiabetesPedigreeFunction: payload.diabetesPedigreeFunction,
      Age: payload.age,
    };
    break;

  case "heart":
    requestBody = {
      age: payload.age,
      sex: payload.sex,
      cp: payload.cp,
      trestbps: payload.trestbps,
      chol: payload.chol,
      fbs: payload.fbs,
      restecg: payload.restecg,
      thalach: payload.thalach,
      exang: payload.exang,
      oldpeak: payload.oldpeak,
      slope: payload.slope,
      ca: payload.ca,
      thal: payload.thal,
    };
    break;

  case "kidney":
  requestBody = {
    age: payload.age,
    blood_pressure: payload.bloodPressure,
    albumin: payload.albumin,
    blood_urea: payload.bloodUrea,
    serum_creatinine: payload.serumCreatinine,
    egfr: payload.egfr,
    hemoglobin: payload.hemoglobin,
    diabetes: payload.diabetes,
  };
  break;

  case "liver":
  requestBody = {
    age: payload.age,
    total_bilirubin: payload.totalBilirubin,
    direct_bilirubin: payload.directBilirubin,
    alp: payload.alkalinePhosphotase,
    alt: payload.alamineAminotransferase,
    ast: payload.aspartateAminotransferase,
    albumin: payload.albumin,
  };
  break;
}

// const res = await api.post(config.endpoint, requestBody);
const res = await api.post(config.endpoint, requestBody);
      setResult(res.data.prediction);
      if (refreshHistory) refreshHistory();
    } catch (err) {
      setError(err?.response?.data?.message || "Prediction request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-cyan-600/10 px-3 py-1 text-sm font-medium text-cyan-600 dark:text-cyan-400">
              Predictive analysis
            </div>
            <h1 className="mt-4 text-3xl font-semibold">{config.title}</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">{config.subtitle}</p>
          </div>
          <Link to="/dashboard" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-950">
            Back to dashboard
          </Link>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Input values</h2>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            {config.fields.map((field) => (
              <div key={field.name}>
                <label className="mb-2 block text-sm font-medium">{field.label}</label>
                {field.type === "number" ? (
                  <input
                    type="number"
                    name={field.name}
                    step={field.step || "1"}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                )}
              </div>
            ))}

            {error && (
              <div className="md:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">
                {error}
              </div>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Predicting..." : "Run prediction"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Prediction output</h2>
          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
            {result ? (
  <div className="space-y-5">

    <div
      className={`rounded-2xl border p-6 shadow ${
        result.prediction === 1
          ? "border-red-500 bg-red-100 dark:bg-red-900/30"
          : "border-green-500 bg-green-100 dark:bg-green-900/30"
      }`}
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Prediction Result
      </h3>

      <p
        className={`mt-3 text-3xl font-bold ${
          result.prediction === 1
            ? "text-red-600 dark:text-red-400"
            : "text-green-600 dark:text-green-400"
        }`}
      >
        {result.prediction === 1
          ? "⚠ Disease Detected"
          : "✅ Healthy"}
      </p>
    </div>

    <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Confidence
      </h3>

      <p className="mt-2 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
        {result.confidence}%
      </p>
    </div>

    <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Explanation
      </h3>

      <p className="mt-2 text-slate-700 dark:text-slate-300">
        {result.explanation || "No explanation available."}
      </p>
    </div>

  </div>
) : (
  <div className="text-center py-10 text-slate-500 dark:text-slate-400">
    Submit the form to receive the prediction.
  </div>
)}
          </div>
        </div>
      </div>
    </main>
  );
}

function HistoryPage({ history, historyLoading }) {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-cyan-600/10 px-3 py-1 text-sm font-medium text-cyan-600 dark:text-cyan-400">
              Health history
            </div>
            <h1 className="mt-4 text-3xl font-semibold">Your prediction timeline</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Review all the predictions you’ve submitted and inspect the backend results.
            </p>
          </div>
          <Link to="/dashboard" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-950">
            Back to dashboard
          </Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {historyLoading ? (
          <div className="text-sm text-slate-500">Loading…</div>
        ) : !history || history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No prediction history available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={index} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-semibold">
                      {item.disease || item.model || item.endpoint || "Prediction"}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {item.createdAt || item.timestamp || item.date || "Recent result"}
                    </div>
                  </div>
                  <div className="rounded-full bg-cyan-600/10 px-3 py-1 text-sm font-medium text-cyan-600 dark:text-cyan-400">
                    #{index + 1}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                    {JSON.stringify(item.result || item.response || item.data || item.prediction || item, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ProfilePage({ user, theme, setTheme, onLogout }) {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-cyan-600/10 px-3 py-1 text-sm font-medium text-cyan-600 dark:text-cyan-400">
              Profile
            </div>
            <h1 className="mt-4 text-3xl font-semibold">{user?.name || "Your profile"}</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Manage your account and personalize your dashboard experience.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            Logout
          </button>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Account details</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <div className="text-sm text-slate-500 dark:text-slate-400">Name</div>
              <div className="mt-1 text-lg font-semibold">{user?.name || "N/A"}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <div className="text-sm text-slate-500 dark:text-slate-400">Email</div>
              <div className="mt-1 text-lg font-semibold">{user?.email || "N/A"}</div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Preferences</h2>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Dark mode</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Switch between themes for better comfort.</div>
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white"
              >
                {theme === "dark" ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem("medical-user") || "null");
    } catch {
      return null;
    }
  });
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("medical-theme") || "dark";
  });
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("medical-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("medical-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("medical-user");
    }
  }, [user]);

  const refreshHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const res = await api.get("/api/predict/history");
      setHistory(res.data.history || res.data.data || res.data || []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshHistory();
    } else {
      setHistory([]);
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Navbar user={user} theme={theme} setTheme={setTheme} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/signup" element={<SignupPage setUser={setUser} />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage user={user} history={history} historyLoading={historyLoading} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/predict/diabetes"
          element={
            <ProtectedRoute user={user}>
              <PredictionPage diseaseKey="diabetes" refreshHistory={refreshHistory} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/predict/heart"
          element={
            <ProtectedRoute user={user}>
              <PredictionPage diseaseKey="heart" refreshHistory={refreshHistory} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/predict/kidney"
          element={
            <ProtectedRoute user={user}>
              <PredictionPage diseaseKey="kidney" refreshHistory={refreshHistory} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/predict/liver"
          element={
            <ProtectedRoute user={user}>
              <PredictionPage diseaseKey="liver" refreshHistory={refreshHistory} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute user={user}>
              <HistoryPage history={history} historyLoading={historyLoading} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage user={user} theme={theme} setTheme={setTheme} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </div>
  );
}
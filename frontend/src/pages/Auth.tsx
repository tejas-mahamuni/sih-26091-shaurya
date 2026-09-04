import { useEffect, useState } from "react";
import { RiGithubFill, RiGoogleFill } from "@remixicon/react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import type { User } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db, githubProvider, googleProvider } from "../firebase.config";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPasswordChecks = (password: string) => ({
  minLength: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
});

const getFirebaseMessage = (error: any) => {
  switch (error?.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    case "auth/popup-closed-by-user":
      return "The popup was closed before sign in completed.";
    case "auth/account-exists-with-different-credential":
      return "This email is already linked with another sign-in method.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return error?.message || "Something went wrong. Please try again.";
  }
};

export function Auth() {
  const [activeTab, setActiveTab] = useState<"create" | "login">("create");
  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [authUser, setAuthUser] = useState<User | null>(null);

  const isSignUp = activeTab === "create";
  const passwordChecks = getPasswordChecks(formData.password);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });

    return unsubscribe;
  }, []);

  const clearFeedback = () => {
    setMessage("");
    setError("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    clearFeedback();
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateForm = () => {
    if (isSignUp && formData.name.trim().length < 3) {
      return "Full name should be at least 3 characters.";
    }

    if (!emailPattern.test(formData.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!passwordChecks.minLength) {
      return "Password should be at least 8 characters.";
    }

    if (isSignUp && !passwordChecks.uppercase) {
      return "Password must contain at least one uppercase letter.";
    }

    if (isSignUp && !passwordChecks.lowercase) {
      return "Password must contain at least one lowercase letter.";
    }

    if (isSignUp && !passwordChecks.number) {
      return "Password must contain at least one number.";
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      return "Password and confirm password must match.";
    }

    return "";
  };

  const applyPersistence = async () => {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearFeedback();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await applyPersistence();

      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );

        await updateProfile(result.user, {
          displayName: formData.name.trim(),
        });
        await sendEmailVerification(result.user);

        setMessage("Account created successfully. Verification email sent.");
        resetForm();
        setActiveTab("login");
      } else {
        await signInWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );

        setMessage("Login successful.");
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      }
    } catch (firebaseError: any) {
      setError(getFirebaseMessage(firebaseError));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: any) => {
    clearFeedback();
    setLoading(true);

    try {
      await applyPersistence();
      await signInWithPopup(auth, provider);
      setMessage("Login successful.");
    } catch (firebaseError: any) {
      setError(getFirebaseMessage(firebaseError));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    clearFeedback();

    if (!emailPattern.test(formData.email.trim())) {
      setError("Enter your email first to reset the password.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, formData.email.trim());
      setMessage("Password reset email sent.");
    } catch (firebaseError: any) {
      setError(getFirebaseMessage(firebaseError));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    clearFeedback();
    setLoading(true);

    try {
      await signOut(auth);
      setMessage("Logged out successfully.");
    } catch (firebaseError: any) {
      setError(getFirebaseMessage(firebaseError));
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab: "create" | "login") => {
    setActiveTab(tab);
    clearFeedback();
    resetForm();
  };

  // ── History State ──
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchHistory = async (uid: string) => {
    setHistoryLoading(true);
    try {
      const q = query(
        collection(db, `users/${uid}/calculations`),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      setHistory(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    } catch {
      // Firestore fetch is best-effort
    } finally {
      setHistoryLoading(false);
    }
  };

  const deleteCalc = async (calcId: string) => {
    if (!authUser) return;
    try {
      await deleteDoc(doc(db, `users/${authUser.uid}/calculations`, calcId));
      setHistory((prev) => prev.filter((h) => h.id !== calcId));
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (authUser) fetchHistory(authUser.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  const fmt = (n: number) =>
    `₹${n?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  const fmtDec = (n: number) =>
    `₹${n?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (authUser) {
    return (
      <div className="pt-24 min-h-screen px-4 relative z-20 max-w-3xl mx-auto pb-16 space-y-6">

        {/* ── Profile Card ── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-gray-900">
              {authUser.displayName || "Welcome"}
            </h1>
            <p className="text-sm text-gray-500">{authUser.email}</p>
            <p className="text-xs text-gray-400">
              {authUser.emailVerified
                ? "✓ Email verified"
                : "⚠ Email not verified yet"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-70"
          >
            {loading ? "..." : "Logout"}
          </button>
        </div>

        {message ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {message}
          </div>
        ) : null}

        {/* ── Calculation History ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Your Calculations
            </h2>
            <span className="text-xs text-gray-400 font-mono">
              {history.length} saved
            </span>
          </div>

          {historyLoading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center space-y-2">
              <p className="text-sm text-gray-500">No calculations yet.</p>
              <p className="text-xs text-gray-400">
                Go to{" "}
                <a href="/finance" className="text-[#C9793A] underline">
                  Financial Plan
                </a>{" "}
                to run your first calculation.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((calc) => {
                const isExpanded = expandedId === calc.id;
                const ts = calc.timestamp?.toDate?.()
                  ? calc.timestamp.toDate().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—";

                return (
                  <div
                    key={calc.id}
                    className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs"
                  >
                    {/* Summary row */}
                    <div
                      className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : calc.id)
                      }
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {calc.scheme?.name || "Calculation"}
                        </p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {calc.scheme?.category || ""} •{" "}
                          {calc.scheme?.interest_rate}% •{" "}
                          {calc.scheme?.tenure_months} months
                        </p>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <p className="text-sm font-bold text-[#C9793A] font-mono">
                          EMI {calc.repayment?.monthly_emi ? fmtDec(calc.repayment.monthly_emi) : "—"}
                        </p>
                        <p className="text-[10px] text-gray-400">{ts}</p>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50 space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-gray-400 block">
                              Project Cost
                            </span>
                            <span className="font-mono font-semibold text-gray-900">
                              {calc.project_cost ? fmt(calc.project_cost) : "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">
                              Eligible Loan
                            </span>
                            <span className="font-mono font-semibold text-[#C9793A]">
                              {calc.loan?.eligible_amount
                                ? fmt(calc.loan.eligible_amount)
                                : "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">
                              Total Interest
                            </span>
                            <span className="font-mono font-semibold text-gray-900">
                              {calc.repayment?.total_interest
                                ? fmt(calc.repayment.total_interest)
                                : "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">
                              Your Margin
                            </span>
                            <span className="font-mono font-semibold text-gray-900">
                              {calc.available_margin
                                ? fmt(calc.available_margin)
                                : "—"}
                            </span>
                          </div>
                        </div>

                        {calc.warnings && calc.warnings.length > 0 && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                            {calc.warnings.map((w: string, i: number) => (
                              <p key={i}>{w}</p>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCalc(calc.id);
                            }}
                            className="text-xs text-red-500 hover:text-red-700 transition font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4 relative z-20">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50">
        <div className="mb-6 flex w-fit mx-auto rounded-full border border-gray-200/60 bg-gray-100 p-1 select-none">
          <button
            type="button"
            onClick={() => switchTab("create")}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all ${
              isSignUp
                ? "bg-purple-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all ${
              !isSignUp
                ? "bg-purple-500 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Login
          </button>
        </div>

        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isSignUp
              ? "Sign up with email, Google, or GitHub."
              : "Login with email, Google, or GitHub."}
          </p>
        </div>

        <div className="mb-4 flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => handleSocialLogin(googleProvider)}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RiGoogleFill size={20} className="text-purple-600" />
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin(githubProvider)}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RiGithubFill size={20} />
            <span>GitHub</span>
          </button>
        </div>

        <div className="mb-4 flex items-center">
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-3 text-xs font-medium uppercase text-gray-400">Or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-600 focus:bg-white"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-600 focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Password</label>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 focus-within:border-purple-600 focus-within:bg-white">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-l-lg bg-transparent px-3.5 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="px-3 text-sm font-medium text-purple-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Confirm Password</label>
              <div className="flex rounded-lg border border-gray-200 bg-gray-50 focus-within:border-purple-600 focus-within:bg-white">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-l-lg bg-transparent px-3.5 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="px-3 text-sm font-medium text-purple-600"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                className="accent-purple-600"
              />
              Remember me
            </label>

            {!isSignUp && (
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-sm font-medium text-purple-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Forgot password?
              </button>
            )}
          </div>

          {(error || message) && (
            <div
              className={`rounded-lg px-3.5 py-2 text-sm ${
                error
                  ? "border border-red-200 bg-red-50 text-red-600"
                  : "border border-green-200 bg-green-50 text-green-600"
              }`}
            >
              {error || message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white shadow-md shadow-purple-600/20 transition hover:bg-purple-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

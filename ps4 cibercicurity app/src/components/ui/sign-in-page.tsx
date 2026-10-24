import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [notice, setNotice] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const enterDemo = () => {
    // This prototype has no account backend. Accept the form as demo access
    // and take the user into the main app without storing or transmitting it.
    navigate("/app", { replace: true });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    enterDemo();
  };

  return (
    <main className="signin-page">
      <section className="signin-visual" aria-label="CyberShield protection">
        <button
          className="signin-back"
          onClick={() => navigate("/")}
          aria-label="Back to CyberShield"
        >
          <ArrowLeft size={19} />
        </button>
        <div className="signin-art-grid" aria-hidden="true" />
        <div className="signin-brand-mark">
          <ShieldCheck size={38} />
        </div>
        <div className="signin-visual-copy">
          <span>CYBERSHIELD AI</span>
          <h2>Stay one step ahead of online scams.</h2>
          <p>
            Understand suspicious messages before you respond, click, or share.
          </p>
        </div>
        <div className="signin-orbit orbit-one" aria-hidden="true" />
        <div className="signin-orbit orbit-two" aria-hidden="true" />
      </section>

      <section className="signin-form-panel">
        <div className="signin-form-wrap">
          <div className="signin-heading">
            <span className="signin-mobile-mark">
              <ShieldCheck size={21} /> CyberShield AI
            </span>
            <h1>Welcome Back</h1>
            <p>
              Don&apos;t have an account?{" "}
              <button
                className="signin-link"
                type="button"
                onClick={() =>
                  setNotice("Account creation is not enabled in this demo.")
                }
              >
                Sign up
              </button>
            </p>
            <div className="signin-demo-hint">
              Demo only: the fields are optional. Click the button below to open
              the app; nothing is saved or sent.
            </div>
          </div>
          <form onSubmit={handleSubmit} className="signin-form">
            <label>
              Email Address
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>
            <label>
              Password
              <span className="signin-password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <div className="signin-options">
              <label className="signin-remember">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="signin-link"
                onClick={() =>
                  setNotice("Password recovery is not configured in this demo.")
                }
              >
                Forgot password?
              </button>
            </div>
            <button className="signin-submit" type="button" onClick={enterDemo}>
              Open CyberShield Demo
            </button>
            {notice && (
              <p className="signin-notice" role="status">
                {notice}
              </p>
            )}
            <div className="signin-divider">
              <span>or</span>
            </div>
            <div className="signin-social">
              <button
                type="button"
                onClick={() =>
                  setNotice("Google sign-in is not configured in this demo.")
                }
              >
                <b className="google-mark">G</b>Continue with Google
              </button>
              <button
                type="button"
                onClick={() =>
                  setNotice("GitHub sign-in is not configured in this demo.")
                }
              >
                <b className="github-mark">●</b>Continue with GitHub
              </button>
            </div>
          </form>
          <p className="signin-local-note">
            <ShieldCheck size={14} /> Demo only · No account system is
            connected.
          </p>
        </div>
      </section>
    </main>
  );
}

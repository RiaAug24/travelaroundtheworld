import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  // Login form state
  const [password, setPassword] = useState<string>();

  // Registration form state
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUserName] = useState("");

  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Clear previous error
    if (username && password) {
      console.log(password)
      try {
        await login(username, password);
      } catch (error) {
        setErrorMsg(error.message); // Show error from AuthContext
      }
    }
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!regEmail || !regPassword || !username) {
      alert("Please fill in all required fields");
      return;
    }

    if (regPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (regPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      await register(username, regEmail, regPassword);
    } catch (error) {
      console.log(error);
    }
  };

  const switchToLogin = () => {
    setIsLogin(true);
    // Clear registration form
    setRegEmail("");
    setRegPassword("");
    setConfirmPassword("");
    setUserName("");
  };

  const switchToRegister = () => {
    setIsLogin(false);
    // Clear login form (except dev pre-fill)
  };

  return (
    <>
      <main className={styles.login}>
        <PageNav />

        <div className={styles.authContainer}>
          {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
          {/* Tab Headers */}
          <div className={styles.tabHeaders}>
            <button
              className={`${styles.tabButton} ${isLogin ? styles.active : ""}`}
              onClick={switchToLogin}
            >
              Login
            </button>
            <button
              className={`${styles.tabButton} ${!isLogin ? styles.active : ""}`}
              onClick={switchToRegister}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {isLogin && (
            <form className={styles.form} onSubmit={handleLoginSubmit}>
              <div className={styles.row}>
                <label htmlFor="email">Enter your username</label>
                <input
                  type="text"
                  id="username"
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.row}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <button type="submit" className={styles.loginBtn}>
                  Login
                </button>
              </div>
            </form>
          )}

          {/* Registration Form */}
          {!isLogin && (
            <form className={styles.form} onSubmit={handleRegisterSubmit}>
              <div className={styles.row}>
                <label htmlFor="username">Enter your username</label>
                <input
                  type="text"
                  id="username"
                  onChange={(e) => setUserName(e.target.value.trim())}
                  value={username}
                  required
                />
              </div>

              <div className={styles.row}>
                <label htmlFor="regEmail">Email address</label>
                <input
                  type="email"
                  id="regEmail"
                  onChange={(e) => setRegEmail(e.target.value)}
                  value={regEmail}
                  required
                />
              </div>

              <div className={styles.row}>
                <label htmlFor="regPassword">Password</label>
                <input
                  type="password"
                  id="regPassword"
                  onChange={(e) => setRegPassword(e.target.value)}
                  value={regPassword}
                  required
                  minLength={6}
                />
              </div>

              <div className={styles.row}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                />
              </div>

              <div>
                <button type="submit" className={styles.loginBtn}>
                  Register
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

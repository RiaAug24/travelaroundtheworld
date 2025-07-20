import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login form state
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  
  // Registration form state
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUserName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setAvatar(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!regEmail || !regPassword || ! username) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (regPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (regPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      // Convert avatar to base64 or handle file upload
      let avatarData = null;
      if (avatar) {
        const reader = new FileReader();
        avatarData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(avatar);
        });
      }

    
      register(regEmail, regPassword, username, avatarData as string);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const switchToLogin = () => {
    setIsLogin(true);
    // Clear registration form
    setRegEmail("");
    setRegPassword("");
    setConfirmPassword("");
    setUserName("");
    setAvatar(null);
    setAvatarPreview(null);
  };

  const switchToRegister = () => {
    setIsLogin(false);
    // Clear login form (except dev pre-fill)
    if (email === "jack@example.com") {
      setEmail("");
    }
    if (password === "qwerty") {
      setPassword("");
    }
  };

  return (
    <>
      <main className={styles.login}>
        <PageNav />
        
        <div className={styles.authContainer}>
          {/* Tab Headers */}
          <div className={styles.tabHeaders}>
            <button 
              className={`${styles.tabButton} ${isLogin ? styles.active : ''}`}
              onClick={switchToLogin}
            >
              Login
            </button>
            <button 
              className={`${styles.tabButton} ${!isLogin ? styles.active : ''}`}
              onClick={switchToRegister}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {isLogin && (
            <form className={styles.form} onSubmit={handleLoginSubmit}>
              <div className={styles.row}>
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>

              <div className={styles.row}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
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
                <label htmlFor="username">Full Name</label>
                <input
                  type="text"
                  id="username"
                  onChange={(e) => setUserName(e.target.value)}
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

              <div className={styles.row}>
                <label htmlFor="avatar">Profile Picture (optional)</label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className={styles.fileInput}
                />
                {avatarPreview && (
                  <div className={styles.avatarPreview}>
                    <img 
                      src={avatarPreview} 
                      alt="Profile preview" 
                      className={styles.previewImage}
                    />
                  </div>
                )}
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
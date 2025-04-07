import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function LoginRegister() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Loading...");

    try {
      if (isRegistering) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        setMessage("✅ Registered! Please verify your email before logging in.");
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        if (userCred.user.emailVerified) {
          setMessage("✅ Login successful. Redirecting...");
          navigate("/dashboard");
        } else {
          setMessage("⚠️ Please verify your email before continuing.");
        }
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f4f4f4",
      fontFamily: "Arial, sans-serif"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <h2 style={{ textAlign: "center" }}>{isRegistering ? "Register" : "Login"}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc" }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc" }}
          required
        />

        <button
          type="submit"
          style={{ background: "#1976D2", color: "#fff", padding: "0.75rem", border: "none", borderRadius: "6px" }}
        >
          {isRegistering ? "Create Account" : "Login"}
        </button>

        <p style={{ fontSize: "0.9rem", textAlign: "center", color: "#555" }}>{message}</p>

        <p
          onClick={() => setIsRegistering(!isRegistering)}
          style={{
            textAlign: "center",
            marginTop: "1rem",
            fontSize: "0.9rem",
            cursor: "pointer",
            color: "#1976D2"
          }}
        >
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </p>
      </form>
    </div>
  );
}

export default LoginRegister;

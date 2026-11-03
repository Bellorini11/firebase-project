import React from "react";
import { auth } from "./init";
import "./App.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function App() {
  const [user, setUserLogHandler] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [mode, setMode] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  function resetForm() {
    setMode(null);
    setEmail("");
    setPassword("");
    setError("");
  }

  function openMode(nextMode) {
    resetForm();
    setMode(nextMode);
  }

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLogHandler(user || {});
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const action =
      mode === "register"
        ? createUserWithEmailAndPassword
        : signInWithEmailAndPassword;
    const delay = new Promise((resolve) => setTimeout(resolve, 2000));
    Promise.all([
      action(auth, email, password).then(
        (r) => r,
        (err) => err,
      ),
      delay,
    ])
      .then(([result]) => {
        if (result instanceof Error || result?.code) {
          setError(result.message);
          return;
        }
        setUserLogHandler(result.user);
        resetForm();
      })
      .finally(() => setSubmitting(false));
  }

  function logout() {
    signOut(auth)
      .then(() => {
        setUserLogHandler({});
        resetForm();
      })
      .catch((err) => setError(err.message));
  }

  return (
    <div className="App">
      <button onClick={() => openMode("register")}>Register</button>
      <button onClick={() => openMode("login")}>Login</button>
      <button onClick={logout}>Logout</button>
      {mode && submitting && (
        <div aria-busy="true" aria-label="Submitting">
          <div className="spinner" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-input" />
          <div className="skeleton skeleton-input" />
          <div className="skeleton skeleton-button" />
        </div>
      )}
      {mode && !submitting && (
        <form onSubmit={handleSubmit}>
          <h3>
            {mode === "register"
              ? "Create your email and password"
              : "Sign in with your email and password"}
          </h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {mode === "register" ? "Create account" : "Sign in"}
          </button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      {loading ? (
        <div aria-busy="true" aria-label="Loading user">
          <div className="spinner" />
          <div className="skeleton skeleton-text" />
        </div>
      ) : (
        user.email
      )}
    </div>
  );
}

export default App;

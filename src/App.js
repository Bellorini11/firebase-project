import React from "react";
import { auth, db } from "./init";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc, 
} from "firebase/firestore";
import "./App.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

async function updatePost(id, data) {
  const docRef = doc(db, "posts", id);
  await updateDoc(docRef, data);
}
 function deletePost(id) {
  const docRef = doc(db, "posts", id);
  deleteDoc(docRef);
   
}

function createPost() {
  const post = {
    title: "My Post",
    content: "This is the content of my post.",
    ...(auth.currentUser && { uid: auth.currentUser.uid }),
  };
  addDoc(collection(db, "posts"), post)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
async function getALLPosts() {
  const data = await getDocs(collection(db, "posts"));
  const posts = data.docs.map((elem) => ({ ...elem.data(), id: elem.id }));
  console.log(posts);
}

async function getPostById(id) {
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const post = { ...docSnap.data(), id: docSnap.id };
    console.log(post);
    return post;
  }
  return null;
}

async function getPostsByUid() {
const postCollectionRef = await query(
  collection(db, "posts"),
  where("uid", "==", auth.currentUser.uid)
);
const data = await getDocs(postCollectionRef);
const posts = data.docs.map((elem) => ({ ...elem.data(), id: elem.id }));
console.log(posts);
return posts;
}

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
    const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLogHandler(user || {});
      minDelay.then(() => setLoading(false));
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
      <button onClick={createPost}>Create Post</button>
      <button onClick={getALLPosts}>Get All Posts</button>
      <button onClick={getPostsByUid}>Get Posts By UID</button>
      <button onClick={updatePost}>Update Post</button>
      <button
        onClick={deletePost}>Delete Post</button>
      <button
        onClick={getPostById}>
        Get Post By ID
      </button>
      {submitting && (
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

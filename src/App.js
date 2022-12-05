import "./App.css";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Avatar, Button, Stack } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const App = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [user, setUser] = React.useState({});
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        setUser(user);
        console.log(user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  // Sign Out
  const handleSignOut = () => {
    auth.signOut().then(() => {
      setUser({});
    });
  };

  // Handle input field empty
  const handleInputEmpty = () => {
    if (email === "" || password === "" || displayName === "") {
      alert("Please fill up all the fields");
    }
  };
  // Sign in with email and password
  const signInWithEmail = () => {
    handleInputEmpty();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        user.displayName = displayName;
        setUser(user);
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const userInfo = (
    <Stack spacing={2} direction="row" justifyContent="center">
      <Avatar
        alt={user.displayName}
        src={user.photoURL}
        sx={{ width: 24, height: 24 }}
      />
      <p>{user.displayName}</p>
      <Button variant="contained" onClick={() => handleSignOut()}>
        Sign Out
      </Button>
    </Stack>
  );
  return (
    <div className="App">
      {user.displayName && userInfo}
      <Box
      justifyContent="center"
        id="form"
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <TextField
          required
          type="email"
          label="Email"
          placeholder="yourname@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          type="password"
          label="Password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={signInWithEmail}>
          Sign Up
        </Button>
      </Box>
      <Button
        style={{ margin: "20px 0" }}
        onClick={signInWithGoogle}
        variant="contained"
        color="secondary"
      >
        Login with Google
      </Button>
    </div>
  );
};

export default App;

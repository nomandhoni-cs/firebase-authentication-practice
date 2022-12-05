import "./App.css";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Avatar, Button, Stack } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "./firebaseConfig";

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
  // Sign in with email and password
  const signInWithEmail = () => {
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
    </Stack>
  );
  return (
    <div className="App">
      {user.displayName && userInfo}
      <Box
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

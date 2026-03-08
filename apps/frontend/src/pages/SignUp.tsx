import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function Signup() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");

const handleSignup = async () => {
try {
const userCredential = await createUserWithEmailAndPassword(
auth,
email,
password
);

const user = userCredential.user;

await setDoc(doc(db, "users", user.uid), {
uid: user.uid,
name: name,
email: email,
role: "user",
createdAt: new Date()
});

alert("User created successfully!");
} catch (error: unknown) {
if (error instanceof Error) {
alert(error.message);
} else {
alert("Something went wrong");
}
}
};

return (
<div style={{ padding: "20px" }}>
<h2>Signup</h2>

<input
type="text"
placeholder="Name"
onChange={(e) => setName(e.target.value)}
/>
<br /><br />

<input
type="email"
placeholder="Email"
onChange={(e) => setEmail(e.target.value)}
/>
<br /><br />

<input
type="password"
placeholder="Password"
onChange={(e) => setPassword(e.target.value)}
/>
<br /><br />

<button onClick={handleSignup}>Signup</button>
</div>
);
}

export default Signu
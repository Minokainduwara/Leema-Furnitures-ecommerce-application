async function run() {
  try {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "admin@leema.com", password: "password" })
    });
    const auth = await res.json();
    console.log("Auth Response:", auth);
  } catch (e) {
    console.error(e);
  }
}
run();

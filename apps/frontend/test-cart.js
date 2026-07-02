const email = "user@leema.com"; // we need a valid user
// Let's just hit the endpoint without a token first to see if it responds 403 JSON or something else.
fetch('http://localhost:8080/api/cart')
  .then(res => {
     console.log("Status:", res.status);
     return res.text();
  })
  .then(text => console.log("Body:", text))
  .catch(console.error);

import ky from 'ky';
ky.create({
  hooks: {
    beforeRequest: [
      (arg1, arg2) => {
        console.log("arg1 keys:", Object.keys(arg1));
        console.log("arg1.request is Request?", arg1.request instanceof Request);
        console.log("arg1.request.headers:", arg1.request?.headers);
      }
    ]
  }
}).get('https://example.com');

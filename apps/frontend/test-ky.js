import ky from 'ky';
ky.create({
  hooks: {
    beforeRequest: [
      (request, options) => {
        console.log("type of request:", typeof request, request.constructor.name);
        console.log("request.headers:", request.headers);
      }
    ]
  }
}).get('https://example.com');

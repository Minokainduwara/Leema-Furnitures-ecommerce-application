import ky from 'ky';
ky.create({
  hooks: {
    beforeRequest: [
      (request, options) => {
        console.log("request keys:", Object.keys(request));
        console.log("options keys:", Object.keys(options || {}));
      }
    ]
  }
}).get('https://example.com');

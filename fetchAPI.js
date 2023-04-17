const https = require('https');

https.get('https://coderbyte.com/api/challenges/json/age-counting', (resp) => {

  let data = '';

  // parse json data here...
  resp.on("data", function (chunk) {
    data += chunk;
  });
  resp.on("end", () => {
    const [k, value] = data.split(":");
    const jsonData = JSON.parse(data);
    data = jsonData.data.split(', key').join('; key')
      .split(";")
      .map(
        each => {
          const [key, age] = each.split(',');
          return ({ key: key.split("=")[1], age: age.split("=")[1] })
        }
      )
    console.log(data.filter(e => e.age >= 50).length);
  })

});

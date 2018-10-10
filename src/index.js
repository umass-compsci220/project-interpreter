const P = require('parsimmon');

const numberParser =
  P.regexp(/[0–9]+/)
     .map(s => Number(s));
console.log("Hello World");


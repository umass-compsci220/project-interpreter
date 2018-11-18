let util = require("util");
let P = require("parsimmon");

function token(name_tok){
    return P.seq(P.string(name_tok),P.whitespace.or(P.eof)); 
}
//fix variable so that space can follow-complete but ask arjun about "" 
//multiple statements to work 
//work on the evaluator - evaluator parses variables 
//sequence of lets, change the parser so that it returns an array -- returns multiple lets 
//variable addition occurs at the the same level as numbers 

function operator(name_op){
    return P.seq(P.string(name_op),P.optWhitespace.or(P.eof)); 
}

function numer(name){
    return P.seq(name,P.optWhitespace.or(P.eof)).map(function(array){
        return array[0]; 
    });
}
//add number 
function parse(str) {

  let num = P.regexp(/[0-9]+/)
    .map(function(str) { return { type: "number", value: Number(str) }; });
    
  let name = P.regexp(/[A-Za-z]+/)
   .map(function(str) { return { type: "variable", value: str}; });
  
  let stmt = token("let").chain(function(_){
      return numer(name).chain(function(x){
          return operator("=").chain(function(_){
              return add.chain(function(named_exp){
                  return operator(";").chain(function(_){
                      return P.succeed({ name: 'Variable', named: x, body: named_exp })
                  })
              })
          })
      })
  })
  let atom = numer(num).or(numer(name).or(operator("(").chain(function(lhs){
        return add 
       .skip(operator(")"))
    })));
  
  let mul = atom.chain(function (lhs) {
    return operator('*').chain(function (_) {
      return mul.chain(function(rhs) {
        return P.succeed({ type: 'Multiply', left: lhs, right: rhs });
      });
    }).or(operator("/").chain(function(_){
        return add.chain(function(rhs) {
        return P.succeed({ type: 'Divide', left: lhs, right: rhs });
         });
  }))
    .or(P.succeed(lhs)) ;
  });
  // 1. let add =  ... same as above, but uses mul instead of num
  // 2. let atom = num.or( "(" add ")")
  //Psuedocode: Identify "(" and ")" , parse expression between parentheses

   let add = mul.chain(function (lhs) {
    return operator('+').chain(function (_) {
      return add.chain(function(rhs) {
        return P.succeed({ type: 'Add', left: lhs, right: rhs });
      });
    }).or(operator("-").chain(function(_){
        return add.chain(function(rhs) {
        return P.succeed({ type: 'Subtract', left: lhs, right: rhs });
         });
    }))
    .or(P.succeed(lhs)) ;
  });  
  
  //Do division at the same level as multiplication - complete
    //Object.values
   return stmt.or(add).tryParse(str); 
   //.many apply the parser multiple times 
}
// add variables 
//stmt::= add or let x = add;add 
////////////////////////////////////////////end parsimmon math.js/////////////////////////

var calculate = function (node) {
    if (node.type === "number"){
    return node.value;
    }
    else if (node.type === "Add") {
        if (node.left){
          let sol = calculate(node.left) + calculate(node.right);
          return sol;
        }
    }
    else if (node.type === "Multiply") {
        if (node.left){
            let sol = calculate(node.left) * calculate(node.right);
            return sol;
        }
    }
    else if (node.type === "Divide") {
        if (node.left){
            let sol = calculate(node.left) / calculate(node.right);
            return sol;
        }
    }
    else if (node.type === "Subtract") {
        return  calculate(node.left) - calculate(node.right);
        
    }else if (node.name === "Variable"){
        (node.named.value) = node.body.value;
        return(node.named.value);
        //evaluate the variable to a value 
        
    }
    else {
      throw 'Unknown type';
    }
};

const example1 = {
  type: "Add",
  left: { type: "number", value: 20 },
  right: { type: "number", value: 40 }
};

const example2 = {
  type: "Subtract",
  left: { type: "number", value: 20 },
  right: { type: "number", value: 40 }
};

//console.log(calculate(example2));
//console.log(calculate(parse("let x= 123123;")));
//console.log(parse("123123*232*2*4"));
//console.log(parse("123+323+2+4"));
//console.log(parse("123/3"));
//console.log(parse("123-3"));
console.log((parse("let b = 123;")));
console.log((parse("b+b")));
module.exports = parse

//build a dictionary maping x.

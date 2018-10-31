let util = require("util");
let P = require("parsimmon");
const parse = require('./index');


/*
function token(name_tok){
    return P.seq(P.string(name_tok),P.whitespace.or(P.eof)); 
}

function operator(name_op){
    return P.seq(P.string(name_op),P.optWhitespace.or(P.eof)); 
}

function parse(str) {

  let num = P.regexp(/[0-9]+/)
    .map(function(str) { return { type: "number", value: Number(str) }; });
    
  let name = P.regexp(/[A-Za-z]+/)
   .map(function(str) { return { type: "variable", value: str }; });
   
  let stmt = token("let").chain(function(_){
      return name.chain(function(x){
          return operator ("=").chain(function(_){
              return add.chain(function(named_exp){
                  return operator(";").chain(function(_){
                      return P.succeed({ name: 'Variable', named: x, body: named_exp })
                  })
              })
          })
      }) //name named and body 
  })
  let atom = num.or(operator("(").chain(function(lhs){
        return add 
       .skip(operator(")"))
    }));
  
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
 
   return stmt.or(add).tryParse(str); 
   //stmt.oradd tryParse(str) 
   
}
*/

test('Multiply Parses', () =>{
    let eq = "123123*232*2*4"; 
    let sol = { type: 'Multiply',
        left: { type: 'number', value: 123123 },
        right: { type: 'Multiply',
            left: { type: 'number', value: 232 },
            right: { type: 'Multiply', 
                left: { type: 'number', value: 2 },
                right: { type: 'number', value: 4 } } } }
    expect(parse(eq)).toEqual(sol);
}); 

test('Addition Parses', () =>{
    let eq = "123123+232+2+4"; 
    let sol = { type: 'Add',
        left: { type: 'number', value: 123123 },
        right: { type: 'Add',
            left: { type: 'number', value: 232 },
            right: { type: 'Add', 
                left: { type: 'number', value: 2 },
                right: { type: 'number', value: 4 } } } }
    expect(parse(eq)).toEqual(sol);
}); 

test('Subtraction Parses', () =>{
    let eq = "123123-232-2-4"; 
    let sol = { type: 'Subtract',
        left: { type: 'number', value: 123123 },
        right: { type: 'Subtract',
            left: { type: 'number', value: 232 },
            right: { type: 'Subtract', 
                left: { type: 'number', value: 2 },
                right: { type: 'number', value: 4 } } } }
    expect(parse(eq)).toEqual(sol);
}); 

test('Division Parses', () =>{
    let eq = "123123/232/2/4"; 
    let sol = { type: 'Divide',
        left: { type: 'number', value: 123123 },
        right: { type: 'Divide',
            left: { type: 'number', value: 232 },
            right: { type: 'Divide', 
                left: { type: 'number', value: 2 },
                right: { type: 'number', value: 4 } } } }
    expect(parse(eq)).toEqual(sol);
}); 

test('Variables Parses', () =>{
    let eq = "let x=123123;"; 
    let sol = {name:'Variable',
        named:{type:'variable', value: 'x'},
        body:{ type:'number', value: 123123}}
    expect(parse(eq)).toEqual(sol);
}); 

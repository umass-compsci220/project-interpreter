import * as P from 'parsimmon';
import { Expr, Stmt } from './ast';
import * as a from './ast';
import { Result, ok, error, unreachable } from './result';
import * as result from './result';

let ws = P.optWhitespace;

function token(name_tok: string): P.Parser<string> {
    return P.string(name_tok).skip(ws);
}

// NOTE(arjun): token and operator as identical ... mistake?
function operator(name_op: string): P.Parser<string> {
    return P.string(name_op).skip(ws);
}

let num: P.Parser<Expr> = P.regexp(/[0-9]+/).skip(ws)
    .map(str => a.number(Number(str)));

let name: P.Parser<string> = P.regexp(/[A-Za-z]+/).skip(ws);

let bool: P.Parser<Expr> =
    P.string('true').map(_ => true).or(P.string('false').map(_ => false))
    .skip(ws).map(b => a.bool(b));

let atom: P.Parser<Expr> =
    name.map(str => a.variable(str))
    .or(num)
    .or(bool)
    .or(P.lazy(() => expr.wrap(operator('('), operator(')'))));

let mul: P.Parser<Expr> = P.lazy(() =>
    atom.chain(lhs =>
        operator('*').then(mul.map(rhs => a.operator('*', lhs, rhs)))
        .or(operator('/').then(mul.map(rhs => a.operator('/', lhs, rhs))))
        .or(P.succeed(lhs))));

let add: P.Parser<Expr> = P.lazy(() =>
    mul.chain(lhs =>
        operator('+').then(add.map(rhs => a.operator('+', lhs, rhs)))
        .or(operator('-').then(add.map(rhs => a.operator('-', lhs, rhs))))
        .or(P.succeed(lhs))));

let expr = add;

let stmt: P.Parser<Stmt> = P.lazy(() =>
    token('let')
    .then(name.skip(operator('='))
    .chain(name =>
        expr.skip(operator(';'))
        .map(expression => a.let_(name, expression))))
    .or(token('if')
        .then(expr.wrap(operator('('), operator(')')))
        .chain(test =>
            block.skip(token('else'))
            .chain(truePart =>
                block
                .map(falsePart => a.if_(test, truePart, falsePart)))))
    .or(token('while')
        .then(expr.wrap(operator('('), operator(')')))
        .chain(test =>
            block
            .map(body => a.while_(test, body))))
    .or(token('print')
        .then(expr.wrap(operator('('), operator(')')))
        .skip(operator(';'))
        .map(expression => ({ kind: 'print' as 'print', expression })))
    .or(name.skip(operator('='))
        .chain(name =>
            expr.skip(operator(';'))
            .map(expression => a.assignment(name, expression)))));

let block: P.Parser<Stmt[]> = P.lazy(() =>
    stmt.many().wrap(operator('{'), operator('}')));

export function parse(input: string): Result<Stmt[]> {
    let result = stmt.many().skip(P.eof).parse(input);
    if (result.status) {
        return ok(result.value);
    }
    else {
        return error(result.expected.map(m => `Parse error. Expected ${m}`)
            .join('\n'));
    }
}

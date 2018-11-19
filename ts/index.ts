import { Stmt } from './ast';
import * as parse from './parse';
import * as tc from './tc';
import { Result } from './result';

// For a typed client. In practice, students will write an untyped evaluator.
export * from './ast';

export function parseAndTypecheck(input: string): Result<Stmt[]> {
    return parse.parse(input)
        .then(stmts => tc.tc(stmts).map(_ => stmts));
}
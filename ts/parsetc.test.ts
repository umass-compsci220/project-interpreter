import { parseAndTypecheck } from './index';
import * as a from './ast';

test('trivial let', () => {
    let r = parseAndTypecheck('let x = 23;');
    expect(r.kind).toBe('ok');
    expect(r.unsafeGet()).toEqual([
        a.let_('x', a.number(23))
    ]);
});

test('trivial if', () => {
    let r = parseAndTypecheck('let x = 10; if (x) { x = 2; } else { x = 4; }');
    expect(r.kind).toBe('ok');
});

test('trivial while', () => {
    let r = parseAndTypecheck('let x = 1; while(x) { }');
    expect(r.kind).toBe('ok');
});

test('trivial assignment', () => {
    let r = parseAndTypecheck('let x = 1; x = x + 1;');
    expect(r.kind).toBe('ok');
});

test('trivial print', () => {
    let r = parseAndTypecheck('print(1 + 2);');
    expect(r.kind).toBe('ok');
});

test('arithmetic precedence', () => {
    let r = parseAndTypecheck('let x = 1 + 2 * 3;');
    expect(r.kind).toBe('ok');
    expect(r.unsafeGet()).toEqual([
        a.let_('x', a.operator('+', a.number(1),
            a.operator('*', a.number(2), a.number(3))))
    ]);
});

test('subtraction binding', () => {
    let r = parseAndTypecheck('let x = 1 - 2 - 3;');
    expect(r.kind).toBe('ok');
    expect(r.unsafeGet()).toEqual([
        a.let_('x', a.operator('-', a.number(1),
            a.operator('-', a.number(2), a.number(3))))
    ]);
});

test('must declare variables', () => {
    let r = parseAndTypecheck('let x = y + 2;');
    expect(r.kind).toBe('error');
});

test('cannot redeclare variables', () => {
    let r = parseAndTypecheck('let x = 1; let x = 2;');
    expect(r.kind).toBe('error');
});

test('cannot redeclare variables, even in different scopes', () => {
    let r = parseAndTypecheck('let x = 1; while (true) { let x = 2; }');
    expect(r.kind).toBe('error');
});
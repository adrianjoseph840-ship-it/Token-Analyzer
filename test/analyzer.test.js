"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  tokenize,
  SyntaxParser,
  SemanticAnalyzer,
  analyzeSource
} = require("../script.js");

test("tokenizer records token types and source positions", () => {
  const result = tokenize("let total = 12.5;\nprint(total);");

  assert.deepEqual(result.errors, []);
  assert.deepEqual(
    result.tokens.map(({ lexeme, type, line, column }) => ({ lexeme, type, line, column })),
    [
      { lexeme: "let", type: "KEYWORD", line: 1, column: 1 },
      { lexeme: "total", type: "IDENTIFIER", line: 1, column: 5 },
      { lexeme: "=", type: "OPERATOR", line: 1, column: 11 },
      { lexeme: "12.5", type: "NUMBER", line: 1, column: 13 },
      { lexeme: ";", type: "DELIMITER", line: 1, column: 17 },
      { lexeme: "print", type: "KEYWORD", line: 2, column: 1 },
      { lexeme: "(", type: "DELIMITER", line: 2, column: 6 },
      { lexeme: "total", type: "IDENTIFIER", line: 2, column: 7 },
      { lexeme: ")", type: "DELIMITER", line: 2, column: 12 },
      { lexeme: ";", type: "DELIMITER", line: 2, column: 13 }
    ]
  );
});

test("tokenizer reports unsupported characters and unterminated strings", () => {
  const unsupported = tokenize("let x = @;");
  const unterminated = tokenize('print("hello);');

  assert.equal(unsupported.errors[0].message, "Unsupported character '@'.");
  assert.equal(unsupported.errors[0].column, 9);
  assert.equal(unterminated.errors[0].message, "Unterminated string literal.");
});

test("parser builds an AST with operator precedence", () => {
  const { tokens } = tokenize("let answer = 2 + 3 * 4;");
  const ast = new SyntaxParser(tokens).parseProgram();
  const expression = ast.statements[0].initializer;

  assert.equal(expression.operator, "+");
  assert.equal(expression.right.operator, "*");
});

test("semantic analyzer catches undeclared and duplicate variables", () => {
  const { tokens } = tokenize("let x = 1; let x = 2; y = x;");
  const ast = new SyntaxParser(tokens).parseProgram();
  const result = new SemanticAnalyzer().analyze(ast);

  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0].message, /already declared/);
  assert.match(result.errors[1].message, /has not been declared/);
});

test("complete analysis accepts a valid program", () => {
  const result = analyzeSource(`
    let score = 90;
    if (score >= 75) {
      print("Passed");
    }
  `);

  assert.equal(result.accepted, true);
  assert.deepEqual(result.errors, []);
});

test("complete analysis rejects empty and syntactically invalid programs", () => {
  const empty = analyzeSource("");
  const missingSemicolon = analyzeSource("let score = 90");

  assert.equal(empty.accepted, false);
  assert.equal(empty.errors[0].phase, "Syntax");
  assert.equal(missingSemicolon.accepted, false);
  assert.match(missingSemicolon.errors[0].message, /Expected ';'/);
});

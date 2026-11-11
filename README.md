# LexiScope — Programming Token Analyzer

LexiScope is an interactive compiler front-end developed as an Automata Theory
major course output (MCO). It demonstrates how a small programming language is
processed through lexical analysis, syntax analysis, and semantic analysis.

## Features

- Classifies keywords, identifiers, numbers, strings, operators, and delimiters
- Tracks the exact line and column of every recognized token
- Supports single-line and multiline comments
- Builds an abstract syntax tree with recursive-descent parsing
- Applies arithmetic operator precedence
- Detects syntax errors with source locations
- Checks duplicate declarations, undeclared assignments, and variables used
  before declaration
- Models block scope for conditional statements
- Presents a complete, step-by-step analysis trace
- Includes a responsive and keyboard-accessible interface
- Includes automated tests for every analysis stage

## Analysis pipeline

```text
Source code
    │
    ▼
Lexical analyzer ──► Tokens + lexical diagnostics
    │
    ▼
Syntax parser ─────► Abstract syntax tree + syntax diagnostics
    │
    ▼
Semantic analyzer ► Scope validation + semantic diagnostics
```

The next phase runs only when the preceding phase succeeds. A program is
accepted only when all three stages complete without errors.

## Supported language

```ebnf
Program      = Statement, { Statement } ;
Statement    = Declaration | Assignment | Print | If ;
Declaration  = "let", Identifier, "=", Expression, ";" ;
Assignment   = Identifier, "=", Expression, ";" ;
Print        = "print", "(", Expression, ")", ";" ;
If           = "if", "(", Condition, ")", Block ;
Block        = "{", { Statement }, "}" ;
Condition    = Expression, Comparator, Expression ;
Expression   = Term, { ("+" | "-"), Term } ;
Term         = Factor, { ("*" | "/" | "%"), Factor } ;
Factor       = Number | String | Identifier | Boolean |
               "(", Expression, ")" ;
Comparator   = "==" | "!=" | ">" | "<" | ">=" | "<=" ;
Boolean      = "true" | "false" ;
```

Example program:

```text
let score = 90;

if (score >= 75) {
  print("Passed");
}
```

## Run locally

Node.js 18 or newer is required.

```bash
npm install
npm start
```

Open `http://127.0.0.1:3000`. You can also use the included VS Code Live Server
configuration. Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> in the editor to run an
analysis.

## Test

```bash
npm test
```

The test suite covers token recognition and source positions, lexical errors,
operator precedence, semantic rules, valid programs, empty input, and syntax
errors. GitHub Actions runs the same suite on every push and pull request.

## Project structure

```text
.
├── index.html             # Semantic user interface
├── style.css              # Responsive visual design
├── script.js              # Analyzer engine and UI integration
├── server.js              # Dependency-free local HTTP server
├── test/
│   └── analyzer.test.js   # Node.js automated tests
└── .github/workflows/
    └── test.yml           # Continuous integration
```

## Technology

The application uses semantic HTML, modern CSS, and vanilla JavaScript. The
local server and test suite use only built-in Node.js modules, keeping the
project lightweight and easy to review.

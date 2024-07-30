export const locale = {
    format: "{reason} at line {line}",
    symbols: {
      colon: ":",
      comma: ",",
      semicolon: ";",
      slash: "/",
      backslash: "\\",
      brackets: {
        round: "( )",
        square: "[ ]",
        curly: "{ }",
        angle: "< >"
      },
      period: ".",
      quotes: {
        single: "' '",
        double: "\" \"",
        grave: "` `"
      },
      space: " ",
      ampersand: "&",
      asterisk: "*",
      at: "@",
      equals: "=",
      hash: "#",
      percent: "%",
      plus: "+",
      minus: "-",
      dash: "-",
      hyphen: "-",
      tilde: "~",
      underscore: "_",
      bar: "|"
    },
    types: {
      key: "key",
      value: "value",
      number: "number",
      string: "string",
      primitive: "primitive",
      boolean: "boolean",
      character: "character",
      integer: "integer",
      array: "array",
      float: "float"
    },
    invalidToken: {
      tokenSequence: {
        prohibited: "'{firstToken}' token cannot be followed by '{secondToken}' token(s)",
        permitted: "'{firstToken}' token can only be followed by '{secondToken}' token(s)"
      },
      termSequence: {
        prohibited: "A {firstTerm} cannot be followed by a {secondTerm}",
        permitted: "A {firstTerm} can only be followed by a {secondTerm}"
      },
      double: "'{token}' token cannot be followed by another '{token}' token",
      useInstead: "'{badToken}' token is not accepted. Use '{goodToken}' instead",
      unexpected: "Unexpected '{token}' token found"
    },
    brace: {
      curly: {
        missingOpen: "Missing '{' open curly brace",
        missingClose: "Open '{' curly brace is missing closing '}' curly brace",
        cannotWrap: "'{token}' token cannot be wrapped in '{}' curly braces"
      },
      square: {
        missingOpen: "Missing '[' open square brace",
        missingClose: "Open '[' square brace is missing closing ']' square brace",
        cannotWrap: "'{token}' token cannot be wrapped in '[]' square braces"
      }
    },
    string: {
      missingOpen: "Missing/invalid opening string '{quote}' token",
      missingClose: "Missing/invalid closing string '{quote}' token",
      mustBeWrappedByQuotes: "Strings must be wrapped by quotes",
      nonAlphanumeric: "Non-alphanumeric token '{token}' is not allowed outside string notation",
      unexpectedKey: "Unexpected key found at string position"
    },
    key: {
      numberAndLetterMissingQuotes: "Key beginning with number and containing letters must be wrapped by quotes",
      spaceMissingQuotes: "Key containing space must be wrapped by quotes",
      unexpectedString: "Unexpected string found at key position"
    },
    noTrailingOrLeadingComma: "Trailing or leading commas in arrays and objects are not permitted"
  };
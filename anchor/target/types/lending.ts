/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lending.json`.
 */
export type Lending = {
  "address": "5J7J6ReABPxr6ZDoWuokyqwT8M6ehNDQ8fm5GrF9QryK",
  "metadata": {
    "name": "lending",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Lending program"
  },
  "instructions": [
    {
      "name": "approveLoan",
      "discriminator": [
        223,
        27,
        77,
        138,
        94,
        172,
        21,
        209
      ],
      "accounts": [
        {
          "name": "loan",
          "writable": true
        },
        {
          "name": "loanPool",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "createLoanPool",
      "discriminator": [
        104,
        146,
        212,
        187,
        156,
        36,
        220,
        6
      ],
      "accounts": [
        {
          "name": "loanPool",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "loanPoolParams"
            }
          }
        }
      ]
    },
    {
      "name": "makePayment",
      "discriminator": [
        19,
        128,
        153,
        121,
        221,
        192,
        91,
        53
      ],
      "accounts": [
        {
          "name": "loan",
          "writable": true
        },
        {
          "name": "loanPool",
          "writable": true
        },
        {
          "name": "borrower",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "requestLoan",
      "discriminator": [
        120,
        2,
        7,
        7,
        1,
        219,
        235,
        187
      ],
      "accounts": [
        {
          "name": "loan",
          "writable": true,
          "signer": true
        },
        {
          "name": "loanPool",
          "writable": true
        },
        {
          "name": "borrower",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "loan",
      "discriminator": [
        20,
        195,
        70,
        117,
        165,
        227,
        182,
        1
      ]
    },
    {
      "name": "loanPool",
      "discriminator": [
        179,
        24,
        123,
        83,
        155,
        186,
        17,
        89
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidLoanAmount",
      "msg": "Invalid loan amount"
    },
    {
      "code": 6001,
      "name": "invalidLoanStatus",
      "msg": "Invalid loan status"
    },
    {
      "code": 6002,
      "name": "insufficientFunds",
      "msg": "Insufficient funds"
    }
  ],
  "types": [
    {
      "name": "assetType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "realEstate"
          },
          {
            "name": "vehicle"
          },
          {
            "name": "equipment"
          },
          {
            "name": "other"
          }
        ]
      }
    },
    {
      "name": "loan",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "loanPool",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "interestRate",
            "type": "u64"
          },
          {
            "name": "term",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "loanStatus"
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "loanPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "assetType",
            "type": {
              "defined": {
                "name": "assetType"
              }
            }
          },
          {
            "name": "interestRate",
            "type": "u64"
          },
          {
            "name": "maxLoanAmount",
            "type": "u64"
          },
          {
            "name": "minLoanAmount",
            "type": "u64"
          },
          {
            "name": "loanTerm",
            "type": "u64"
          },
          {
            "name": "collateralRatio",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "loanPoolStatus"
              }
            }
          },
          {
            "name": "totalLoans",
            "type": "u64"
          },
          {
            "name": "totalBorrowed",
            "type": "u64"
          },
          {
            "name": "availableFunds",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "loanPoolParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "assetType",
            "type": {
              "defined": {
                "name": "assetType"
              }
            }
          },
          {
            "name": "interestRate",
            "type": "u64"
          },
          {
            "name": "maxLoanAmount",
            "type": "u64"
          },
          {
            "name": "minLoanAmount",
            "type": "u64"
          },
          {
            "name": "loanTerm",
            "type": "u64"
          },
          {
            "name": "collateralRatio",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "loanPoolStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "paused"
          },
          {
            "name": "closed"
          }
        ]
      }
    },
    {
      "name": "loanStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "requested"
          },
          {
            "name": "active"
          },
          {
            "name": "completed"
          },
          {
            "name": "defaulted"
          }
        ]
      }
    }
  ]
};

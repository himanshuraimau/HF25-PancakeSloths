/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/user.json`.
 */
export type User = {
  "address": "598Swc49CxCyKgdqA3LCLSYQu8r6sninckgSeZdisjiP",
  "metadata": {
    "name": "user",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "User management program"
  },
  "instructions": [
    {
      "name": "createUserProfile",
      "discriminator": [
        9,
        214,
        142,
        184,
        153,
        65,
        50,
        174
      ],
      "accounts": [
        {
          "name": "userProfile",
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
              "name": "userProfileParams"
            }
          }
        }
      ]
    },
    {
      "name": "enableTwoFactor",
      "discriminator": [
        0,
        82,
        162,
        128,
        129,
        138,
        175,
        124
      ],
      "accounts": [
        {
          "name": "userProfile",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "userProfile"
          ]
        }
      ],
      "args": [
        {
          "name": "secret",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateUserProfile",
      "discriminator": [
        79,
        75,
        114,
        130,
        68,
        123,
        180,
        11
      ],
      "accounts": [
        {
          "name": "userProfile",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "userProfile"
          ]
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "userProfileParams"
            }
          }
        }
      ]
    },
    {
      "name": "verifyKyc",
      "discriminator": [
        102,
        127,
        254,
        101,
        12,
        246,
        86,
        71
      ],
      "accounts": [
        {
          "name": "userProfile",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "userProfile"
          ]
        }
      ],
      "args": [
        {
          "name": "kycData",
          "type": {
            "defined": {
              "name": "kycData"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userProfile",
      "discriminator": [
        32,
        37,
        119,
        205,
        179,
        180,
        13,
        194
      ]
    }
  ],
  "types": [
    {
      "name": "kycData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "documentType",
            "type": "string"
          },
          {
            "name": "documentNumber",
            "type": "string"
          },
          {
            "name": "verifiedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "fullName",
            "type": "string"
          },
          {
            "name": "email",
            "type": "string"
          },
          {
            "name": "role",
            "type": {
              "defined": {
                "name": "userRole"
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "userStatus"
              }
            }
          },
          {
            "name": "twoFactorEnabled",
            "type": "bool"
          },
          {
            "name": "twoFactorSecret",
            "type": "string"
          },
          {
            "name": "kycVerified",
            "type": "bool"
          },
          {
            "name": "kycData",
            "type": {
              "defined": {
                "name": "kycData"
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
      "name": "userProfileParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fullName",
            "type": "string"
          },
          {
            "name": "email",
            "type": "string"
          },
          {
            "name": "role",
            "type": {
              "defined": {
                "name": "userRole"
              }
            }
          }
        ]
      }
    },
    {
      "name": "userRole",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "admin"
          },
          {
            "name": "moderator"
          },
          {
            "name": "user"
          }
        ]
      }
    },
    {
      "name": "userStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "suspended"
          },
          {
            "name": "banned"
          }
        ]
      }
    }
  ]
};

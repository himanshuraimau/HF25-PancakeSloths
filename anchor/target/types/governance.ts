/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/governance.json`.
 */
export type Governance = {
  "address": "Govz1Vy1h2fteYoWfD75UGj6XtgKQdW3tKkwD8Tigq6u",
  "metadata": {
    "name": "governance",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Governance program"
  },
  "instructions": [
    {
      "name": "castVote",
      "discriminator": [
        20,
        212,
        15,
        189,
        69,
        180,
        69,
        151
      ],
      "accounts": [
        {
          "name": "voteRecord",
          "writable": true,
          "signer": true
        },
        {
          "name": "proposal",
          "writable": true
        },
        {
          "name": "voter",
          "writable": true,
          "signer": true
        },
        {
          "name": "voterTokenAccount",
          "writable": true
        },
        {
          "name": "governanceTokenMint"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "vote",
          "type": {
            "defined": {
              "name": "vote"
            }
          }
        }
      ]
    },
    {
      "name": "createProposal",
      "discriminator": [
        132,
        116,
        68,
        174,
        216,
        160,
        198,
        22
      ],
      "accounts": [
        {
          "name": "proposal",
          "writable": true,
          "signer": true
        },
        {
          "name": "governance",
          "writable": true
        },
        {
          "name": "creator",
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
              "name": "proposalParams"
            }
          }
        }
      ]
    },
    {
      "name": "finalizeProposal",
      "discriminator": [
        23,
        68,
        51,
        167,
        109,
        173,
        187,
        164
      ],
      "accounts": [
        {
          "name": "proposal",
          "writable": true
        },
        {
          "name": "governance",
          "writable": true
        },
        {
          "name": "governanceTokenMint"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "governance",
      "discriminator": [
        18,
        143,
        88,
        13,
        73,
        217,
        47,
        49
      ]
    },
    {
      "name": "proposal",
      "discriminator": [
        26,
        94,
        189,
        187,
        116,
        136,
        53,
        33
      ]
    },
    {
      "name": "voteRecord",
      "discriminator": [
        112,
        9,
        123,
        165,
        234,
        9,
        157,
        167
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "notInVotingPeriod",
      "msg": "Not in voting period"
    },
    {
      "code": 6001,
      "name": "votingNotEnded",
      "msg": "Voting period has not ended"
    },
    {
      "code": 6002,
      "name": "alreadyFinalized",
      "msg": "Proposal already finalized"
    },
    {
      "code": 6003,
      "name": "quorumNotMet",
      "msg": "Quorum not met"
    }
  ],
  "types": [
    {
      "name": "governance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "activeProposals",
            "type": "u64"
          },
          {
            "name": "totalProposals",
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
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "governance",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "category",
            "type": {
              "defined": {
                "name": "proposalCategory"
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "proposalStatus"
              }
            }
          },
          {
            "name": "votingStart",
            "type": "i64"
          },
          {
            "name": "votingEnd",
            "type": "i64"
          },
          {
            "name": "quorum",
            "type": "u8"
          },
          {
            "name": "threshold",
            "type": "u8"
          },
          {
            "name": "yesVotes",
            "type": "u64"
          },
          {
            "name": "noVotes",
            "type": "u64"
          },
          {
            "name": "abstainVotes",
            "type": "u64"
          },
          {
            "name": "totalVotes",
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
      "name": "proposalCategory",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "protocol"
          },
          {
            "name": "treasury"
          },
          {
            "name": "parameter"
          },
          {
            "name": "other"
          }
        ]
      }
    },
    {
      "name": "proposalParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "category",
            "type": {
              "defined": {
                "name": "proposalCategory"
              }
            }
          },
          {
            "name": "votingStart",
            "type": "i64"
          },
          {
            "name": "votingEnd",
            "type": "i64"
          },
          {
            "name": "quorum",
            "type": "u8"
          },
          {
            "name": "threshold",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "proposalStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "draft"
          },
          {
            "name": "passed"
          },
          {
            "name": "rejected"
          }
        ]
      }
    },
    {
      "name": "vote",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "yes"
          },
          {
            "name": "no"
          },
          {
            "name": "abstain"
          }
        ]
      }
    },
    {
      "name": "voteRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "proposal",
            "type": "pubkey"
          },
          {
            "name": "vote",
            "type": {
              "defined": {
                "name": "vote"
              }
            }
          },
          {
            "name": "weight",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    }
  ]
};

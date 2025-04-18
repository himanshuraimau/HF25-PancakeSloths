/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/community.json`.
 */
export type Community = {
  "address": "GiEVmbRtjqkLHkUGTqx4KBr7bZ43kMep8Mzs1TvRbcCJ",
  "metadata": {
    "name": "community",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Community program"
  },
  "instructions": [
    {
      "name": "createComment",
      "discriminator": [
        236,
        232,
        11,
        180,
        70,
        206,
        73,
        145
      ],
      "accounts": [
        {
          "name": "comment",
          "writable": true,
          "signer": true
        },
        {
          "name": "post",
          "writable": true
        },
        {
          "name": "author",
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
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "createCommunity",
      "discriminator": [
        203,
        214,
        176,
        194,
        13,
        207,
        22,
        60
      ],
      "accounts": [
        {
          "name": "community",
          "writable": true,
          "signer": true
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
              "name": "communityParams"
            }
          }
        }
      ]
    },
    {
      "name": "createPost",
      "discriminator": [
        123,
        92,
        184,
        29,
        231,
        24,
        15,
        202
      ],
      "accounts": [
        {
          "name": "post",
          "writable": true,
          "signer": true
        },
        {
          "name": "community",
          "writable": true
        },
        {
          "name": "author",
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
              "name": "postParams"
            }
          }
        }
      ]
    },
    {
      "name": "joinCommunity",
      "discriminator": [
        252,
        106,
        147,
        30,
        134,
        74,
        28,
        232
      ],
      "accounts": [
        {
          "name": "membership",
          "writable": true,
          "signer": true
        },
        {
          "name": "community",
          "writable": true
        },
        {
          "name": "member",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "likePost",
      "discriminator": [
        45,
        242,
        154,
        71,
        63,
        133,
        54,
        186
      ],
      "accounts": [
        {
          "name": "like",
          "writable": true,
          "signer": true
        },
        {
          "name": "post",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "comment",
      "discriminator": [
        150,
        135,
        96,
        244,
        55,
        199,
        50,
        65
      ]
    },
    {
      "name": "community",
      "discriminator": [
        192,
        73,
        211,
        158,
        178,
        81,
        19,
        112
      ]
    },
    {
      "name": "like",
      "discriminator": [
        10,
        133,
        129,
        201,
        87,
        218,
        203,
        222
      ]
    },
    {
      "name": "membership",
      "discriminator": [
        231,
        141,
        180,
        98,
        109,
        168,
        175,
        166
      ]
    },
    {
      "name": "post",
      "discriminator": [
        8,
        147,
        90,
        186,
        185,
        56,
        192,
        150
      ]
    }
  ],
  "types": [
    {
      "name": "comment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "post",
            "type": "pubkey"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "commentStatus"
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
      "name": "commentStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "hidden"
          }
        ]
      }
    },
    {
      "name": "community",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
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
            "name": "category",
            "type": {
              "defined": {
                "name": "communityCategory"
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "communityStatus"
              }
            }
          },
          {
            "name": "memberCount",
            "type": "u64"
          },
          {
            "name": "postCount",
            "type": "u64"
          },
          {
            "name": "rules",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "tags",
            "type": {
              "vec": "string"
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
      "name": "communityCategory",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "general"
          },
          {
            "name": "technology"
          },
          {
            "name": "finance"
          },
          {
            "name": "art"
          },
          {
            "name": "gaming"
          },
          {
            "name": "other"
          }
        ]
      }
    },
    {
      "name": "communityParams",
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
            "name": "category",
            "type": {
              "defined": {
                "name": "communityCategory"
              }
            }
          },
          {
            "name": "rules",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "tags",
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    },
    {
      "name": "communityStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "archived"
          },
          {
            "name": "banned"
          }
        ]
      }
    },
    {
      "name": "like",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "post",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "memberRole",
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
            "name": "member"
          }
        ]
      }
    },
    {
      "name": "membership",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "member",
            "type": "pubkey"
          },
          {
            "name": "community",
            "type": "pubkey"
          },
          {
            "name": "role",
            "type": {
              "defined": {
                "name": "memberRole"
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "membershipStatus"
              }
            }
          },
          {
            "name": "joinedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "membershipStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "banned"
          }
        ]
      }
    },
    {
      "name": "post",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "community",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "category",
            "type": {
              "defined": {
                "name": "postCategory"
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "postStatus"
              }
            }
          },
          {
            "name": "likeCount",
            "type": "u64"
          },
          {
            "name": "commentCount",
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
      "name": "postCategory",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "discussion"
          },
          {
            "name": "question"
          },
          {
            "name": "announcement"
          },
          {
            "name": "event"
          },
          {
            "name": "other"
          }
        ]
      }
    },
    {
      "name": "postParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "category",
            "type": {
              "defined": {
                "name": "postCategory"
              }
            }
          }
        ]
      }
    },
    {
      "name": "postStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "archived"
          },
          {
            "name": "hidden"
          }
        ]
      }
    }
  ]
};

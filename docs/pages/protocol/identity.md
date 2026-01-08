---
title: Identity
description: How accounts and keys are managed in the OBJECTS protocol.
---

# Identity

The identity layer provides portable, user-owned identities for the OBJECTS protocol. Users can create an identity using passkeys, associate human-readable handles, and optionally link wallet addresses for payments.

## Design Goals

| Goal | Description |
|------|-------------|
| User Ownership | Users control their identity with no platform lock-in |
| Passkey-First | Users can create identity without a wallet |
| Wallet Optional | Users can link a wallet for payments |
| Portable | Identity can be exported and verified independently |
| Pseudonymous | No PII required; handles are user-chosen aliases |

## Identity Identifier

Each identity has a unique identifier derived from the user's signing key.

```
obj_7kd2zcx9f3m1qwerty
```

The identifier is derived from:

```
identity_id = "obj_" + base58(truncate(sha256(public_key || nonce), 15))
```

- **Prefix**: Always `obj_`
- **Length**: Exactly 24 characters total
- **Encoding**: Base58 (Bitcoin alphabet)

The nonce ensures that users can create multiple identities from the same key if needed.

## Handles

Handles are human-readable aliases displayed as `@username`.

### Format Rules

- **Length**: 1-30 characters
- **Characters**: Lowercase letters, numbers, underscores, periods
- **Cannot start with**: Period or underscore
- **Cannot end with**: Period
- **Cannot contain**: Consecutive periods (`..`)

### Examples

| Handle | Valid | Reason |
|--------|-------|--------|
| `alice` | ✓ | Simple alphanumeric |
| `alice_123` | ✓ | Underscore and numbers allowed |
| `design.studio` | ✓ | Period as separator |
| `_alice` | ✗ | Cannot start with underscore |
| `alice..bob` | ✗ | No consecutive periods |
| `Alice` | ✗ | Must be lowercase |

## Signer Types

OBJECTS supports two types of cryptographic signers:

### Passkey (WebAuthn)

Passkeys use the **secp256r1 (P-256)** curve via the WebAuthn standard. This enables biometric authentication (Face ID, Touch ID, Windows Hello) without requiring users to manage wallets or keys.

- Device-native authentication
- Synced across devices via iCloud/Google/1Password
- No seed phrases to manage

### Wallet

Wallets use the **secp256k1** curve with standard signing schemes. This enables integration with existing wallet infrastructure.

- Connect an existing wallet
- Link wallet for payments and licensing
- Sign with familiar wallet UX

## Operations

### Create Identity

Creates a new identity with a handle. The user signs a message proving ownership of their key.

**Requirements:**
- Handle must be available
- Signer must not already have an identity
- Nonce must be cryptographically random

### Link Wallet

Links a wallet address to an existing passkey identity. This enables payment functionality while keeping the passkey as the primary authentication method.

**Requirements:**
- Both the identity signer AND wallet must sign
- Wallet must not be linked to another identity

### Change Handle

Changes the handle associated with an identity. The old handle becomes available for others to claim.

**Requirements:**
- New handle must be available
- Must be signed by the identity's signer

### Sign Asset

Signs an asset (design file, CAD model, etc.) to prove ownership. The signature includes the asset's content hash and can be verified by anyone with access to the identity registry.

```
Identity: obj_7kd2zcx9f3m1qwerty
Asset: a1b2c3d4e5f6... (SHA-256 hash)
Timestamp: 1704542400
```

### Authenticate

Authenticates to an application by signing a challenge. Applications generate a random challenge, the user signs it, and the application verifies the signature against the registry.

## Registry

The registry stores identities and provides resolution services.

### Resolution

Identities can be looked up by:

| Key | Example |
|-----|---------|
| Identity ID | `obj_7kd2zcx9f3m1qwerty` |
| Handle | `alice` |
| Public Key | `02c6047f9441ed7d...` |
| Wallet Address | `0x1234...abcd` |

### Verification

The registry verifies all operations before accepting them:

1. Signature is valid for the claimed signer
2. Timestamps are within acceptable window
3. Uniqueness constraints are maintained (handles, wallets)
4. Identity ID matches the derivation formula

## Security Model

### Key Compromise

If a signer key is compromised:
- Attacker can act as that identity
- User should create a new identity
- Historical signatures remain valid but attributed to compromised identity

### Recovery (Future)

Version 0.2 will add recovery mechanisms:
- Multiple passkeys across devices
- Linked wallet as recovery option
- Social recovery via trusted contacts

### Privacy

- Identity IDs are pseudonymous (no PII in derivation)
- Handles are user-chosen and may or may not contain PII
- Registry data is public
- Wallet addresses are public by design

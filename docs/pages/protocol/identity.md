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

Each identity has a unique identifier derived from the user's signing key. Identifiers use the `obj_` prefix and are 24 characters total.

```
obj_7kd2zcx9f3m1qwerty
```

A nonce is included in the derivation, allowing users to create multiple identities from the same key if needed.

## Handles

Handles are human-readable aliases displayed as `@username`. They use lowercase letters, numbers, underscores, and periods. Handles are unique and can be changed — the old handle becomes available for others to claim.

## Signer Types

OBJECTS supports two types of cryptographic signers:

### Passkey

Passkeys enable biometric authentication (Face ID, Touch ID, Windows Hello) without requiring users to manage wallets or keys.

- Device-native authentication
- Synced across devices via iCloud/Google/1Password
- No seed phrases to manage

### Wallet

Wallets enable integration with existing wallet infrastructure.

- Connect an existing wallet
- Link wallet for payments and licensing
- Sign with familiar wallet UX

## Operations

### Create Identity

Creates a new identity with a handle. The user signs a message proving ownership of their key.

### Link Wallet

Links a wallet address to an existing passkey identity. This enables payment functionality while keeping the passkey as the primary authentication method. Both the identity signer and wallet must sign.

### Change Handle

Changes the handle associated with an identity. The old handle becomes available for others to claim.

### Sign Asset

Signs an asset (design file, CAD model, etc.) to prove ownership. The signature includes the asset's content hash and can be verified by anyone.

### Authenticate

Authenticates to an application by signing a challenge. Applications generate a random challenge, the user signs it, and the application verifies the signature.

## Registry

The registry stores identities and provides resolution services. Identities can be looked up by ID, handle, public key, or linked wallet address.

## Security

### Key Compromise

If a signer key is compromised, an attacker can act as that identity. Users should create a new identity if compromise is detected. Historical signatures remain valid but are attributed to the compromised identity.

### Recovery (Future)

Version 0.2 will add recovery mechanisms including multiple passkeys across devices, linked wallet as recovery option, and social recovery via trusted contacts.

### Privacy

Identity IDs are pseudonymous with no PII in the derivation. Handles are user-chosen and may or may not contain PII. Registry data and wallet addresses are public by design.

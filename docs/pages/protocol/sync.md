---
title: Sync
description: Mechanisms for synchronizing state between peers in the OBJECTS protocol.
---

# Sync

The sync layer provides content-addressed data synchronization for the OBJECTS protocol. It handles blob transfer, metadata reconciliation, and sync discovery, enabling data to move seamlessly between devices and collaborators without central coordination.

## Design Goals

| Goal | Description |
| --- | --- |
| Content-Addressed | All data identified by cryptographic hash |
| Incremental | Transfer only what's missing, verify as you go |
| Offline-First | Nodes operate independently, sync when connected |
| Transport-Agnostic | Works over any OBJECTS transport connection |
| Eventual Consistency | All nodes converge to the same state |

## Sync Primitives

The protocol defines two complementary sync mechanisms:

| Mechanism | Purpose |
| --- | --- |
| Blob Sync | Transfer binary content by hash |
| Metadata Sync | Reconcile structured entries between nodes |

Blob Sync handles raw data transfer with verification. Metadata Sync handles the index of what data exists and where it lives.

## Blob Sync

Blobs are opaque sequences of bytes identified by their BLAKE3 hash. When you request a blob, you specify the expected hash. The content is verified incrementally during transfer.

### Content Addressing

```
hash = BLAKE3(content)
```

Same content always produces the same 32-byte hash. This enables deduplication and integrity verification without trusting the source.

### Verified Streaming

Blob transfer uses BLAKE3 verified streaming with BAO (BLAKE3 Authenticated Output).

| Parameter | Value |
| --- | --- |
| Chunk size | 1024 bytes |
| Chunk group size | 16 KiB (16 chunks) |
| Verification granularity | Per chunk group |

Content is verified incrementally as it arrives. Corrupted data is rejected immediately without waiting for the full transfer. Nodes can request byte ranges for partial or resumed transfers, making large file sync resilient to network interruptions.

### Collections

A Collection is an ordered list of blobs treated as a unit. Use cases include:

- Multi-file transfers (e.g., CAD assembly with parts)
- Atomic updates (all-or-nothing sync)
- Chunked large files

## Metadata Sync

Metadata Sync reconciles structured entries between nodes using set reconciliation.

### Entries

An Entry associates a key with a blob reference:

| Field | Description |
| --- | --- |
| key | Application-defined key (path, ID, etc.) |
| author | Ed25519 public key of entry creator |
| hash | BLAKE3 hash reference to blob content |
| size | Size of referenced blob in bytes |
| timestamp | Unix timestamp in microseconds when entry was created |

Entries are signed by the author's private key. Multiple authors can write to the same key. Each author's entry is preserved independently.

### Replicas

A Replica is a local collection of entries that syncs with peers. Each replica has a unique ID derived from a keypair:

| Capability | Grants |
| --- | --- |
| Write | Create/update entries (requires private key) |
| Read | Fetch and verify entries |
| Sync | Participate in reconciliation |

### Set Reconciliation

Nodes sync entries efficiently using range-based set reconciliation:

1. Nodes exchange fingerprints of entry ranges
2. Differing ranges are recursively subdivided
3. Process continues until missing entries identified
4. Only missing entries are transferred

Transfer is proportional to differences, not total size. Syncing one new entry from a million-entry replica is fast.

## Sync Discovery

Sync Discovery enables nodes to find and initiate data synchronization.

### Explicit Sync

Once connected via the transport layer, nodes request sync directly by specifying which replica or blob they want.

### Tickets

A Ticket encodes everything needed to sync specific data. Tickets are designed for:

- Copy/paste sharing
- QR code encoding
- URL embedding

| Ticket Type | Contains | Grants |
| --- | --- | --- |
| Blob ticket | Hash + peer address | Read access to specific blob |
| Doc ticket (read) | Replica ID + peer | Read access to all entries |
| Doc ticket (write) | Replica secret + peer | Write access to replica |

Write tickets must be treated as secrets. Sharing one grants full write access to the replica.

## Vault Discovery

User vaults enable private, decentralized project discovery. Unlike explicit tickets, vaults allow applications to discover all of a user's projects without centralized infrastructure.

### Vault Access Pattern

Applications cannot derive vault namespace IDs themselves. They must request vault access from the user's wallet or keyring.

| Step | Actor | Action |
| --- | --- | --- |
| 1. Authenticate | User | Signs challenge with identity signer |
| 2. Request Access | App | Requests vault ticket from wallet |
| 3. Derive Namespace | Wallet | Derives namespace ID from signing key (HKDF-SHA256) |
| 4. Issue Ticket | Wallet | Creates read-only DocTicket for vault |
| 5. Sync Vault | App | Syncs vault replica using ticket |
| 6. Request Key | App | Requests decryption key from wallet |
| 7. Decrypt Catalog | App | Decrypts catalog entries to discover projects |
| 8. Sync Projects | App | Syncs each discovered project replica |

### Privacy Properties

| Aspect | Privacy Level |
| --- | --- |
| Vault ID | Private (requires signing key) |
| Catalog keys | Private (visible only after vault access) |
| Catalog values | Encrypted (XChaCha20-Poly1305) |
| Project IDs | Private (encrypted in catalog) |

Without the identity signing key, vault namespace ID cannot be computed. This prevents enumeration of projects or correlation of vaults across identities.

### Vault Availability

Vaults may be hosted by user devices, self-hosted nodes, foundation seed nodes, or third-party services. The protocol does not mandate hosting location. If vaults are unavailable, applications fall back to explicit project ticket sharing.

## Consistency Model

The protocol provides eventual consistency: if no new updates are made, all nodes will eventually converge to the same state.

### Conflict Handling

When multiple authors write to the same key:

1. All entries are preserved (multi-value)
2. Entries are distinguishable by author
3. Applications implement resolution strategies
4. Protocol does not automatically discard entries

Applications can implement last-write-wins, author-priority, merge logic, or manual resolution. The protocol preserves all entries to enable any strategy.

## Security

### Content Verification

All blob content is verified against its hash. Nodes reject content that doesn't match or entries with invalid signatures.

### Capability Security

Write capability requires possession of the replica private key. Entries must be signed. Unsigned entries are never accepted.

### Privacy

Content hashes reveal nothing about content. However, sync patterns are observable. Nodes can see who syncs what. Applications requiring confidentiality must encrypt at the data layer.

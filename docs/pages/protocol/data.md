---
title: Data
description: Asset schemas, operations, versioning, and history in the OBJECTS protocol.
---

# Data

The data layer defines schemas for content in the OBJECTS protocol. It specifies Asset, Project, and Reference, the core primitives that enable interoperability across applications.

## Design Goals

| Goal | Description |
| --- | --- |
| Structured | Defined schemas for protocol primitives |
| Minimal | Only essential primitives defined |
| Opinionated | Fixed fields ensure interoperability across applications |
| Interoperable | Common vocabulary enables data exchange across applications |

## Data Types

The protocol defines five core types:

| Type | Purpose |
| --- | --- |
| Asset | A versioned unit of content with metadata |
| SignedAsset | Asset with cryptographic authorship proof |
| Project | An organizational grouping of assets |
| ProjectCatalogEntry | Encrypted project reference in user vault |
| Reference | A typed link between assets |

### Asset

An Asset is the fundamental unit of content. It represents a versioned piece of content with associated metadata.

| Field | Description |
| --- | --- |
| id | Unique identifier within project |
| name | Human-readable name |
| author_id | Identity ID of the asset creator |
| content_hash | BLAKE3 hash of content (32 bytes) |
| content_size | Size of content in bytes |
| format | MIME type or format identifier (optional) |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

The `content_hash` serves as a version identifier. Same content produces the same hash. No separate version numbering is required.

### SignedAsset

A SignedAsset wraps an Asset with a cryptographic signature, enabling authorship verification without registry lookups.

| Component | Description |
| --- | --- |
| asset | Asset record with metadata |
| signature | Cryptographic signature from identity signer |
| nonce | 8-byte nonce for identity derivation verification |

Signatures enable offline verification of authorship. Verifiers check that the `author_id` matches the signature's public key without requiring registry access.

### Project

A Project is an organizational grouping of assets. It maps 1:1 with a sync layer Replica.

| Field | Description |
| --- | --- |
| id | Unique identifier (derived from ReplicaId) |
| name | Human-readable name |
| description | Project description (optional) |
| owner_id | Identity ID of the project owner |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

This means:

- Creating a project creates a replica
- Sharing a project shares the doc ticket
- Project sync scope = replica sync scope
- Write access = replica write capability

## User Vault

A User Vault is a private replica containing an encrypted catalog of all projects owned by an identity. Vaults enable cross-application project discovery without centralized infrastructure.

### Purpose

| Use Case | Description |
| --- | --- |
| Project Discovery | New apps discover user's existing projects |
| Cross-App Portability | Data follows users between applications |
| Privacy-Preserving | Projects not publicly enumerable |
| Decentralized | No central directory required |

### Vault Namespace Derivation

Vault replica namespace is derived from the identity's **signing key secret** using HKDF-SHA256. Only the identity owner (who has the signing key) can compute the vault namespace ID.

| Property | Value |
| --- | --- |
| Input | Identity signing key secret (32 bytes) |
| Algorithm | HKDF-SHA256 |
| Output | Vault namespace keypair + encryption key |
| Privacy | Cannot be computed without signing key |

This ensures project catalogs remain private by default. Applications cannot derive vault IDs. They must request vault access from the user. Users explicitly grant permission for each app to access their project catalog.

### Catalog Structure

Vault entries use the key format `/catalog/{project_id}` and contain encrypted ProjectCatalogEntry records.

**ProjectCatalogEntry fields:**

| Field | Description |
| --- | --- |
| project_id | Unique project identifier |
| replica_id | NamespaceId of project replica (32 bytes) |
| project_name | Human-readable name |
| created_at | Creation timestamp (Unix seconds) |

**Storage format:**

```
Entry Key: /catalog/{project_id}
Entry Value: nonce (24 bytes) || XChaCha20-Poly1305(ProjectCatalogEntry)
```

Encryption uses XChaCha20-Poly1305 AEAD with the catalog encryption key derived alongside the vault namespace.

### Access Control

| Access Type | Required |
| --- | --- |
| Write | Vault namespace secret (derived from signing key) |
| Read | Vault namespace ID (derived from signing key) |
| Decryption | Catalog encryption key (derived from signing key) |

Only the identity owner can write to, read from, or decrypt vault contents. Applications request vault access. Users grant permission via signature, and their identity signer issues a read-only capability ticket.

The read-only vault ticket allows applications to discover which projects exist. Once projects are discovered, users can read and write to those projects based on the project's own access control. Users who own projects have write capability to those projects through the app.

### Vault Lifecycle

**Creation:** Vault created automatically when user creates their first project.

**Updates:** Wallet updates vault when projects are created, renamed, or deleted.

**Synchronization:** Vaults sync via standard replica synchronization across user devices.

**Discovery:** Apps request vault access. User grants permission via signature. Identity signer issues read-only ticket. App syncs vault, requests decryption key, and discovers projects.

### Reference

A Reference is a typed link between assets. References enable dependency graphs, assembly structures, and version chains without embedding data.

| Field | Description |
| --- | --- |
| id | Unique identifier within project |
| source_asset_id | ID of the source asset |
| target_asset_id | ID of the target asset |
| target_content_hash | Specific version of target (optional) |
| reference_type | Type of relationship |
| created_at | Creation timestamp |

#### Reference Types

| Type | Description |
| --- | --- |
| CONTAINS | Source contains target (assembly → part) |
| DEPENDS_ON | Source depends on target |
| DERIVED_FROM | Source is derived from target (version chain) |
| REFERENCES | Generic reference |

#### Cross-Project References

References can point to assets in other projects for cross-project dependencies.

| Field | Description |
| --- | --- |
| source_asset_id | Asset in current project |
| target_project_id | ID of external project |
| target_asset_id | Asset in target project |
| target_content_hash | Optional: specific version |
| reference_type | Relationship type |

Applications must handle cases where the target project isn't synced or the target asset isn't accessible. Cross-project references enable modular design across organizational boundaries.

## Storage

Data types are stored as sync layer entries with structured keys.

### Key Format

```
/{type}/{id}
```

Examples:

```
/project                    → Project metadata
/assets/motor-mount         → Asset record
/assets/gear-assembly       → Asset record
/refs/assembly-to-part-1    → Reference record
```

### Content Storage

Asset metadata and content are stored separately:

- **Entry**: Contains the Asset record (name, format, timestamps, content_hash)
- **Blob**: Contains the actual file bytes, referenced by content_hash

Nodes fetch the content blob separately via blob sync when needed.

## Operations

### Create Project

Creates a new project and underlying replica. The creator gets write capability.

### Create Asset

Adds an asset to a project:

1. Store content blob via blob sync
2. Create Asset record with content hash
3. Store Asset entry at `/assets/{id}`

Requires write capability for the project.

### Update Asset

Updates an existing asset's content or metadata. Updates are last-write-wins based on timestamp. The sync layer preserves all author versions; applications resolve conflicts.

### Create Reference

Creates a link between assets. Applications should verify that source and target assets exist.

## Versioning

### Content Versioning

Asset versions are identified by content hash. To maintain version history, applications create `DERIVED_FROM` references:

```
Asset v3 (hash: 0xdef...)
  └── DERIVED_FROM → Asset v2 (hash: 0xabc...)
       └── DERIVED_FROM → Asset v1 (hash: 0x123...)
```

Applications traverse these references to build version chains.

### Schema Versioning

The wire format uses Protocol Buffers, which provides schema evolution:

- New fields are added with new numbers
- Old fields are never removed
- Unknown fields are preserved

## Security

### Authorization

Data operations inherit sync layer capabilities:

| Operation | Required |
| --- | --- |
| Read assets | Read capability (ReplicaId) |
| Create/update assets | Write capability (private key) |
| Share project | Ability to share doc ticket |

### Content Integrity

Asset content is verified by BLAKE3 hash. Nodes verify content matches `content_hash` before accepting.

### Vault Security

Vault security is tied to identity signing key security.

| Threat | Mitigation |
| --- | --- |
| Vault enumeration | Namespace derived from private key |
| Catalog exposure | XChaCha20-Poly1305 encryption |
| Key compromise | Same recovery as identity compromise |
| Unauthorized access | Apps cannot derive vault ID |

Vault namespace secret has the same recovery requirements as the identity itself. Future multi-signer support will enable vault recovery through trusted devices.

### Cross-Project References

References can point to assets in other projects. Applications must handle cases where the target project isn't synced or the target asset isn't accessible.

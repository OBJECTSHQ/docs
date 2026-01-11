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

The protocol defines three core types:

| Type | Purpose |
| --- | --- |
| Asset | A versioned unit of content with metadata |
| Project | An organizational grouping of assets |
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

References can also point to assets in other projects for cross-project dependencies.

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

### Cross-Project References

References can point to assets in other projects. Applications must handle cases where the target project isn't synced or the target asset isn't accessible.

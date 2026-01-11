---
title: Transport
description: How data moves between nodes in the OBJECTS protocol.
---

# Transport

The transport layer provides peer-to-peer connectivity for the OBJECTS protocol. It handles connection establishment, NAT traversal, and peer discovery using QUIC, a modern transport protocol built on UDP.

## Design Goals

| Goal | Description |
| --- | --- |
| Mobile-friendly | QUIC handles network transitions and intermittent connectivity |
| NAT traversal | Relay-assisted holepunching for universal reachability |
| Encrypted by default | All connections use TLS 1.3 |
| Single network | All conforming nodes participate in one shared network |

## Node Addressing

Each node has a unique identifier derived from an Ed25519 keypair.

### NodeId

A 32-byte Ed25519 public key that uniquely identifies a node. NodeIds are encoded as z-base-32 for human readability.

### NodeAddr

Contains everything needed to connect to a node:

- **node_id** — The node's public key
- **relay_url** — The node's preferred relay server (optional)
- **direct_addresses** — Known direct IP addresses (optional)

A NodeAddr with only a `node_id` can be resolved via DNS lookup.

## Connection Model

Connections are established through a relay-assisted process:

1. Both nodes connect to a relay server
2. Node A requests connection to Node B
3. Relay coordinates NAT holepunching
4. Direct connection established if possible, otherwise relayed

All connections use QUIC with TLS 1.3 encryption. Protocol version is negotiated via ALPN during the handshake.

## Peer Discovery

Discovery allows nodes to find other participants in the network.

### Bootstrap

New nodes connect to bootstrap nodes first. Bootstrap nodes are operated by the OBJECTS Foundation but have no special protocol privileges.

### Gossip

After bootstrapping, nodes join a discovery topic to learn about additional peers. Nodes periodically announce their presence via signed messages, allowing the network to grow organically.

## Security

### Authentication

All connections are authenticated via the QUIC handshake. A node cannot impersonate another node's public key.

### Encryption

All traffic is encrypted end-to-end using TLS 1.3. Connection contents are not visible to relays or network observers.

### Relay Trust

Relays assist with NAT traversal but cannot read message contents. They can observe connection metadata (which nodes are communicating, timing, volume) but not payload data.

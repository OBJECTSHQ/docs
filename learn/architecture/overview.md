# Overview

This section contains the high level parts of OBJECTS architecture. It will be an open-source, interoperable, and decentralized protocol and network for developing design & maker apps.

OBJECTS focuses on supporting text, images, CAD models, and other digital intellectual property metadata managed during the design, engineering, and manufacturing process of physical goods. By building a shared data layer for 3D CAD, we enable designers, developers, and organizations to own, manage, and profit from the intellectual property created during the design and manufacturing process.

## Architecture diagram

![OBJECTS Architecture Diagram](/images/objects-architecture.jpg)

## Offchain

Operations executed offchain for optimizing performance and cost.

- Liking and sharing projects
- Following other users
- Updating profile photo
- Non milestone/uncommitted/private changes to project (image uploads, folder names, CAD file updates, etc)
- OBJName changes (.obj.id) facilitated by [ERC-3668](https://eips.ethereum.org/EIPS/eip-3668) and [ENSIP-16](https://docs.ens.domains/ens-improvement-proposals/ensip-16-offchain-metadata)

## Onchain

Smart contracts executed onchain for optimizing security and consistency. Use of onchain actions is at a minimum to reduce costs and improve performance.

- **ID Registry** - creates new accounts
- **Storage Registry** - rents storage to accounts
- **Key Registry** - adds and removes app keys from accounts
- **Intellectual Property (IP) Registry** - adds new projects to accounts
### ID Registry

- Create and transfer user ID account
- Create and transfer fabrication device ID account

### Storage Registry

- Rent storage priced in fiat and paid in Ethereum (or ETH on-ramps)

## Key Registry

- Issue keys to apps to publish on their behalf
- Revoke keys from apps to publish on their behalf

### IP Registry

- Manage modules for licensing, royalties, and disputes (facilitated by [ERC-6551](https://eips.ethereum.org/EIPS/eip-6551), can be enabled by [Story Protocol](https://www.storyprotocol.xyz), [ERC-7579](https://eips.ethereum.org/EIPS/eip-7579) improves upon with module interop)
- Manage committed milestone changes to public projects and overall version history

## OBJECTS Hub

L3 chain to facilitate offchain, ultra low cost and performant operations. No token.
# Security Policy

VTX takes security seriously. This document explains how to report vulnerabilities responsibly.

---

## Supported Versions

Only the latest hosted version of the VTX script located at:

https://scripts.vtxgames.co.uk/vtx.js

is supported and maintained.

Older versions, self-hosted copies, or modified versions are not supported.

---

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

Do NOT open a public GitHub issue for security vulnerabilities.

Instead, contact the project owner directly with:

- A detailed description of the issue
- Steps to reproduce
- Potential impact
- Proof of concept (if applicable)

Provide enough detail to allow reproduction and verification.

---

## Responsible Disclosure

Please allow reasonable time for the issue to be investigated and resolved before any public disclosure.

VTX appreciates responsible disclosure that helps improve the security and reliability of the platform.

---

## Scope

The following are in scope:

- Data isolation vulnerabilities
- Unauthorized data access
- Authentication bypass (if applicable)
- Rate limit bypass
- Infrastructure abuse vectors
- WebSocket security issues

The following are out of scope:

- Issues caused by misuse of the API
- Vulnerabilities in third-party services
- Client-side code manipulation
- Social engineering attacks

---

## Security Best Practices for Users

VTX is designed for non-sensitive application and game data.

Developers should:

- Avoid storing secrets or credentials
- Avoid storing regulated data
- Use HTTPS
- Validate user input client-side
- Implement anti-cheat mechanisms for competitive games

---

## Disclaimer

VTX is provided as-is. While reasonable efforts are made to maintain secure infrastructure, no guarantees are made regarding uninterrupted or error-free operation.

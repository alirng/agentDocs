# Security Policy

agentDocs treats source Markdown as untrusted input.

## Reporting

Please report security issues privately to the repository owner before opening a public issue.

## Scope

Security-sensitive areas include:

- HTML escaping and sanitization
- artifact iframe sandboxing
- artifact `postMessage` handling
- CLI file reads/writes
- generated self-contained HTML

## Artifact Security

Artifacts are the only source area where JavaScript is allowed. Renderers must sandbox artifacts and must not grant `allow-same-origin` by default.

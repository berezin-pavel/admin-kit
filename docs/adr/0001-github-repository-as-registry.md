---
status: accepted
---

# The registry is served from a public GitHub repository, not from hosting

shadcn can read a registry straight from a public repository: `add berezin-pavel/admin-kit/admin-shell` looks for `registry.json` at the root and takes the sources as-is — no build, no server, no tokens. We picked this route over hosting our own JSON because it removes all the infrastructure and, as a bonus, hands off versioning to someone else's hands: the consumer pins to a tag via `#v1.0.0` and updates whenever they decide to.

## Consequences

The repository's public visibility stops being a matter of taste and becomes a condition for the mechanism to work: private repositories and GitHub Enterprise addresses of this kind aren't supported. As soon as admin-kit needs something closed, the registry will have to move to a namespace with `headers: {"Authorization": "Bearer ${REGISTRY_TOKEN}"}` and its own hosting — and that will touch every consumer's `components.json` at once.

The showcase loses half its purpose from this decision: it doesn't handle distribution, and stays living documentation.

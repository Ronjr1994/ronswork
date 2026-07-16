# Reusable Component Patterns

## Outcome-led case card

Required fields:

- Project name
- Public build or concept label
- One-sentence summary
- Challenge
- Outcome
- Link or disclosure

Avoid numerical performance claims unless documented.

## Guided project brief

Required sequence:

1. Service category
2. Current gap
3. Desired outcome
4. Existing tools and volume
5. Timeline and engagement type
6. Contact details
7. Sensitive-data confirmation
8. Generated summary

Fallbacks:

- Copy brief
- Compose email
- Optional secure endpoint through `site-config.js`

## Guided assistant

The current assistant is deterministic and browser-based.

It should:

- identify likely service intent;
- explain process and scope;
- route to the guided brief;
- avoid medical, legal, or compliance advice;
- state that messages are not automatically sent.

## Trust strip

Use only facts that can be checked in the project:

- number of public builds;
- number of feedback entries;
- number of tools displayed;
- human review before handoff.

## Built-with attribution

Use **Built with**, not **Powered by**, unless the live experience actually calls those tools at runtime.

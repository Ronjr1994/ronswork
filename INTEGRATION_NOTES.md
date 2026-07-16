# Secure Intake Integration Notes

The public V26 build is safe to publish with `intakeEndpoint` left blank. The primary action composes an email and nothing is submitted automatically.

## Enabling direct delivery later

1. Create a secure HTTPS endpoint using a trusted serverless provider or your own backend.
2. Keep all service credentials and API keys on the server.
3. Validate and sanitize every submitted field.
4. Add rate limiting, spam protection, request-size limits, structured logging, and error handling.
5. Do not accept file uploads or protected health information through the public portfolio.
6. Send a confirmation response only after the brief has been accepted successfully.
7. Test the endpoint before adding its URL to `site-config.js`.

## Expected request body

```json
{
  "subject": "Project inquiry — Workflow automation",
  "submittedAt": "ISO-8601 timestamp",
  "source": "Current portfolio URL",
  "openedFrom": "header | contact | assistant",
  "data": {
    "service": "automation",
    "problem": "Client-provided text",
    "outcome": "Client-provided text",
    "tools": "Client-provided text",
    "volume": "Client-provided text",
    "timeline": "Client-provided selection",
    "scope": "Client-provided selection",
    "clientName": "Client-provided name",
    "clientEmail": "Client-provided email",
    "company": "Optional",
    "safeData": "confirmed"
  },
  "summary": "Generated project brief"
}
```

## Minimum server response

Return an HTTP `2xx` status for accepted submissions. Return a non-`2xx` status for validation, rate-limit, spam, or server failures. The interface will fall back to an email draft when direct delivery fails.

## Security rules

- Never expose an API key in `site-config.js`, HTML, CSS, or browser JavaScript.
- Reject fields containing secrets or protected information where practical.
- Use strict CORS and allow only the deployed portfolio origin.
- Store the minimum amount of lead information needed for follow-up.
- Define and publish a retention policy before storing submissions.

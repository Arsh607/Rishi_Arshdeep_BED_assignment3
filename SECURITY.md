# Security Configuration

This document explains the custom Helmet.js and CORS configuration used in this Events API. 
The API is a JSON-only backend that exposes health and event endpoints, so the security settings 
were chosen for an API use case rather than a browser-rendered website.

---

## Helmet.js Configuration

### Configuration Applied

```ts
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "no-referrer" },
    hsts:
      process.env.NODE_ENV === "production"
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
  })
);

## Justification:
1. contentSecurityPolicy: false
Content Security Policy helps protect browser-rendered pages from attacks such as XSS by controlling which resources a page can load. 
This API returns JSON responses and does not render HTML pages, so CSP is not a primary control for this application. For that reason, 
it was disabled to avoid adding a browser-page policy that is not needed for this API.

2. crossOriginEmbedderPolicy: false
Cross-Origin Embedder Policy is mainly relevant when web applications load or isolate browser resources across origins. 
Since this project is a backend API and does not embed browser resources such as scripts, media, or documents, 
disabling this setting avoids unnecessary restrictions that do not add meaningful value in this API-only context.

3. frameguard: { action: "deny" }
This sets the X-Frame-Options header to deny framing. That helps defend against clickjacking by preventing the API from being 
embedded in a frame or iframe on another site. Even though this API is not intended for visual embedding, denying framing is a reasonable hardening step.

4. referrerPolicy: { policy: "no-referrer" }
This prevents the browser from sending referrer information in outgoing requests. That reduces unnecessary exposure of URL information and supports privacy 
by limiting what browsing context data is shared.

5. hsts
HSTS was enabled only in production. The Strict-Transport-Security header tells browsers to use HTTPS for future requests to the host, which helps prevent 
protocol downgrade attacks and insecure access after the first secure visit. It is disabled in development because local development typically runs over plain HTTP, 
where HSTS would be inappropriate. The one-year maxAge value is a common strong production setting.

# Why this Helmet configuration fits this API?
This application is an Express/TypeScript JSON API for event management, not a traditional server-rendered web app. Because of that, the configuration focuses on practical API hardening: deny framing, reduce referrer leakage, and enforce HTTPS in production, while avoiding browser-page-specific controls that do not meaningfully help a JSON-only API.

## Helmet.js Sources
Helmet.js Official Documentation
MDN Web Docs: X-Frame-Options
MDN Web Docs: Strict-Transport-Security
MDN Web Docs: Referrer-Policy
OWASP Secure Headers Project
OWASP Clickjacking Defense Cheat Sheet

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## CORS Configuration

### Configuration applied

```ts
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    optionsSuccessStatus: 204,
  })
);

## Justification

1. origin
CORS exists to let a server specify which origins the browser may allow to access a resource. This API restricts access to a known frontend origin instead of allowing all origins with *. 
That is more appropriate for a controlled application because it reduces unnecessary exposure of the API to arbitrary browser clients.

2. methods
The allowed methods were limited to GET, POST, PUT, DELETE, and OPTIONS because they match the actual API routes used by the application. Restricting methods makes the policy clearer 
and avoids advertising unnecessary request types to browsers during preflight handling.

3. allowedHeaders
The allowed headers were limited to Content-Type and Authorization. Content-Type is needed for JSON requests, and Authorization is a standard header to allow if token-based authentication 
is added or used. Restricting allowed headers is better than allowing any header because it narrows the cross-origin surface to what the API expects. OWASP also notes that custom headers 
participate in browser-enforced protections and are relevant in cross-origin request handling.

4. credentials: false
Credentials were disabled because this API does not use browser cookies or session-based authentication. When credentials are not needed, leaving them off keeps the policy simpler and 
avoids the additional security considerations that come with credentialed cross-origin requests.

5. optionsSuccessStatus: 204
Browsers may send a preflight OPTIONS request before certain cross-origin requests. Returning a clean success status for preflight requests helps make the CORS policy explicit and 
easier to verify during testing in Postman or browser developer tools.

#Why this CORS configuration fits this API?
This API is designed to be consumed by a specific frontend during development rather than by any website on the internet. Restricting the origin, methods, and request headers 
reflects the actual use of the API and supports the principle of least privilege for browser-based access.

## CORS Sources
MDN Web Docs: Cross-Origin Resource Sharing (CORS)
OWASP Web Security Testing Guide: Testing Cross Origin Resource Sharing
OWASP CSRF Prevention Cheat Sheet
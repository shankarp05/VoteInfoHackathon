// routes/findRepresentativeRedirect.ts
export function handler(req: Request): Response {
    const url = new URL(req.url); // Get the base URL from the request
    const redirectUrl = `${url.origin}/findRepresentative`; // Construct the absolute URL
    return Response.redirect(redirectUrl, 307); // Perform the redirect
  }
  
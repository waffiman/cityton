# SEO Fix for city-ton.at Domain

## Problem
Google indexed `city-ton.at` with the placeholder text "City-Ton Austria - site.titleTagline" instead of the actual title.

## Solution Implemented

### 1. **Domain Redirect in Proxy** (`src/proxy.ts`)
Updated the proxy function (Next.js 16's replacement for middleware) to perform a **permanent 301 redirect** from `city-ton.at` to `city-ton.com`. This:
- Transfers SEO value from .at to .com
- Tells search engines that city-ton.com is the canonical domain
- Preserves the full URL path and query parameters
- Works at the application level before any page rendering

### 2. **Updated robots.txt** (`src/app/robots.ts`)
Added the `host` field to explicitly declare city-ton.com as the canonical domain for search engines.

### 3. **Updated Environment Example** (`.env.example`)
Changed the default `NEXT_PUBLIC_SITE_URL` from city-ton.at to city-ton.com.

## Required Actions for Production

### 1. **Update Production Environment Variables**
In your hosting platform (Vercel, etc.), ensure:

```bash
NEXT_PUBLIC_SITE_URL=https://city-ton.com
```

This is **critical** - the middleware redirect and all metadata generation depend on this.

### 2. **Deploy the Changes**
Deploy this updated code to production. The middleware will start redirecting immediately.

### 3. **Verify the Redirect**
Test that the redirect is working:
```bash
curl -I https://city-ton.at
```

You should see:
```
HTTP/1.1 301 Moved Permanently
Location: https://city-ton.com/
```

### 4. **Request Google Re-indexing**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add both domains (city-ton.at and city-ton.com) if not already added
3. Request re-indexing of key pages from city-ton.at
4. Google will discover the 301 redirect and update its index

### 5. **Monitor the Transition**
- Check Search Console to see when Google processes the redirect
- The old .at listings should gradually disappear and be replaced with .com
- This can take a few days to several weeks depending on crawl frequency

## Technical Details

### How the Redirect Works
```typescript
// src/proxy.ts
export default function proxy(request: NextRequest) {
  const { hostname } = request.nextUrl;

  // Permanent redirect from city-ton.at to city-ton.com
  if (hostname === "city-ton.at" || hostname === "www.city-ton.at") {
    const url = new URL(request.url);
    url.hostname = "city-ton.com";
    return NextResponse.redirect(url, { status: 301 }); // Permanent redirect
  }
  // ... rest of proxy logic
}
```

### SEO Implications
- **301 redirect**: Tells search engines the move is permanent
- **SEO value transfer**: All rankings and link equity from .at will transfer to .com
- **Canonical domain**: robots.txt and sitemap now declare city-ton.com as canonical
- **No duplicate content**: Google will treat .at and .com as the same site

## DNS/Hosting Configuration (Optional)

While the application-level redirect is now in place, you can also add a DNS-level redirect for even faster performance:

### Vercel
1. Go to Project Settings → Domains
2. Ensure `city-ton.at` is added as a redirect to `city-ton.com`
3. Set redirect type to **Permanent (301)**

### Other Hosting Providers
Configure your DNS/CDN to redirect city-ton.at → city-ton.com at the edge.

## Verification Checklist

- [ ] Production environment has `NEXT_PUBLIC_SITE_URL=https://city-ton.com`
- [ ] Code is deployed to production
- [ ] Redirect is working (test with curl or browser)
- [ ] Google Search Console is configured for both domains
- [ ] Re-indexing requested in Search Console
- [ ] Monitoring search results for the update

## Questions?

The fix is complete in the code. The remaining steps are deployment and search engine communication, which typically takes a few days to take effect.

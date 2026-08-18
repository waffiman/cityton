/**
 * Best-effort sanitizer for admin-authored blog HTML (Tiptap StarterKit output).
 * Only the authenticated admin can create posts, so this is defense-in-depth:
 * strip script/style/iframe/object tags, inline event handlers, and
 * javascript: URLs before rendering the stored HTML.
 */
export function sanitizeHtml(html: string): string {
  return (
    html
      // Drop dangerous elements entirely (with their content).
      .replace(/<\s*(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
      // Drop self-closing / unclosed dangerous tags.
      .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[^>]*>/gi, "")
      // Strip inline event handlers: on*="..." / on*='...'
      .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
      .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
      .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
      // Neutralize javascript: and data: URLs in href/src.
      .replace(/(href|src)\s*=\s*"(?:\s*javascript:|\s*data:)[^"]*"/gi, '$1="#"')
      .replace(/(href|src)\s*=\s*'(?:\s*javascript:|\s*data:)[^']*'/gi, "$1='#'")
  );
}

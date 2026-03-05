import DOMPurify from 'dompurify'

// Configure DOMPurify to allow safe HTML elements and attributes
const purifyConfig = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'strong', 'em', 'b', 'i', 'u', 's',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'span', 'div', 'figure', 'figcaption'
  ],
  ALLOWED_ATTR: [
    'class', 'href', 'src', 'alt', 'title', 'target', 'rel', 'loading'
  ],
  ALLOW_DATA_ATTR: false,
}

// Simple markdown parser with XSS protection
export const parseMarkdown = (markdown: string): string => {
  let html = markdown

  // Images FIRST (before links, since ![...] would match [...])
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    const safeSrc = sanitizeUrl(src)
    const safeAlt = escapeHtml(alt)
    return `<figure class="blog-image-figure"><img src="${safeSrc}" alt="${safeAlt}" class="blog-content-image" loading="lazy" />${safeAlt ? `<figcaption class="blog-image-caption">${safeAlt}</figcaption>` : ''}</figure>`
  })

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="blog-h3">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="blog-h2">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="blog-h1">$1</h1>')

  // Bold and Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="blog-hr" />')

  // Code blocks - escape content first
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="blog-code-block"><code class="blog-code">${escapeHtml(code.trim())}</code></pre>`
  })

  // Inline code - escape content
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    return `<code class="blog-inline-code">${escapeHtml(code)}</code>`
  })

  // Links - sanitize href
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const safeUrl = sanitizeUrl(url)
    const safeText = escapeHtml(text)
    return `<a href="${safeUrl}" class="blog-link" target="_blank" rel="noopener noreferrer">${safeText}</a>`
  })

  // Unordered Lists
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  
  // Ordered Lists
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')

  // Wrap consecutive list items
  html = html.replace(/(<li>.*<\/li>\s*)+/gs, (match) => {
    return `<ul class="blog-list">${match}</ul>`
  })

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="blog-blockquote">$1</blockquote>')

  // Paragraphs - lines that don't start with HTML tags
  html = html.replace(/^(?!<[hublpfio])(.*\S.*)$/gm, '<p class="blog-paragraph">$1</p>')

  // Clean up: convert remaining newlines to nothing (not <br>), paragraphs handle spacing
  html = html.replace(/\n{2,}/g, '')
  html = html.replace(/\n/g, '')

  // Clean up empty paragraphs
  html = html.replace(/<p class="blog-paragraph"><\/p>/g, '')
  html = html.replace(/<p class="blog-paragraph"><br><\/p>/g, '')

  // CRITICAL: Sanitize the final HTML output to prevent XSS
  return DOMPurify.sanitize(html, purifyConfig)
}

// Escape HTML entities to prevent injection
const escapeHtml = (text: string): string => {
  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char)
}

// Sanitize URLs to prevent javascript: and data: URLs
const sanitizeUrl = (url: string): string => {
  const trimmedUrl = url.trim().toLowerCase()
  
  if (
    trimmedUrl.startsWith('javascript:') ||
    trimmedUrl.startsWith('data:') ||
    trimmedUrl.startsWith('vbscript:')
  ) {
    return '#'
  }
  
  if (
    trimmedUrl.startsWith('http://') ||
    trimmedUrl.startsWith('https://') ||
    trimmedUrl.startsWith('mailto:') ||
    trimmedUrl.startsWith('tel:') ||
    trimmedUrl.startsWith('/') ||
    trimmedUrl.startsWith('#') ||
    !trimmedUrl.includes(':')
  ) {
    return url
  }
  
  return '#'
}

// Simple syntax highlighting for common languages
export const highlightCode = (code: string, language: string): string => {
  const keywords: { [key: string]: string[] } = {
    javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
    typescript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'interface', 'type'],
    python: ['def', 'class', 'if', 'else', 'for', 'while', 'return', 'import', 'from', 'try', 'except'],
    css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position'],
    html: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'body', 'head', 'html', 'script', 'style']
  }

  let highlighted = escapeHtml(code)

  if (keywords[language]) {
    keywords[language].forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      highlighted = highlighted.replace(regex, `<span class="text-emerald-400 font-semibold">${keyword}</span>`)
    })
  }

  highlighted = highlighted.replace(/(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-teal-400">$1$2$3</span>')
  highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>')

  return DOMPurify.sanitize(highlighted, purifyConfig)
}

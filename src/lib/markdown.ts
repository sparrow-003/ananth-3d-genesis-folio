import DOMPurify from 'dompurify'

// Configure DOMPurify to allow safe HTML elements and attributes
const purifyConfig = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'strong', 'em', 'b', 'i', 'u', 's', 'del',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'span', 'div', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'sup', 'sub', 'mark', 'input', 'label'
  ],
  ALLOWED_ATTR: [
    'class', 'href', 'src', 'alt', 'title', 'target', 'rel', 'loading',
    'colspan', 'rowspan', 'style', 'type', 'checked', 'disabled'
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

  // Tables (must be before paragraphs)
  html = html.replace(/^(\|.+\|)\n(\|[\s:|-]+\|)\n((?:\|.+\|\n?)+)/gm, (match, headerRow, separatorRow, bodyRows) => {
    const headers = headerRow.split('|').filter((c: string) => c.trim() !== '').map((c: string) => c.trim())
    
    const alignments = separatorRow.split('|').filter((c: string) => c.trim() !== '').map((c: string) => {
      const cell = c.trim()
      if (cell.startsWith(':') && cell.endsWith(':')) return 'center'
      if (cell.endsWith(':')) return 'right'
      return 'left'
    })
    
    const rows = bodyRows.trim().split('\n').map((row: string) => 
      row.split('|').filter((c: string) => c.trim() !== '').map((c: string) => c.trim())
    )
    
    let tableHtml = '<div class="blog-table-wrapper"><table class="blog-table"><thead><tr>'
    headers.forEach((h: string, i: number) => {
      tableHtml += `<th style="text-align:${alignments[i] || 'left'}">${parseInline(h)}</th>`
    })
    tableHtml += '</tr></thead><tbody>'
    rows.forEach((row: string[]) => {
      tableHtml += '<tr>'
      row.forEach((cell: string, i: number) => {
        tableHtml += `<td style="text-align:${alignments[i] || 'left'}">${parseInline(cell)}</td>`
      })
      tableHtml += '</tr>'
    })
    tableHtml += '</tbody></table></div>'
    return tableHtml
  })

  // Diagram blocks (```mermaid, ```diagram, ```ascii, ```chart, ```flow)
  html = html.replace(/```(mermaid|diagram|ascii|chart|flow|plantuml)\n([\s\S]*?)```/g, (match, type, content) => {
    const label = `<div class="blog-diagram-label">${escapeHtml(type)}</div>`
    return `<div class="blog-code-wrapper" style="position:relative">${label}<div class="blog-diagram">${escapeHtml(content.trim())}</div></div>`
  })

  // Headers
  html = html.replace(/^#### (.*$)/gim, '<h4 class="blog-h4">$1</h4>')
  html = html.replace(/^### (.*$)/gim, '<h3 class="blog-h3">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="blog-h2">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="blog-h1">$1</h1>')

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="blog-hr" />')

  // Code blocks with language label
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const langLabel = lang ? `<div class="blog-code-lang">${escapeHtml(lang.toUpperCase())}</div>` : ''
    return `<div class="blog-code-wrapper">${langLabel}<pre class="blog-code-block"><code class="blog-code">${escapeHtml(code.trim())}</code></pre></div>`
  })

  // Inline code - escape content
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    return `<code class="blog-inline-code">${escapeHtml(code)}</code>`
  })

  // Bold and Italic (must be after code blocks)
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')

  // Highlight ==text==
  html = html.replace(/==(.*?)==/g, '<mark>$1</mark>')

  // Superscript ^text^
  html = html.replace(/\^(.*?)\^/g, '<sup>$1</sup>')

  // Links - sanitize href
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const safeUrl = sanitizeUrl(url)
    return `<a href="${safeUrl}" class="blog-link" target="_blank" rel="noopener noreferrer">${text}</a>`
  })

  // Checklist items - [ ] and [x]
  html = html.replace(/^- \[x\] (.+)$/gm, '<li class="checklist-item"><span class="blog-check checked">✓</span> $1</li>')
  html = html.replace(/^- \[ \] (.+)$/gm, '<li class="checklist-item"><span class="blog-check"></span> $1</li>')

  // Unordered Lists (after checklists)
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  
  // Ordered Lists
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')

  // Wrap consecutive checklist items
  html = html.replace(/(<li class="checklist-item">.*?<\/li>\s*)+/gs, (match) => {
    return `<ul class="blog-checklist">${match}</ul>`
  })

  // Wrap consecutive regular list items
  html = html.replace(/(<li>(?:(?!class="checklist-item").).*?<\/li>\s*)+/gs, (match) => {
    return `<ul class="blog-list">${match}</ul>`
  })

  // Blockquotes (multi-line support)
  html = html.replace(/^> (.+)$/gm, '<blockquote class="blog-blockquote">$1</blockquote>')
  // Merge adjacent blockquotes
  html = html.replace(/<\/blockquote>\s*<blockquote class="blog-blockquote">/g, '<br>')

  // Paragraphs - lines that don't start with HTML tags
  html = html.replace(/^(?!<[hublpfidto]|<mark|<\/)(.*\S.*)$/gm, '<p class="blog-paragraph">$1</p>')

  // Clean up newlines
  html = html.replace(/\n{2,}/g, '')
  html = html.replace(/\n/g, '')

  // Clean up empty paragraphs
  html = html.replace(/<p class="blog-paragraph"><\/p>/g, '')
  html = html.replace(/<p class="blog-paragraph"><br><\/p>/g, '')

  // CRITICAL: Sanitize the final HTML output to prevent XSS
  return DOMPurify.sanitize(html, purifyConfig)
}

// Parse inline markdown (for table cells etc.)
const parseInline = (text: string): string => {
  let result = escapeHtml(text)
  result = result.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>')
  result = result.replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>')
  result = result.replace(/~~(.*?)~~/g, '<del>$1</del>')
  result = result.replace(/==(.*?)==/g, '<mark>$1</mark>')
  return result
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
    javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await', 'try', 'catch'],
    typescript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'interface', 'type', 'async', 'await', 'try', 'catch'],
    python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'try', 'except', 'with', 'as', 'lambda', 'yield'],
    css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'flex', 'grid'],
    html: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'body', 'head', 'html', 'script', 'style', 'section', 'article'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'JOIN', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'TABLE', 'INDEX'],
    java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'void', 'int', 'String', 'return', 'new', 'static', 'final'],
    rust: ['fn', 'let', 'mut', 'pub', 'struct', 'impl', 'enum', 'match', 'if', 'else', 'for', 'while', 'return', 'use', 'mod'],
  }

  let highlighted = escapeHtml(code)

  if (keywords[language]) {
    keywords[language].forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      highlighted = highlighted.replace(regex, `<span style="color: hsl(var(--primary)); font-weight: 600;">${keyword}</span>`)
    })
  }

  highlighted = highlighted.replace(/(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color: hsl(199, 89%, 60%);">$1$2$3</span>')
  highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span style="color: hsl(var(--muted-foreground)); font-style: italic;">$1</span>')
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: hsl(var(--muted-foreground)); font-style: italic;">$1</span>')

  return DOMPurify.sanitize(highlighted, purifyConfig)
}

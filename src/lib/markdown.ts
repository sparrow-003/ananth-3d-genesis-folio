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

  // Store code blocks and diagrams to protect them from other transformations
  const codeBlocks: { lang: string; code: string }[] = []
  const diagramBlocks: { type: string; content: string }[] = []
  
  // Extract diagram blocks first (mermaid, diagram, ascii, chart, flow, plantuml)
  html = html.replace(/```(mermaid|diagram|ascii|chart|flow|plantuml)\n([\s\S]*?)```/g, (match, type, content) => {
    const index = diagramBlocks.length
    diagramBlocks.push({ type, content: content.trim() })
    return `___DIAGRAM_${index}___`
  })

  // Extract code blocks with language
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const index = codeBlocks.length
    codeBlocks.push({ lang, code: code.trim() })
    return `___CODE_${index}___`
  })

  // Tables (must be before paragraphs)
  html = html.replace(/^\|(.+)\|\n^\|([\s:|-]+)\|\n((?:^\|.+\|\n?)+)/gm, (match, headerRow, separatorRow, bodyRows) => {
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

  // Headers (process from h6 to h1 to avoid conflicts)
  html = html.replace(/^###### (.*$)/gim, '<h4 class="blog-h4">$1</h4>')
  html = html.replace(/^##### (.*$)/gim, '<h4 class="blog-h4">$1</h4>')
  html = html.replace(/^#### (.*$)/gim, '<h4 class="blog-h4">$1</h4>')
  html = html.replace(/^### (.*$)/gim, '<h3 class="blog-h3">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="blog-h2">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="blog-h1">$1</h1>')

  // Horizontal rule
  html = html.replace(/^\s*---\s*$/gm, '<hr class="blog-hr" />')
  html = html.replace(/^\s*\*\*\*\s*$/gm, '<hr class="blog-hr" />')
  html = html.replace(/^\s*___\s*$/gm, '<hr class="blog-hr" />')

  // Inline code (protect from other transformations)
  const inlineCodes: string[] = []
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const index = inlineCodes.length
    inlineCodes.push(code)
    return `___INLINE_CODE_${index}___`
  })

  // Bold and Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/___(.*?)___/g, '<strong><em>$1</em></strong>')

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

  // Images (already processed, but handle any remaining)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    const safeSrc = sanitizeUrl(src)
    const safeAlt = escapeHtml(alt)
    return `<figure class="blog-image-figure"><img src="${safeSrc}" alt="${safeAlt}" class="blog-content-image" loading="lazy" />${safeAlt ? `<figcaption class="blog-image-caption">${safeAlt}</figcaption>` : ''}</figure>`
  })

  // Checklist items - [ ] and [x]
  html = html.replace(/^- \[x\] (.+)$/gm, '<li class="checklist-item"><span class="blog-check checked">✓</span> $1</li>')
  html = html.replace(/^- \[ \] (.+)$/gm, '<li class="checklist-item"><span class="blog-check"></span> $1</li>')

  // Unordered lists
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')

  // Ordered lists
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')

  // Wrap consecutive checklist items
  html = html.replace(/(<li class="checklist-item">.*?<\/li>\s*)+/gs, (match) => {
    return `<ul class="blog-checklist">${match}</ul>`
  })

  // Wrap consecutive regular list items (not already in a list)
  html = html.replace(/(?<!<\/ul>)((?:<li>(?:(?!class="checklist-item").).*?<\/li>\s*)+)(?!<\/ul>)/gs, (match) => {
    return `<ul class="blog-list">${match}</ul>`
  })

  // Blockquotes (merge adjacent ones)
  html = html.replace(/^> (.+)$/gm, '<blockquote class="blog-blockquote">$1</blockquote>')
  html = html.replace(/<\/blockquote>\n<blockquote class="blog-blockquote">/g, '<br>')

  // Paragraphs - only for lines that aren't already HTML
  html = html.replace(/^(?!<[hublpfidto]|<mark|<figure|<div|<\/)([^\s<].*[^\s<]|[^\s<])$/gm, '<p class="blog-paragraph">$1</p>')

  // Restore inline codes
  inlineCodes.forEach((code, index) => {
    html = html.replace(`___INLINE_CODE_${index}___`, `<code class="blog-inline-code">${escapeHtml(code)}</code>`)
  })

  // Restore code blocks with language label
  codeBlocks.forEach((block, index) => {
    const langLabel = block.lang ? `<div class="blog-code-lang">${escapeHtml(block.lang.toUpperCase())}</div>` : ''
    const highlighted = highlightCode(block.code, block.lang || 'plaintext')
    html = html.replace(`___CODE_${index}___`, `<div class="blog-code-wrapper">${langLabel}<pre class="blog-code-block"><code class="blog-code">${highlighted}</code></pre></div>`)
  })

  // Restore diagram blocks
  diagramBlocks.forEach((block, index) => {
    const label = `<div class="blog-diagram-label">${escapeHtml(block.type)}</div>`
    html = html.replace(`___DIAGRAM_${index}___`, `<div class="blog-diagram-wrapper" style="position:relative">${label}<div class="blog-diagram">${escapeHtml(block.content)}</div></div>`)
  })

  // Clean up excessive newlines and empty paragraphs
  html = html.replace(/\n{3,}/g, '\n\n')
  html = html.replace(/<p class="blog-paragraph">\s*<\/p>/g, '')
  html = html.replace(/<p class="blog-paragraph"><br\s*\/?><\/p>/g, '')

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

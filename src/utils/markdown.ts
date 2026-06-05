/**
 * 轻量 Markdown → HTML 渲染器
 * 仅覆盖企业知识问答场景常用的格式：标题、粗体、斜体、行内代码、代码块、表格、列表、引用、链接
 */

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function renderMarkdown(src: string): string {
  if (!src) return ''

  // 先提取代码块，避免内部被行内规则误转
  const codeBlocks: string[] = []
  let text = src.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    const idx = codeBlocks.length
    codeBlocks.push(
      `<pre class="md-code-block"><code class="lang-${escapeHtml(lang || 'text')}">${escapeHtml(code.trim())}</code></pre>`
    )
    return `\x00CB${idx}\x00`
  })

  // 表格
  text = text.replace(/^(\|.+\|)\n(\|[\s:-]+\|)\n((?:\|.+\|\n?)*)/gm, (_m, headerRow, _sep, bodyRows) => {
    const heads = (headerRow as string).split('|').filter(Boolean).map((c) => `<th>${c.trim()}</th>`).join('')
    const rows = (bodyRows as string)
      .trim()
      .split('\n')
      .map((r) => {
        const cells = r.split('|').filter(Boolean).map((c) => `<td>${c.trim()}</td>`).join('')
        return `<tr>${cells}</tr>`
      })
      .join('')
    return `<table class="md-table"><thead><tr>${heads}</tr></thead><tbody>${rows}</tbody></table>`
  })

  // 块引用
  text = text.replace(/^> (.+)$/gm, '<blockquote class="md-quote">$1</blockquote>')

  // 有序列表
  text = text.replace(/^(\d+\. .+(?:\n\d+\. .+)*)/gm, (block) => {
    const items = block.split('\n').map((l) => `<li>${l.replace(/^\d+\.\s/, '')}</li>`).join('')
    return `<ol class="md-ol">${items}</ol>`
  })

  // 无序列表
  text = text.replace(/^(- .+(?:\n- .+)*)/gm, (block) => {
    const items = block.split('\n').map((l) => `<li>${l.replace(/^- /, '')}</li>`).join('')
    return `<ul class="md-ul">${items}</ul>`
  })

  // 标题
  text = text.replace(/^### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
  text = text.replace(/^## (.+)$/gm, '<h3 class="md-h3">$1</h3>')
  text = text.replace(/^# (.+)$/gm, '<h2 class="md-h2">$1</h2>')

  // 行内格式
  text = text.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // 链接
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="md-link" href="$2" target="_blank" rel="noopener">$1</a>')

  // 还原代码块
  text = text.replace(/\x00CB(\d+)\x00/g, (_m, idx) => codeBlocks[Number(idx)])

  // 段落：连续非空、非块级标签的行合并为 <p>
  text = text
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (/^<(pre|table|ol|ul|blockquote|h[1-6]|div)/.test(trimmed)) return trimmed
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`
    })
    .join('\n')

  return text
}

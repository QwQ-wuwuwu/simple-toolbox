/**
 * 复制文本到剪贴板，兼容非 HTTPS 环境
 * @param {string} text - 要复制的文本
 * @returns {Promise<void>}
 */
export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  return new Promise((resolve) => {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    resolve()
  })
}

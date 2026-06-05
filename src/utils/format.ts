export function formatPercent(value: number) {
  return `${value}%`
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value)
}

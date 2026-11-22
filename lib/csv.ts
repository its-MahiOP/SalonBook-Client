function escapeCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value)
  // Quote cells that contain commas, quotes or new lines, and double any quotes.
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function toCsv(rows: unknown[][]) {
  return rows.map((row) => row.map(escapeCell).join(",")).join("\r\n")
}

export function downloadCsv(filename: string, rows: unknown[][]) {
  // Prefix with a BOM so Excel reads UTF-8 names and currency symbols correctly.
  const blob = new Blob([`\uFEFF${toCsv(rows)}`], {
    type: "text/csv;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

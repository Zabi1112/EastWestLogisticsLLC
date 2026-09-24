export function parseCsvTable(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  const [header, ...dataRows] = rows.filter((r) => r.some((cell) => cell.trim() !== ''))
  if (!header) return { headers: [], records: [] }

  const records = dataRows.map((cells) => {
    const record = {}
    header.forEach((key, idx) => {
      record[key.trim()] = (cells[idx] ?? '').trim()
    })
    return record
  })
  return { headers: header.map(key => key.trim()), records }
}

export function parseCsv(text) {
  return parseCsvTable(text).records
}

export function validateEarnings(data) {
  if (!data || data.version !== 1 || data.currency !== 'USD' || !Number.isFinite(Date.parse(data.generatedAt))) throw new Error('Invalid earnings feed.')
  for (const period of ['weekly', 'monthly']) {
    if (!Array.isArray(data[period])) throw new Error('Invalid periods.')
    for (const report of data[period]) {
      if (!report.id || !report.period || !report.title || !report.unit || !Array.isArray(report.rows) || !report.rows.length) throw new Error('Invalid report.')
      for (const row of report.rows) {
        if (typeof row.label !== 'string' || !Number.isFinite(row.gross) || row.gross < 0 || !Number.isSafeInteger(row.loads) || row.loads < 0) throw new Error('Invalid report values.')
      }
    }
  }
  return data
}

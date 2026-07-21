// Paste this into Extensions > Apps Script from within the "Carrier Data"
// spreadsheet, then Deploy > New deployment > Web app
// (Execute as: Me, Who has access: Anyone) and put the resulting URL in
// VITE_SHEETS_SIGNUP_URL. See ../.env.example for the full setup.

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Signups')
  var data = JSON.parse(e.postData.contents)

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.company || '',
    data.mcNumber || '',
    data.phone || '',
    data.email || '',
    data.truckType || '',
    data.homeBase || '',
    data.notes || '',
  ])

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}

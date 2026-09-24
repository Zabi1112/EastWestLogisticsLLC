// Add this as a NEW file in the spreadsheet's Apps Script project.
// Keep your existing doPost, dropdown, and timestamp functions.
// If the project already has doGet, merge this route into that function.
// Deploy as Web app: Execute as Me; Who has access: Anyone.
function doGet(e) {
  if (!e || !e.parameter || e.parameter.resource !== 'available-trucks') {
    return ContentService.createTextOutput('Unknown resource.');
  }

  // Only this public broker-facing tab and these columns are exposed.
  var columns = [
    'Truck ID', 'Company Name', 'Company MC', 'Equipment Type',
    'Empty State', 'Empty City', 'Available Date', 'Available Time',
    'Time Zone', 'Availability', 'Preferred Destination',
    'Dispatcher Name', 'Dispatcher Phone', 'Last Updated'
  ];
  var sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Available Trucks');
  if (!sheet) throw new Error('Available Trucks tab not found.');

  var values = sheet.getDataRange().getDisplayValues();
  var headers = values.shift().map(function (value) { return value.trim(); });
  var indexes = columns.map(function (name) {
    var index = headers.indexOf(name);
    if (index < 0) throw new Error('Missing column: ' + name);
    return index;
  });
  var statusIndex = headers.indexOf('Availability');
  var rows = values.filter(function (row) {
    return String(row[statusIndex]).trim().toLowerCase() === 'available';
  }).map(function (row) {
    return indexes.map(function (index) { return row[index] || ''; });
  });

  var csv = [columns].concat(rows).map(function (row) {
    return row.map(function (value) {
      return '"' + String(value).replace(/"/g, '""') + '"';
    }).join(',');
  }).join('\r\n');

  return ContentService.createTextOutput(csv)
    .setMimeType(ContentService.MimeType.CSV);
}

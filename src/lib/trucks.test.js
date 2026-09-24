import test from 'node:test'
import assert from 'node:assert/strict'
import { parseAvailableTrucks, phoneLink, displayDate } from './trucks.js'
import { parseCsv } from './csv.js'

const headers = 'Truck ID,Company Name,Company MC,Equipment Type,Empty State,Empty City,Available Date,Available Time,Time Zone,Availability,Preferred Destination,Dispatcher Name,Dispatcher Phone,Last Updated'
const row = (status = 'Available') => `EW-1,"Carrier, LLC",MC-123,Dry Van,TX,Dallas,2026-09-26,8:10 AM,America/Chicago,${status},Midwest,Ali,+12125550123,2026-09-24 12:00:00`

test('available feed preserves quoted names, identifiers and local schedule', () => {
  const trucks = parseAvailableTrucks('\uFEFF' + headers + '\r\n' + row() + '\r\n')
  assert.equal(trucks.length, 1)
  assert.equal(trucks[0].company, 'Carrier, LLC')
  assert.equal(trucks[0].mc, 'MC-123')
  assert.equal(trucks[0].date, '2026-09-26')
  assert.equal(trucks[0].zone, 'America/Chicago')
})
test('booked, unavailable, blank statuses and incomplete rows never become listings', () => {
  const csv = [headers, row('Booked'), row('Unavailable'), row(''), row(' available '), ',,,,,,,,,Available,,,,'].join('\n')
  assert.equal(parseAvailableTrucks(csv).length, 1)
})
test('a header-only sheet is an empty list, not a feed failure', () => {
  assert.deepEqual(parseAvailableTrucks(headers), [])
})
test('wrong tabs, empty bodies and HTML responses are rejected', () => {
  for (const value of ['', '<html>Sign in</html>', 'Company Name,Truck Type\nTest,Van']) {
    assert.throws(() => parseAvailableTrucks(value))
  }
})
test('shared carrier parser still handles escaped quotes and multiline fields', () => {
  assert.deepEqual(parseCsv('Company Name,Notes\n"A ""B"" LLC","Line 1\nLine 2"'), [{ 'Company Name': 'A "B" LLC', Notes: 'Line 1\nLine 2' }])
})
test('phone links allow phone numbers and reject nonphone values', () => {
  assert.equal(phoneLink('+1 (212) 555-0123'), 'tel:+12125550123')
  assert.equal(phoneLink('(484) 441-5549'), 'tel:4844415549')
  assert.equal(phoneLink(''), null)
  assert.equal(phoneLink('javascript:alert(1)'), null)
})
test('ISO sheet dates display without browser time-zone shifts', () => {
  assert.equal(displayDate('2026-09-26'), 'Sep 26, 2026')
  assert.equal(displayDate(''), 'Confirm with dispatcher')
})

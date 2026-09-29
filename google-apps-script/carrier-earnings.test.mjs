import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import fs from 'node:fs'
const context = vm.createContext({ Date, console, Utilities: { formatDate: value => value.toISOString().slice(0, 10) } })
vm.runInContext(fs.readFileSync(new URL('./carrier-earnings.gs', import.meta.url), 'utf8'), context)
test('different source date orders and invalid dates', () => {
 assert.equal(context.earningsDate_('6-17','MD',2026,'UTC'),'2026-06-17')
 assert.equal(context.earningsDate_('24-9','DM',2026,'UTC'),'2026-09-24')
 assert.equal(context.earningsDate_(new Date('2026-09-24'),'DM',2026,'UTC'),'2026-09-24')
 assert.throws(()=>context.earningsDate_('31-2','DM',2026,'UTC'))
})
test('currency cents and invalid or missing rates', () => {
 assert.equal(context.earningsCents_('$4,450.25'),445025)
 assert.equal(context.earningsCents_(1900),190000)
 assert.throws(()=>context.earningsCents_(''))
 assert.throws(()=>context.earningsCents_('TBD'))
})
test('combined totals and week/month boundaries never double count', () => {
 const result=context.aggregateCarrierEarnings_([{date:'2026-08-31',cents:10025},{date:'2026-09-01',cents:20050},{date:'2026-09-06',cents:30000},{date:'2026-09-07',cents:40000}])
 const total = reports => reports.reduce((sum,r)=>sum+r.rows.reduce((n,x)=>n+x.gross,0),0)
 assert.equal(total(result.weekly),1000.75)
 assert.equal(total(result.monthly),1000.75)
 assert.equal(result.weekly.length,2)
 assert.equal(result.monthly.length,2)
 assert.equal(result.weekly[1].rows[0].gross,100.25)
})
test('only DONE rows count; prefilled blank rows ignored; incomplete DONE fails', () => {
 const row=(date,rate,status)=>[date,rate,...Array(11).fill(''),status]
 let rows=[row('9-24',100,'DONE'),row('9-25',200,'ACTIVE'),row('','','DONE')]
 const header=['Date','Booking Rate',...Array(11).fill(''),'UPDATE STATUS']
 context.EARNINGS_SOURCES=[{id:'test',gid:0,order:'MD',year:2026}]
 context.SpreadsheetApp={openById:()=>({getSpreadsheetTimeZone:()=> 'UTC',getSheets:()=>[{getSheetId:()=>0,getLastRow:()=>rows.length+3,getRange:(start)=>({getDisplayValues:()=>start === 3 ? [header] : rows.map(row => row.map(String)),getValues:()=>rows})}]})}
 let result=context.buildCarrierEarnings()
 assert.equal(result.monthly[0].rows.reduce((n,r)=>n+r.gross,0),100)
 rows.push(row('9-26','','DONE'))
 assert.throws(()=>context.buildCarrierEarnings(),/missing date or booking rate/)
})

test('imported native dates use visible MD dates, including past-date swaps', () => {
 const cases=[['6-10','2026-10-06',2050,'2026-06'],['7-11','2026-11-07',3700,'2026-07'],['8-12','2026-12-08',6000,'2026-08'],['7-10','2026-10-07',8300,'2026-07'],['9-11','2026-11-09',5650,'2026-09'],['8-10','2026-10-08',7300,'2026-08'],['7-10','2026-10-07',100,'2026-07'],['7-10','2026-10-07',4800,'2026-07'],['6-4','2026-04-06',4450,'2026-06']]
 const rows=cases.map(([,raw,rate])=>[new Date(raw),rate,...Array(11).fill(''),'DONE'])
 const displays=rows.map((row,i)=>row.map((value,j)=>j===0?cases[i][0]:String(value)))
 const header=['Date','Booking Rate',...Array(11).fill(''),'UPDATE STATUS']
 context.EARNINGS_SOURCES=[{id:'test',gid:0,order:'MD',year:2026}]
 context.SpreadsheetApp={openById:()=>({getSpreadsheetTimeZone:()=> 'UTC',getSheets:()=>[{getSheetId:()=>0,getLastRow:()=>rows.length+3,getRange:(start)=>({getDisplayValues:()=>start===3?[header]:displays,getValues:()=>rows})}]})}
 const result=context.buildCarrierEarnings()
 const expected={}
 for(const [,,rate,month] of cases) expected[month]=(expected[month]||0)+rate
 assert.equal(result.monthly.length,4)
 for(const report of result.monthly) assert.equal(report.rows.reduce((n,r)=>n+r.gross,0),expected[report.id])
 assert.equal(context.earningsDate_('5-8','DM',2026,'UTC'),'2026-08-05')
 assert.equal(context.earningsDate_('6-10-2027','MD',2026,'UTC'),'2027-06-10')
})

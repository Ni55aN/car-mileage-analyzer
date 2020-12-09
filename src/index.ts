
import { join } from 'path'
import _ from 'lodash'
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer'
import { renderScatterPlot } from './plot'
import { Record } from './types'
import { loadPageRecords } from './providers/auto-ria'

const csvWriter = createCsvWriter({
  path: join('tmp', 'file.csv'),
  header: [
      {id: 'x', title: 'X'},
      {id: 'y', title: 'Y'}
  ]
});


function extractCoords(records: Record[]) {
  return records.map(record => ({ x: record.year, y: record.mileage }))
}

void async function() {
  let pages = []

  console.log(`
    ====
    You can open tmp/file.csv on the site https://www.csvplot.com/
    ===
  `)

  do {
    const nextPage: number = pages.length
    const records = await loadPageRecords(nextPage)

    pages.push(records)
    csvWriter.writeRecords(extractCoords(records))
    console.log(`loaded ${pages.length} pages`);

    await renderScatterPlot(join('tmp', 'plot.png'), extractCoords(_.flatten(pages)))
  } while (pages[pages.length - 1].length > 0)
}()
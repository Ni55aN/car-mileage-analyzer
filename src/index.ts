
import { join } from 'path'
import _ from 'lodash'
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer'
import { Record } from './types'
import { loadPageRecords, Providers } from './providers'

const csvWriter = createCsvWriter({
  path: join('tmp', 'file.csv'),
  header: [
    {id: 'year', title: 'Year'},
    {id: 'mileage', title: 'Mileage'},
    {id: 'title', title: 'Title'}
  ] as { id: keyof Record, title: string }[]
});

async function loadAllPagesForProvider(provider: Providers) {
  let pages = []

  do {
    const nextPage: number = pages.length
    const records = await loadPageRecords(provider, nextPage)

    pages.push(records)
    csvWriter.writeRecords(records)
    console.log(`loaded ${pages.length} pages`);

  } while (pages[pages.length - 1].length > 0)
}


void async function() {
  console.log(`
    ====
    You can open tmp/file.csv on the site https://www.csvplot.com/
    ===
  `)

  await loadAllPagesForProvider('autoRia')
  await loadAllPagesForProvider('rst')
}()
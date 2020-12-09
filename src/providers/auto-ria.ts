import axios from 'axios'
import cheerio from 'cheerio'
import { Record } from '../types'

export async function loadPageRecords(page: number): Promise<Record[]> {
  const url = `https://auto.ria.com/uk/search/?indexName=auto&price.currency=1&abroad.not=0&custom.not=1&page=${page}&size=100`
  const res = await axios(url)

  const $ = cheerio.load(res.data)

  const records = $('.ticket-item').map((_,el) => {
    const element = $(el)
    return {
      title: element.find('.head-ticket').text().trim(),
      href: element.find('.head-ticket a').attr('href'),
      mileage: element.find('.definition-data .characteristic .item-char').first().text().trim()
    }
  }).toArray() as unknown as { title: string, href: string, mileage: string }[]

  return records.map(record => {
    const year = parseInt(record.title.split(' ').reverse()[0])
    const mileage = record.mileage === 'без пробега' ? 0 : parseInt(record.mileage)
  
    if (!Number.isFinite(year)) throw new Error('year corrupted')
  
    if (mileage > 1000) console.log(record.href, record.mileage)
  
    return {
      title: record.title,
      year,
      mileage
    }
  })
}
import axios from 'axios'
import cheerio from 'cheerio'
import iconv from 'iconv-lite'
import UserAgent from 'user-agents'
import { Record } from '../types'

const userAgent = new UserAgent({ platform: 'Win32' })
const ua = userAgent.random().toString()

export async function loadPageRecords(page: number): Promise<Record[]> {
  const url = `https://rst.ua/oldcars/?task=newresults&start=${page + 1}`
  const res = await axios(url, {
    headers: { 'User-Agent': ua },
    responseType: 'arraybuffer'
  })
  const data = iconv.decode(res.data, 'win1251')
  const $ = cheerio.load(data)

  const records = $('.rst-page-wrap').find('.rst-ocb-i').map((_,el) => {
    const element = $(el)
    const li = element.find('li').filter((i, el) => Boolean($(el).text().match(/Год/))).text()
    const match = li.match(/^Год: (\d+), \((\d+) - пробег\)$/)
    const title = element.find('h3').text().trim().replace(/^продам /, '')

    return {
      title: title.match('архив RST') ? '' : title,
      href: 'https://rst.ua/' + element.find('a').attr('href'),
      year: match ? +match[1] : null,
      mileage: match ? (+match[2]/1000) : null
    }
  }).toArray() as unknown as { title: string, href: string, year: number, mileage: number }[]

  return records.filter(record => record.title).map(record => {
    return {
      title: record.title,
      year: record.year,
      mileage: record.mileage
    }
  })
}
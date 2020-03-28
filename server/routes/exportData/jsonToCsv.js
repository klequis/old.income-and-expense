import { find } from 'db'
import { DATA_COLLECTION_NAME } from 'db/constants'
import fs from 'fs'
import { format } from 'date-fns'

const jsonToCsv = json => {
  const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
  const header = [
    'description',
    'category1',
    'category2',
    'date',
    'origDescription',
    'debit',
    'credit',
    'typeOrig',
    'omit',
    'checkNumber',
    '_id'
  ]

  let csv = json.map(row =>
    header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
  )

  csv.unshift(header.join(','))
  csv = csv.join('\r\n')
  return csv
}

const writeFile = async csv => {
  const res = await fs.promises.writeFile(
    // `/home/klequis/Downloads/${format(new Date(), 'ddMMyyyy')}data.csv`,
    `/home/klequis/Downloads/new-data.csv`,
    // `new-data.csv`,
    csv,
    'utf8'
  )
  return res
}

const writeCsvFile = async () => {
  const data = await find(DATA_COLLECTION_NAME, {})
  const csvData = jsonToCsv(data)
  await writeFile(csvData)
}

export default writeCsvFile

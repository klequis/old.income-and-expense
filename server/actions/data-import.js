import { createIndex, dropCollection, find, insertMany } from 'db'
import { ACCOUNTS_COLLECTION_NAME, DATA_COLLECTION_NAME } from 'db/constants'
import csv from 'csvtojson'
import { has, filter } from 'ramda'
import runRules from './run-rules'

// eslint-disable-next-line
import { green, red, redf, yellow } from 'logger'

const readCsvFile = async (file, hasHeaders) => {
  try {
    if (hasHeaders) {
      const json = await csv({
        trim: true,
        checkType: true,
        noheader: false,
        headers: []
      }).fromFile(`data/${file}`)
      return json
    } else {
      const json = await csv({
        trim: true,
        checkType: true,
        noheader: true,
        headers: []
      }).fromFile(`data/${file}`)
      return json
    }
  } catch (e) {
    redf('readCSVFile ERROR:', `File ${file} not found.`)
  }
}

// const successFail = (condition, message, value) => {
//   if (condition) {
//     green(message, value)
//   } else {
//     red(message, value)
//   }
// }

const isDebit = value => (value < 0 ? value : null)

const isCredit = value => (value > 0 ? value : null)

// const hasDate = has('date')
// const hasDescription = has('description')
const hasDebit = has('debit')
const hasCredit = has('credit')
const hasTypeOrig = has('typeOrig')
const hasCheckNumber = has('checkNumber')

const toLower = value => value.toLowerCase()

const removeDoubleSpace = value => value.replace(/\s{2,}/g, ' ').trim()

const transformData = (account, data) => {
  const { fieldToCol, acctId } = account
  const docs = data.map(doc => {
    const description = removeDoubleSpace(
      doc[`field${fieldToCol.description.col}`]
    )
    const date = new Date(doc[`field${fieldToCol.date.col}`]).toISOString()
    return {
      acctId: acctId,
      date: date,
      description: description,
      origDescription: description,
      debit: hasDebit(fieldToCol)
        ? isDebit(doc[`field${fieldToCol.debit.col}`])
        : null,
      credit: hasCredit(fieldToCol)
        ? isCredit(doc[`field${fieldToCol.credit.col}`])
        : null,
      typeOrig: hasTypeOrig(fieldToCol)
        ? toLower(doc[`field${fieldToCol.typeOrig.col}`])
        : null,
      checkNumber: hasCheckNumber(fieldToCol)
        ? doc[`field${fieldToCol.checkNumber.col}`]
        : null,
      omit: false
    }
  })
  return docs.map(obj => filter(n => n !== null, obj))
}

const dataImport = async (loadRaw = false) => {
  try {
    let docsInserted = 0
    await dropCollection(DATA_COLLECTION_NAME)
    if (loadRaw) {
      await dropCollection('data-all')
    }
    const accounts = await find(ACCOUNTS_COLLECTION_NAME, {})
    for (let i = 0; i < accounts.length; i++) {
      const { name: dataFileName, hasHeaders } = accounts[i].dataFile
      const dataFileHasHeaders = hasHeaders === false ? hasHeaders : true
      const rawData = await readCsvFile(dataFileName, dataFileHasHeaders)
      const transformedData = transformData(accounts[i], rawData)
      const inserted = await insertMany(DATA_COLLECTION_NAME, transformedData)
      docsInserted += inserted.length
    }
    if (loadRaw) {
      await createIndex(DATA_COLLECTION_NAME, 'description', {
        collation: { caseLevel: true, locale: 'en_US' }
      })
      await createIndex(DATA_COLLECTION_NAME, 'typeOrig', {
        collation: { caseLevel: true, locale: 'en_US' }
      })
    }
    await runRules()
    return JSON.stringify([
      {
        operation: 'load data',
        status: 'success',
        numDocsLoaded: docsInserted
      }
    ])
  } catch (e) {
    redf('dataImport ERROR:', e.message)
    console.log(e)
    return JSON.stringify([{}])
  }
}

export default dataImport

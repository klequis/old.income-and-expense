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

const successFail = (condition, message, value) => {
  if (condition) {
    green(message, value)
  } else {
    red(message, value)
  }
}

const isDebit = value => (value < 0 ? value : null)

const isCredit = value => (value > 0 ? value : null)

// const checkNumber = value => (value ? value : null)

const hasDate = has('date')
const hasDescription = has('description')
const hasDebit = has('debit')
const hasCredit = has('credit')
const hasTypeOrig = has('typeOrig')
const hasCheckNumber = has('checkNumber')

const toLower = value => value.toLowerCase()

const transformData = (account, data) => {
  // yellow('data[0]', data[0])
  // yellow('data[1]', data[1])

  const { fieldToCol } = account
  // yellow('fieldToCol', fieldToCol)
  const docs = data.map(doc => {
    return {
      date: doc[`field${fieldToCol.date.col}`],
      description: doc[`field${fieldToCol.description.col}`],
      origDescription: doc[`field${fieldToCol.description.col}`],
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
      const drop = await dropCollection('data-all')
      // green('drop data-all', drop ? 'success' : 'failure')
      successFail(drop, 'drop data-all')
    }
    // yellow('****')
    const accounts = await find(ACCOUNTS_COLLECTION_NAME, {})
    // yellow('****')
    successFail(accounts.length === 5, 'accounts', accounts.length)

    for (let i = 0; i < accounts.length; i++) {
      const a = accounts[i].dataFile
      // yellow('a', a)
      const { name: dataFileName, hasHeaders } = accounts[i].dataFile
      const dataFileHasHeaders = hasHeaders === false ? hasHeaders : true
      // yellow('dataFile', dataFileName)
      // yellow('dataFileHasHeaders', dataFileHasHeaders)
      successFail(dataFileName, 'dataFile', dataFileName)
      const rawData = await readCsvFile(dataFileName, dataFileHasHeaders)
      successFail(rawData.length > 0, `${dataFileName}.length=`, rawData.length)
      const transformedData = transformData(accounts[i], rawData)
      // yellow('transformedData', transformedData)
      const inserted = await insertMany(DATA_COLLECTION_NAME, transformedData)
      // yellow('inserted', inserted)
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
    const runRulesResult = await runRules()
    green('runRulesResult', runRulesResult)
    green('docsInserted', docsInserted)
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

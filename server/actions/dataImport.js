import { createIndex, dropCollection, find, insertMany } from 'db'
import { ACCOUNTS_COLLECTION_NAME, DATA_COLLECTION_NAME } from 'db/constants'
import csv from 'csvtojson'
import { has, filter, pipe, trim, toLower, isNil } from 'ramda'
import runRules from './runRules'
import dataFields from 'dataCollection'

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

const isDebit = value => value < 0
const isCredit = value => value > 0
const removeDoubleSpace = value => value.replace(/\s{2,}/g, ' ').trim()
const checkO = o => {
  const keys = Object.keys(o)
  keys.forEach(key => {
    if (isNil(o[key])) {
      red(`field${key} `, typeof o[key])
    }
  })
}

const _swapCreditDebit = value => {
  if (value === 0) {
    return value
  }

  return value * -1
}

const transformCreditDebit = (swapCreditDebit, value) => {
  // yellow('value', value)
  const nv1 = typeof value === 'string' ? 0 : value
  const nv2 = swapCreditDebit ? _swapCreditDebit(nv1) : nv1
  // yellow('nv2', nv2)
  return nv2
}

/*
    data collection field names are: field[n]
*/
const transformData = (account, data) => {
  const { fieldToCol, acctId, swapCreditDebit } = account
  const docs = data.map(doc => {
    // description
    const description = pipe(
      removeDoubleSpace,
      trim
    )(doc[`field${fieldToCol.description.col}`])

    // date
    const date = new Date(doc[`field${fieldToCol.date.col}`]).toISOString()

    // credit
    const credit = transformCreditDebit(
      swapCreditDebit,
      doc[`field${fieldToCol.credit.col}`]
    )

    // debit
    const debit = transformCreditDebit(
      swapCreditDebit,
      doc[`field${fieldToCol.debit.col}`]
    )

    // type
    const type = has(dataFields.type)(fieldToCol)
      ? pipe(toLower, trim)(doc[`field${fieldToCol.typeOrig.col}`]) || ''
      : ''

    // checkNumber
    const checkNumber = has(dataFields.checkNumber)(fieldToCol)
      ? doc[`field${fieldToCol.checkNumber.col}`] || ''
      : ''

    const o = {
      acctId,
      date,
      description,
      origDescription: description,
      debit: isDebit(debit) ? debit : 0,
      credit: isCredit(credit) ? credit : 0,
      type,
      checkNumber,
      omit: false,
      category1: 'none', // set default value
      category2: '' // set default value
    }
    checkO(o)
    return o
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
      yellow('dataFileName', dataFileName)
      yellow('rawData.length', rawData.length)
      if (loadRaw) {
        await insertMany('raw-data', rawData)
      }

      const transformedData = transformData(accounts[i], rawData)
      const inserted = await insertMany(DATA_COLLECTION_NAME, transformedData)

      docsInserted += inserted.length
    }
    await createIndex(DATA_COLLECTION_NAME, 'description', {
      collation: { caseLevel: true, locale: 'en_US' }
    })
    await createIndex(DATA_COLLECTION_NAME, 'typeOrig', {
      collation: { caseLevel: true, locale: 'en_US' }
    })
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

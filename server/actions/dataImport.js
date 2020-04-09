import { createIndex, dropCollection, find, insertMany } from 'db'
import { ACCOUNTS_COLLECTION_NAME, DATA_COLLECTION_NAME } from 'db/constants'
import csv from 'csvtojson'
// import { has, filter, pipe, trim, toLower, isNil, evolve } from 'ramda'
import R from 'ramda'
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
        headers: [],
      }).fromFile(`data/${file}`)
      return json
    } else {
      const json = await csv({
        trim: true,
        checkType: true,
        noheader: true,
        headers: [],
      }).fromFile(`data/${file}`)
      return json
    }
  } catch (e) {
    redf('readCSVFile ERROR:', `File ${file} not found.`)
  }
}

const isDebit = (value) => value < 0
const isCredit = (value) => value > 0
const removeDoubleSpace = (value) => value.replace(/\s{2,}/g, ' ').trim()
const checkO = (o) => {
  const keys = Object.keys(o)
  keys.forEach((key) => {
    if (R.isNil(o[key])) {
      red(`field${key} `, typeof o[key])
    }
  })
}

const _swapCreditDebit = (value) => {
  if (value === 0) {
    return value
  }

  return value * -1
}

const _transformCreditDebit = (swapCreditDebit, value) => {
  const nv1 = typeof value === 'string' ? 0 : value
  const nv2 = swapCreditDebit ? _swapCreditDebit(nv1) : nv1
  return nv2
}

/*
    data collection field names are: field[n]
*/

// new

const getFieldValue = (column, doc) => {
  try {
    green('getFieldValue: column', column)
    const ret = doc[`field${column}`] || ''
    green('getFieldValue: ret', ret)
    return ret
  } catch (e) {
    redf('getFieldValue ERROR', e.message)
    console.log(e)
  }
}
const _replaceStringWithZero = (value) =>
  typeof value === 'string' ? 0 : value

const evolver = {
  description: R.pipe(removeDoubleSpace, R.trim),
  date: R.identity,
  credit: R.pipe(
    _replaceStringWithZero,
    R.cond([
      [R.gt(R.__, 0), (x) => x],
      [R.T, R.always(0)],
    ])
  ),
  debit: R.pipe(
    _replaceStringWithZero,
    R.cond([
      [R.lt(R.__, 0), (x) => x],
      [R.T, R.always(0)],
    ])
  ),
}

const swap = (doc) => {
  const { credit, debit } = doc
  const newCredit = credit !== 0 ? -credit : credit
  const newDebit = debit !== 0 ? -debit : debit
  const newDoc = R.mergeRight(doc, { credit: newCredit, debit: newDebit })
  return newDoc
}

const emptyString = (x) => 'hi'

const log = (label) => (message) => yellow(label, message)

const _transformDataNew = (account, data) => {
  const { fieldToCol, swapCreditDebit, acctId } = account
  try {
    
    const mapToFields = (doc) => {
      // yellow('doc', doc)
      // yello(R.has(`field${fieldToCol.checkNumber.col}`)

      
      console.group(`acct: ${acctId} fieldToCols`)
      yellow('has date', R.has('date')(fieldToCol))
      yellow('has description', R.has('description')(fieldToCol))
      yellow('has originalDescription', R.has('originalDescription')(fieldToCol))
      yellow('has debit', R.has('debit')(fieldToCol))
      yellow('has credit', R.has('credit')(fieldToCol))
      yellow('has type', R.has('type')(fieldToCol))
      yellow('has checkNumber', R.has('checkNumber')(fieldToCol))
      console.groupEnd()


      const ret = {
        description: getFieldValue(fieldToCol.description.col, doc),
        date: getFieldValue(fieldToCol.date.col, doc),
        credit: getFieldValue(fieldToCol.credit.col, doc),
        debit: getFieldValue(fieldToCol.debit.col, doc),
        category1: 'none',
        category2: '',
        // checkNumber: getFieldValue(fieldToCol.checkNumber.col, doc),
        // type: getFieldValue(fieldToCol.type.col, doc)
        // checkNumber: R.ifElse(
        //   // R.has(dataFields.checkNumber),
        //   R.has(`field${fieldToCol.checkNumber.col}`),
        //   getFieldValue(fieldToCol.checkNumber.col, doc),
        //   R.always('hi')
        // ),
        checkNumber: R.cond([
          [
            // R.has(`field${fieldToCol.checkNumber.col}`),
            R.has('checkNumber')(fieldToCol),
            // getFieldValue(fieldToCol.checkNumber.col, doc)
            R.always('a')
          ],
          [R.T, R.always('')]
        ])
        // type: R.ifElse(
        //   R.has(dataFields.type),
        //   getFieldValue(fieldToCol.type.col, doc),
        //   emptyString
        // )
      }
      return ret
    }
    const transform = R.compose(
      // R.when(R.always(swapCreditDebit), swap),
      // R.tap(log('after evolve')),
      // R.evolve(evolver),
      R.tap(log('after map')),
      mapToFields,
      R.tap(log('start'))
    )

    return R.map(transform, data)
  } catch (e) {
    red('acctId', acctId)
    red('ftc', fieldToCol)
    redf('_transformDataNew ERROR', e.message)
    console.log(e)
  }
}

// ***

const _transformData = (account, data) => {
  const { fieldToCol, acctId, swapCreditDebit } = account

  const docs = data.map((doc) => {
    // description
    const description = R.pipe(
      removeDoubleSpace,
      R.trim
    )(doc[`field${fieldToCol.description.col}`])

    // date
    const date = new Date(doc[`field${fieldToCol.date.col}`]).toISOString()

    // credit
    const credit = _transformCreditDebit(
      swapCreditDebit,
      doc[`field${fieldToCol.credit.col}`]
    )

    // debit
    const debit = _transformCreditDebit(
      swapCreditDebit,
      doc[`field${fieldToCol.debit.col}`]
    )

    // type
    const type = R.has(dataFields.type)(fieldToCol)
      ? R.pipe(R.toLower, R.trim)(doc[`field${fieldToCol.typeOrig.col}`]) || ''
      : ''

    // checkNumber
    const checkNumber = R.has(dataFields.checkNumber)(fieldToCol)
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
      category2: '', // set default value
    }
    checkO(o)
    return o
  })

  return docs.map((obj) => R.filter((n) => n !== null, obj))
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
      if (loadRaw) {
        await insertMany('raw-data', rawData)
      }

      const transformedData = _transformDataNew(accounts[i], rawData)
      const inserted = await insertMany(DATA_COLLECTION_NAME, transformedData)

      docsInserted += inserted.length
    }
    await createIndex(DATA_COLLECTION_NAME, 'description', {
      collation: { caseLevel: true, locale: 'en_US' },
    })
    await createIndex(DATA_COLLECTION_NAME, 'typeOrig', {
      collation: { caseLevel: true, locale: 'en_US' },
    })
    await runRules()
    green('Number of docs imported', docsInserted)
    return JSON.stringify([
      {
        operation: 'load data',
        status: 'success',
        numDocsLoaded: docsInserted,
      },
    ])
  } catch (e) {
    redf('dataImport ERROR:', e.message)
    console.log(e)
    return JSON.stringify([{}])
  }
}

export default dataImport

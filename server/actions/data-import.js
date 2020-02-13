import { createIndex, dropCollection, insertMany } from 'db'
import csv from 'csvtojson'
import { DATA_COLLECTION_NAME } from 'db/constants'
import { mergeRight } from 'ramda'
import runRules from 'actions/run-rules'
// eslint-disable-next-line
import { green, greenf, redf, yellow } from 'logger'

const readCSVFile = async (file, headers = []) => {
  if (headers.length === 0) {
    const json = await csv({
      trim: true,
      checkType: true
    }).fromFile(`data/${file}`)
    return json
  } else {
    const json = await csv({
      trim: true,
      checkType: true,
      noheader: true,
      headers: headers
    }).fromFile(`data/${file}`)
    return json
  }
}

const transformChaseChk = data => {
  return data.map(r => {
    const checkNumber =
      typeof r['Check or Slip #'] === 'number' ? r['Check or Slip #'] : null
    const description = r.Description.replace(/\s{2,}/g, ' ').trim()
    const a = {
      date: new Date(r['Posting Date']).toISOString(),
      description: description,
      origDescription: description,
      debit: r.Amount <= 0 ? r.Amount : null,
      credit: r.Amount <= 0 ? null : r.Amount,
      typeOrig: r.Type.toLowerCase(),
      omit: false
    }
    const b = checkNumber !== null ? { checkNumber } : {}
    return mergeRight(a, b)
  })
}

const loadChaseChecking = async () => {
  const jsonFromCsv = await readCSVFile('chase.carl.checking.2465.csv')
  const transformedData = await transformChaseChk(jsonFromCsv)
  return transformedData
}

const transformWfChk = async data => {
  try {
    const d = data.map(r => {
      const description = r.description.replace(/\s{2,}/g, ' ').trim()
      const a = {
        date: new Date(r.date).toISOString(),
        description: description,
        origDescription: description,
        debit: r.debitOrCredit <= 0 ? r.debitOrCredit : null,
        credit: r.debitOrCredit <= 0 ? null : r.debitOrCredit,
        typeOrig: '',
        omit: false
      }
      const b = r.checkNum !== '' ? { checkNumber: r.checkNum } : {}
      return mergeRight(a, b)
    })
    green('d', d)
    return d
  } catch (e) {
    redf('transformWfChk ERROR:', e.message)
    console.log(e)
  }
}

const loadWellsFargoChecking = async () => {
  const jsonFromCsv = await readCSVFile('wells-fargo-chk.csv', [
    'date',
    'debitOrCredit',
    'star',
    'checkNum',
    'description'
  ])
  // green('jsonFromCsv', jsonFromCsv)
  const transformedData = await transformWfChk(jsonFromCsv)
  green('***')
  return transformedData
}

const dataImport = async (rulesAndData, loadRaw = false) => {
  console.log('*')
  console.log('*')
  green('****** New run ******')
  console.log('*')
  console.log('*')
  try {
    const a = await dropCollection(DATA_COLLECTION_NAME)
    green('dropCollection(data)', a)
    for (let i = 0; i < rulesAndData.length; i++) {
      
    }

    // // const dataToLoad = await loadChaseChecking()
    // const dataToLoad = await loadWellsFargoChecking()
    // console.log(dataToLoad)

    // const inserted = await insertMany(DATA_COLLECTION_NAME, dataToLoad)
    // // { collation: { caseLevel: true, locale: 'en_US' } }
    // await createIndex(DATA_COLLECTION_NAME, 'description', {
    //   collation: { caseLevel: true, locale: 'en_US' }
    // })
    // await createIndex(DATA_COLLECTION_NAME, 'typeOrig', {
    //   collation: { caseLevel: true, locale: 'en_US' }
    // })
    // if (loadRaw) {
    //   await dropCollection('data-all')
    //   await insertMany('data-all', dataToLoad)
    //   await createIndex('data-all', 'description', {
    //     collation: { caseLevel: true, locale: 'en_US' }
    //   })
    //   await createIndex('data-all', 'typeOrig', {
    //     collation: { caseLevel: true, locale: 'en_US' }
    //   })
    // }
    // const runRulesResult = await runRules()
    // green('runRulesResult', runRulesResult)
    // return JSON.stringify([
    //   {
    //     operation: 'load data',
    //     status: 'success',
    //     numDocsLoaded: inserted.length
    //   }
    // ])
  } catch (e) {
    return JSON.stringify([{}])
  }
}

export default dataImport

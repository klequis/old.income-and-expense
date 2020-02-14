import { find, dropCollection } from 'db'
import { ACCOUNTS_COLLECTION_NAME } from 'db/constants'
import csv from 'csvtojson'
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

const transformData = (account, data) => {
  yellow('data[0]', data[0])
  // yellow('data[1]', data[1])
  
  const { fieldToCol } = account
  yellow('fieldToCol', fieldToCol)
  const b = data.map(doc => {
    const x = doc[`field${fieldToCol.debit.col}`]
    yellow('x', x)
    // const debit = doc[`field$`]
    return {
      date: doc[`field${fieldToCol.date.col}`],
      description: doc[`field${fieldToCol.description.col}`],
      origDescription: doc[`field${fieldToCol.description.col}`]
      // debit: 
    }
  })
  // yellow('b', b)
}

const dataImport = async (loadRaw = false) => {
  try {
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
      yellow('a', a)
      const { name: dataFileName, hasHeaders } = accounts[i].dataFile
      const dataFileHasHeaders = hasHeaders === false ? hasHeaders : true
      yellow('dataFile', dataFileName)
      yellow('dataFileHasHeaders', dataFileHasHeaders)
      successFail(dataFileName, 'dataFile', dataFileName)
      const rawData = await readCsvFile(dataFileName, dataFileHasHeaders)
      successFail(rawData.length > 0, `${dataFileName}.length=`, rawData.length)
      const transformedData = transformData(accounts[i], rawData)
    }
  } catch (e) {
    redf('dataImport ERROR:', e.message)
    console.log(e)
  }
}

export default dataImport

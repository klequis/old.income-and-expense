import { DATA_COLLECTION_NAME } from 'db/constants'
import { find } from 'db/dbFunctions'
import fs from 'fs'
import path from 'path'
import { mergeAll } from 'ramda'

// eslint-disable-next-line
import { blue, green, greenf, redf, yellow } from 'logger'

export const readRules = async () => {
  try {
    const rulesFullPath = path.join(__dirname, 'rules-wf-chk.json')
    const rules = await fs.promises.readFile(rulesFullPath)
    const json = await JSON.parse(rules)
    return json
  } catch (e) {
    redf('readRules ERROR: ', e.message)
  }
}

export const wrappedFind = async filter => {
  return find(
    DATA_COLLECTION_NAME,
    filter,
    {},
    // { caseLevel: true, locale: 'en_US' }
    { locale: 'en', strength: 2 }
  )
}

const operationBeginsWith = (field, value) => {
  return { [field]: { $regex: `^${value}`, $options: 'im' } }
}

const operationContains = (field, value) => {
  return { [field]: { $regex: `${value}`, $options: 'im' } }
}

const operationEquals = (field, value) => {
  return { [field]: { $eq: value } }
}

const operationRegex = (field, value) => {
  return { [field]: { $regex: `${value}`, $options: 'im' } }
}

// const createRegex = (findValue, numAdditionalChars = 0) => {
//   const regExAsString =
//     numAdditionalChars > 0
//       ? `(${findValue}).{${numAdditionalChars}}`
//       : `(${findValue})`
//   return new RegExp(regExAsString)
// }

const operationIn = (field, value) => {
  const regex = new RegExp(value)
  return { [field]: { $in: [regex] } }
}

export const conditionBuilder = criteria => {
  // takes a single criteria object

  // TODO: hard coding descriptions  => origDescription. Where should this logic be?

  const { field: origField, operation, value } = criteria
  const field = origField === 'description' ? 'origDescription' : origField
  // yellow('operation', operation)
  switch (operation) {
    case 'beginsWith':
      return operationBeginsWith(field, value)
    case 'equals':
      return operationEquals(field, value)
    case 'contains':
      return operationContains(field, value)
    case 'regex':
      return operationRegex(field, value)
    case '$in':
      return operationIn(field, value)
    default:
      redf(
        'deleteAction ERROR: ',
        `operation ${operation} not covered in switch`
      )
      throw new Error(
        `conditionBuilder ERROR: unknown operation '${operation}'`
      )
  }
}

export const filterBuilder = criteria => {
  // if (criteria.length === 1) {
  // yellow('criteria', criteria)
  return mergeAll(
    criteria.map(c => {
      return conditionBuilder(c)
    })
  )
  // } else {
  //   const b = criteria.map(c => conditionBuilder(c))
  //   return { $and: b }
  // }
}

export const printResult = (id, expectRows, actualRows) => {
  expectRows === actualRows
    ? greenf(`OK: id: ${id}, expected: ${expectRows}, actual: ${actualRows}`)
    : redf(`ERROR: id: ${id}, expected: ${expectRows}, actual: ${actualRows}`)
}
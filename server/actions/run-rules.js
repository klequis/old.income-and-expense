import { find, updateMany, findOneAndUpdate } from 'db'
import { DATA_COLLECTION_NAME } from 'db/constants'
import { readRules, filterBuilder, printResult } from 'actions/action-utils'
// import writeCsvFile from 'actions/json-to-csv'
import { hasProp } from 'lib'

// eslint-disable-next-line
import { blue, green, greenf, redf, yellow } from 'logger'

const printFilter = filter => {
  if (hasProp('$and', filter)) {
    const a = filter.$and
    yellow('$and', a)
  } else {
    yellow('filter', filter)
  }
}

const createRegex = (findValue, numAdditionalChars = 0) => {
  const regExAsString =
    numAdditionalChars > 0
      ? `(${findValue}).{${numAdditionalChars}}`
      : `(${findValue})`
  return new RegExp(regExAsString)
}

const rulesToRun = []

const runRules = async () => {
  // await loadData(true)
  // const data = await find(DATA_COLLECTION_NAME, {})
  // yellow('runRules')
  const { rules: allRules } = await readRules()
  yellow('allRules', allRules)
  // const runRules = allRules.filter(r => rulesToRun.includes(r.id))
  const runRules =
    rulesToRun.length === 0
      ? allRules
      : allRules.filter(r => rulesToRun.includes(r.id))
  // const runRules = allRules
  green('** running rules num', runRules.length)

  // console.log('runRules', runRules)

  // omit rules
  blue('** omit rules **')
  for (let i = 0; i < runRules.length; i++) {
    const rule = runRules[i]
    console.log('---')
    console.log(`** id: ${rule.id}`)
    const { actions, criteria } = rule
    // yellow('criteria', criteria)
    const filter = filterBuilder(criteria)
    const f = await find(DATA_COLLECTION_NAME, filter)
    printFilter(filter)
    printResult(rule.id, rule.numExpectedDocs, f.length)
    // yellow(actions)
    for (let j = 0; j < actions.length; j++) {
      const action = actions[j]
      // yellow('action', action)
      const { findValue, numAdditionalChars } = action
      const regex = createRegex(findValue, numAdditionalChars)
      switch (action.action) {
        case 'omit':
          await updateMany(DATA_COLLECTION_NAME, filter, { omit: true })
          break
        case 'strip':
          for (let j = 0; j < f.length; j++) {
            const doc = f[j]
            const origFieldValue = doc[action.field]
            const newFieldValue = doc[action.field].replace(regex, '').trim()
            const foau = await findOneAndUpdate(
              DATA_COLLECTION_NAME,
              { _id: doc._id },
              {
                [action.field]: newFieldValue,
                [`orig${action.field}`]: origFieldValue
              }
            )
          }
          break
        case 'replaceAll':
          // const { field, replaceWithValue } = action
          for (let j = 0; j < f.length; j++) {
            const doc = f[j]
            // yellow('old description', doc.description)
            const foau = await findOneAndUpdate(
              DATA_COLLECTION_NAME,
              { _id: doc._id },
              { [action.field]: action.replaceWithValue }
            )
          }
          break
        case 'categorize':
          // const { category1, category2 } = action
          // You probable don't need to loop here and you didn't (probably) need to do so for replaceRules either
          // const set = hasProp('category2', action)
          //   ? { category1, category2 }
          //   : { category1 }
          yellow('filter', filter)

          await updateMany(
            DATA_COLLECTION_NAME,
            filter,
            hasProp('category2', action)
              ? { category1: action.category1, category2: action.category2 }
              : { category1: action.category1 }
          )
          break
        default:
          redf('unknown action type:', action.action)
      }
    }
  }

  // writeCsvFile()
}

export default runRules

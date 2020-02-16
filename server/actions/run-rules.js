import { find, updateMany, findOneAndUpdate } from 'db'
import { DATA_COLLECTION_NAME, RULES_COLLECTION_NAME } from 'db/constants'
import { filterBuilder } from 'actions/action-utils'
import { hasProp } from 'lib'

// eslint-disable-next-line
import { blue, green, greenf, redf, yellow } from 'logger'

// const printFilter = filter => {
//   console.log('// filter')
//   if (hasProp('$and', filter)) {
//     const a = filter.$and
//     yellow('filter', filter)
//     yellow('$and:', a)
//   } else {
//     yellow('filter', filter)
//   }
//   console.log('// filter')
// }

const createRegex = (findValue, numAdditionalChars = 0) => {
  const regExAsString =
    numAdditionalChars > 0
      ? `(${findValue}).{${numAdditionalChars}}`
      : `(${findValue})`
  return new RegExp(regExAsString)
}

const runRules = async () => {
  const allRules = await find(RULES_COLLECTION_NAME, {})
  // yellow(typeof allRules[0]._id)
  // const rules = allRules.filter(rule => rule._id.toString() === '5e45ca2f6d8f4438b8ee5926')
  const rules = allRules

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]
    console.log('---')
    console.log(`** id: ${rule.id}`)
    const { actions, criteria } = rule
    const filter = filterBuilder(criteria)
    const f = await find(DATA_COLLECTION_NAME, filter)
    // printFilter(filter)
    for (let j = 0; j < actions.length; j++) {
      const action = actions[j]
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
            await findOneAndUpdate(
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
          for (let j = 0; j < f.length; j++) {
            const doc = f[j]
            await findOneAndUpdate(
              DATA_COLLECTION_NAME,
              { _id: doc._id },
              { [action.field]: action.replaceWithValue }
            )
          }
          break
        case 'categorize':
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
}

export default runRules

import { find, updateMany, findOneAndUpdate } from 'db'
import { DATA_COLLECTION_NAME, RULES_COLLECTION_NAME } from 'db/constants'
import { filterBuilder } from 'actions/action-utils'
import { hasProp } from 'lib'
import { append } from 'ramda'

// eslint-disable-next-line
import { blue, green, greenf, redf, yellow } from 'logger'

const printFilter = filter => {
  console.log('// filter')
  if (hasProp('$and', filter)) {
    const a = filter.$and
    yellow('filter', filter)
    yellow('$and:', a)
  } else {
    yellow('filter', filter)
  }
  console.log('// filter')
}

const createRegex = (findValue, numAdditionalChars = 0) => {
  const regExAsString =
    numAdditionalChars > 0
      ? `(${findValue}).{${numAdditionalChars}}`
      : `(${findValue})`
  return new RegExp(regExAsString)
}

const createCategorizeUpdate = (action, rule) => {
  let update
  if (hasProp('category2', action)) {
    update = {
      $set: {
        category1: action.category1,
        category2: action.category2
      },
      $push: { rules: rule._id }
    }
  } else {
    update = { $set: { category1: action.category1 }, $push: { rules: rule._id } }
    // update = { category1: action.category1, $push: { rules: 'abc' } }
  }
  // green('createCategorizeUpdate: update', update)
  return update
}

const createReplaceAllUpdate = (action, rule) => {
  const update = {
    $set: {
      [action.field]: action.replaceWithValue
    },
    $push: { rules: rule._id }
  }
  // green('createReplaceAllUpdate: update', update)
  return update
}

const createStripUpdate = (action, doc, rule) => {
  const { findValue, numAdditionalChars } = action
  const regex = createRegex(findValue, numAdditionalChars)
  const update = {
    $set: {
      [action.field]: doc[action.field].replace(regex, '').trim(),
      [`orig${action.field}`]: doc[action.field]
    },
    $push: { rules: rule._id }
  }
  // green('createStripUpdate: update', update)
  return update
}

const createOmitUpdate = (rule) => {
  const update = {
    $set: { omit: true },
    // $push: { rules: rule._id }
    $push: { rules: 'abc' }
  }
  // green('createUpdateOmit: update', update)
  return update
}

const runRules = async () => {
  const allRules = await find(RULES_COLLECTION_NAME, {})
  // yellow(typeof allRules[0]._id)
  // const rules = allRules.filter(rule => rule._id.toString() === '5e45ca2f6d8f4438b8ee5926')
  const rules = allRules
  // const x = {
  //   field: 'acctId',
  //   operation: 'equals',
  //   value: 'cb.eee.ddd'
  // }
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]
    const { actions, criteria, acct } = rule
    // yellow('acctId', acct)
    // yellow('runRules: criteria', criteria)
    const criteriaWithAcctId = append(
      {
        field: 'acctId',
        operation: 'equals',
        value: acct
      },
      criteria
    )
    // yellow('runRules: criteriaWithAcctId', criteriaWithAcctId)
    const filter = filterBuilder(criteriaWithAcctId)
    const f = await find(DATA_COLLECTION_NAME, filter)
    for (let j = 0; j < actions.length; j++) {
      const action = actions[j]

      switch (action.action) {
        case 'omit':
          await updateMany(DATA_COLLECTION_NAME, filter, createOmitUpdate(rule))
          break
        case 'strip':
          for (let j = 0; j < f.length; j++) {
            const doc = f[j]
            await findOneAndUpdate(
              DATA_COLLECTION_NAME,
              { _id: doc._id },
              createStripUpdate(action, doc, rule)
            )
          }
          break
        case 'replaceAll':
          for (let j = 0; j < f.length; j++) {
            const doc = f[j]
            await findOneAndUpdate(
              DATA_COLLECTION_NAME,
              { _id: doc._id },
              createReplaceAllUpdate(action, rule)
            )
          }
          break
        case 'categorize':
          await updateMany(DATA_COLLECTION_NAME, filter, createCategorizeUpdate(action, rule))
          break
        default:
          redf('unknown action type:', action.action)
      }
    }
  }
}

export default runRules

const x = {
  $and: [
    { typeOrig: { $eq: 'billpay' } },
    { originalDescription: { $regex: '^Bel Air', $options: 'im' } }
  ]
}

/*
db.getCollection('data').update(

{ _id: ObjectId('5e4c329a2f5ca86454a05df3') },
{
  $push: { rules: 'def' },
  $set: { description: 'a' }
}

)
*/

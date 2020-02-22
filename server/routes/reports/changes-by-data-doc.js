import wrap from 'routes/wrap'
import { executeAggregate } from 'db/dbFunctions'
import { DATA_COLLECTION_NAME, RULES_COLLECTION_NAME } from 'db/constants'
// import { toBoolean, isEmpty } from 'validator'
// import { isNil, mergeRight } from 'ramda'

// eslint-disable-next-line
import { red, green, logRequest } from 'logger'

// const isEmptyOrUndefined = val => {
//   if (isNil(val)) {
//     return true
//   }
//   return isEmpty(val)
// }

const changesByDataDoc = wrap(async (req, res, next) => {
  const lookup = {
    $lookup: {
      from: RULES_COLLECTION_NAME,
      localField: 'rules',
      foreignField: '_id',
      as: 'fullRules'
    }
  }

  const group1 = {
    $group: {
      _id: '$description',
      orig: { $push: '$origDescription' },
      rules: { $addToSet: '$fullRules' }
      // rules: '$fullRules'
    }
  }
  // const q = [lookup]
  const q = [lookup, group1]

  const ret = await executeAggregate(DATA_COLLECTION_NAME, q)
  res.send(ret)
})

export default changesByDataDoc

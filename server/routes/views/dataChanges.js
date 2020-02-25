import wrap from 'routes/wrap'
import { executeAggregate } from 'db/dbFunctions'
import { DATA_COLLECTION_NAME /*, RULES_COLLECTION_NAME */ } from 'db/constants'

// eslint-disable-next-line
import { red, green, logRequest } from 'logger'

const changesByDataDoc = wrap(async (req, res, next) => {
  const group1 = {
    $group: {
      _id: '$description',
      orig: { $push: '$origDescription' },
      rules: { $addToSet: '$rules' }
    }
  }
  const q = [group1]

  const ret = await executeAggregate(DATA_COLLECTION_NAME, q)

  const a = ret.map(r => {
    const flatRules = r.rules.flat()
    const x = {
      _id: r._id,
      orig: r.orig,
      rules: flatRules
    }
    return x
  })
  res.send(a)
})

export default changesByDataDoc

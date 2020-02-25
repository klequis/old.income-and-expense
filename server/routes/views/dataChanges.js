import wrap from 'routes/wrap'
import { executeAggregate } from 'db/dbFunctions'
import { DATA_COLLECTION_NAME /*, RULES_COLLECTION_NAME */ } from 'db/constants'
import { sortBy, compose, toLower, prop } from 'ramda'

// eslint-disable-next-line
import { red, green, logRequest } from 'logger'

// const sortByNameCaseInsensitive = sortBy(compose(toLower, prop('name')))

const sortByOrig = sortBy(compose(toLower, prop('_id')))

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
  const b = sortByOrig(a)
  res.send(b)
})

export default changesByDataDoc

import wrap from 'routes/wrap'
import { findById } from 'db/dbFunctions'
import { RULES_COLLECTION_NAME } from 'db/constants'

// eslint-disable-next-line
import { red, green, yellow, logRequest } from 'logger'

const ruleGet = wrap(async (req, res) => {
  const { params } = req
  const { ruleid } = params
  const f = await findById(RULES_COLLECTION_NAME, ruleid)
  res.send(f)
})

export default ruleGet

import wrap from 'routes/wrap'
import { findById } from 'db/dbFunctions'
import { RULES_COLLECTION_NAME } from 'db/constants'

// eslint-disable-next-line
import { red, green, yellow, logRequest } from 'logger'

const getRules = wrap(async (req, res) => {
  const { params } = req
  const { ruleid } = params
  const f = await findById(RULES_COLLECTION_NAME, ruleid)

  // console.group('get-rule.getRules')
  // yellow('params', params)
  // yellow('ruleid', ruleid)
  // yellow('f', f)
  // console.groupEnd()
  res.send(f)
})

export default getRules

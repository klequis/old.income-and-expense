import wrap from 'routes/wrap'
import { find } from 'db/dbFunctions'
import { RULES_COLLECTION_NAME } from 'db/constants'

// eslint-disable-next-line
import { red, green, yellow, logRequest } from 'logger'

const getRules = wrap(async (req, res) => {
  const f = await find(RULES_COLLECTION_NAME, {})
  res.send(f)
})

export default getRules

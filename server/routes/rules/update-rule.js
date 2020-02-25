import wrap from 'routes/wrap'
import { RULES_COLLECTION_NAME } from 'db/constants'
import { findOneAndUpdate } from 'db'

// eslint-disable-next-line
import { red, green, yellow, logRequest } from 'logger'

// TODO: add 'findOneAndRepalce()' to dbFunctions.js

// TODO: s/b singular 'updateRule'
const updateRule = wrap(async (req, res) => {
  const { body, params } = req
  const { _id: bodyId } = body
  const { ruleId: paramsId } = params
  yellow('bodyId', bodyId)
  yellow('paramsId', paramsId)
  // TODO: use findOneAndReplace()

  // const r = await findOneAndUpdate(
  //   RULES_COLLECTION_NAME,
  //   { _id },

  // )
  res.send('hi')
})

export default updateRule

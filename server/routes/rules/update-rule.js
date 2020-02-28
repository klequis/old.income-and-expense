import wrap from 'routes/wrap'
import { RULES_COLLECTION_NAME } from 'db/constants'
import { findOneAndUpdate } from 'db'

// eslint-disable-next-line
import { red, green, yellow, logRequest } from 'logger'

const updateRule = wrap(async (req, res) => {
  const { body, params } = req
  const { _id: bodyId } = body
  const { ruleid: paramsId } = params
  yellow('bodyId', bodyId)
  yellow('paramsId', paramsId)
  yellow('body', body)
  const { criteria, actions } = body
  yellow('criteria', criteria)
  yellow('actions', actions)

  const r = await findOneAndUpdate(
    RULES_COLLECTION_NAME,
    { _id: paramsId },
    {
      $set: { criteria: criteria, actions: actions }
      // $set: { ac}
    }
  )
  green('r', r)
  res.send('hi')
})

export default updateRule

import wrap from 'routes/wrap'
import { RULES_COLLECTION_NAME } from 'db/constants'
import { find, findOneAndUpdate } from 'db'
import runRules from 'actions/run-rules'

// eslint-disable-next-line
import { red, redf, green, yellow, logRequest } from 'logger'

const updateRule = wrap(async (req, res) => {
  try {
  const { body, params } = req
  const { criteria, actions } = body
  const { ruleid: paramsId } = params
  // const { _id: bodyId } = body
  // yellow('bodyId', bodyId)
  // yellow('paramsId', paramsId)
  // yellow('body', body)
  // yellow('criteria', criteria)
  // yellow('actions', actions)

  const r = await findOneAndUpdate(
    RULES_COLLECTION_NAME,
    { _id: paramsId },
    {
      $set: { criteria: criteria, actions: actions }
    }
  )
  // green('r', r)
  await runRules(body)

  res.send('hi')
} catch (e) {
  redf('updateRule ERROR', e.message)
  console.log(e)
}
})

export default updateRule

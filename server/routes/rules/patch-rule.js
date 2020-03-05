import wrap from 'routes/wrap'
import { RULES_COLLECTION_NAME } from 'db/constants'
import { findOneAndUpdate } from 'db'
import runRules from 'actions/run-rules'
import { toString } from 'lib'

// eslint-disable-next-line
import { red, redf, green, yellow, logRequest } from 'logger'

const patchRule = wrap(async (req, res) => {
  try {
    const { body, params } = req

    const newRule = body
    const { _id, criteria, actions } = newRule
    const { ruleid: paramsId } = params

    if (toString(paramsId) !== toString(_id)) {
      throw new Error(
        `_id in params ${paramsId} does not match _id in body ${_id}`
      )
    }

    const updatedRule = await findOneAndUpdate(
      RULES_COLLECTION_NAME,
      { _id: paramsId },
      {
        $set: { criteria: criteria, actions: actions }
      },
      false
    )
    yellow('updatedRule', updatedRule)
    await runRules(updatedRule)
    res.send(updatedRule)
  } catch (e) {
    redf('updateRule ERROR', e.message)
    console.log(e)
  }
})

export default patchRule

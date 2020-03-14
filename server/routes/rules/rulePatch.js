import wrap from 'routes/wrap'
import { DATA_COLLECTION_NAME, RULES_COLLECTION_NAME } from 'db/constants'
import { findOneAndUpdate, find, updateMany } from 'db'
import runRules from 'actions/runRules'
import { toString } from 'lib'
import { ObjectId } from 'mongodb'

// eslint-disable-next-line
import { red, redf, green, yellow, logRequest } from 'logger'

const rulePatch = wrap(async (req, res) => {
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

    const f = await find(DATA_COLLECTION_NAME, {
      ruleIds: ObjectId.createFromHexString(_id)
    })
    green('f', f)
    const um = await updateMany(DATA_COLLECTION_NAME, {
      ruleIds: ObjectId.createFromHexString(_id)
    },
    {
      $pull: { ruleIds: ObjectId.createFromHexString(_id) }
    })

    green('um', um)

    // so update all the f's to remove the current ID

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
    // findOneAndUpdate returns an array even though it always returns one item.
    // Send only the item to the client
    res.send(updatedRule[0])
  } catch (e) {
    redf('updateRule ERROR', e.message)
    console.log(e)
  }
})

export default rulePatch

import wrap from 'routes/wrap'
import { DATA_COLLECTION_NAME, RULES_COLLECTION_NAME } from 'db/constants'

import { findOneAndUpdate, find, updateMany, executeAggregate } from 'db'
import runRules from 'actions/runRules'
import { toString } from 'lib'
import { ObjectId } from 'mongodb'

/*
  rulePatch can receive a rule with
  a. updated criteria
  b. updated action
  c. new action
  d. removed action

  1. remove the ruleId of the passed in rule from all docs in data that have it
     - it will get added back when the rules are run
  2. update the rule
  3. run all rules

  Since runRules always modifies 'origDescription', there is no need to restore
  'description' to 'origDescription'

*/

// eslint-disable-next-line
import { red, redf, green, yellow, logRequest } from 'logger'

const rulePatch = wrap(async (req, res) => {
  console.log()
  console.log()
  console.log()
  yellow('-----------')
  yellow('new')
  yellow('-----------')
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

    yellow('rulePatch: paramsId', paramsId)

    const id = ObjectId.createFromHexString(_id)

    const f = await find(DATA_COLLECTION_NAME, {
      ruleIds: id
    })

    for (let i = 0; i < f.length; i++) {
      const doc = f[i]
      const { _id, origDescription } = doc
      const foau = await findOneAndUpdate(
        DATA_COLLECTION_NAME,
        { _id: _id },
        {
          $pull: { ruleIds: id },
          $unset: { category1: '', category2: '' },
          $set: { description: origDescription }
        }
      )
      green('updated', foau)
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

    await runRules()
    // findOneAndUpdate returns an array even though it always returns one item.
    // Send only the item to the client
    res.send({ tmp: 'hi' })
    // res.send(updatedRule[0])
  } catch (e) {
    redf('updateRule ERROR', e.message)
    console.log(e)
  }
})

export default rulePatch

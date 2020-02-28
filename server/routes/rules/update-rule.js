import wrap from 'routes/wrap'
import { RULES_COLLECTION_NAME, DATA_COLLECTION_NAME } from 'db/constants'
import { find, findOneAndUpdate } from 'db'
import runRules from 'actions/run-rules'
import { ObjectID } from 'mongodb'
import { difference } from 'ramda'

// eslint-disable-next-line
import { red, redf, green, yellow, logRequest } from 'logger'

const updateRule = wrap(async (req, res) => {
  try {
    const { body, params } = req

    const newRule = body
    const { _id, criteria, actions } = newRule
    const { ruleid: paramsId } = params
    // const { _id: bodyId } = body
    // yellow('bodyId', bodyId)
    // yellow('paramsId', paramsId)
    // yellow('body', body)
    yellow('criteria', criteria)
    // yellow('actions', actions)

    if (paramsId !== _id) {
      throw new Error(
        `_id in params ${paramsId} does not match _id in body ${_id}`
      )
    }
    const dataDocsBefore = await find(DATA_COLLECTION_NAME, { rules: new ObjectID(_id) })
    // green('dataDocsBefore', dataDocsBefore)

    const updatedRule = await findOneAndUpdate(
      RULES_COLLECTION_NAME,
      { _id: paramsId },
      {
        $set: { criteria: criteria, actions: actions }
      }
    )
    // green('updateRule', updatedRule)
    await runRules(updatedRule)

    const dataDocsAfter = await find(DATA_COLLECTION_NAME, { rules: new ObjectID(_id) })
    yellow(`diff count`, `before: ${dataDocsBefore.length}, after ${dataDocsAfter.length}`)
    const diff = difference(dataDocsBefore, dataDocsAfter)
    green('diff', diff)

    res.send('hi')
  } catch (e) {
    redf('updateRule ERROR', e.message)
    console.log(e)
  }
})

export default updateRule

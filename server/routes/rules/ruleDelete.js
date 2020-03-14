import wrap from 'routes/wrap'
import { DATA_COLLECTION_NAME, RULES_COLLECTION_NAME } from 'db/constants'
import { findOneAndDelete, find, updateMany } from 'db'
import runRules from 'actions/runRules'
import { ObjectId } from 'mongodb'
import { green, redf } from 'logger'

const ruleDelete = wrap(async (req, res) => {
  try {
    const { params } = req
    const { ruleid } = params
    const id = ObjectId.createFromHexString(ruleid)
    const rulesFound = await find(RULES_COLLECTION_NAME, { _id: id })
    green('rulesFound', rulesFound)
    const dataFound = await find(DATA_COLLECTION_NAME, { ruleIds: id })
    green('dataFound', dataFound)
    // remove the ruleid from data collection docs
    const um = await updateMany(DATA_COLLECTION_NAME, {
      ruleIds: ObjectId.createFromHexString('5e6ad5652be3a26fa08644b7')
    },
    {
      $pull: { ruleIds: ObjectId.createFromHexString('5e6ad5652be3a26fa08644b7') }
    })
    // delete the rule
    const foad = await findOneAndDelete(RULES_COLLECTION_NAME, { _id: id })
    await runRules()
    green('foad', foad)
  } catch (e) {
    redf('ruleDelete ERROR', e.message)
    console.log(e)
  }
})

export default ruleDelete

import wrap from 'routes/wrap'
import { RULES_COLLECTION_NAME } from 'db/constants'
import { insertOne } from 'db/dbFunctions'

// eslint-disable-next-line
import { yellow, redf } from 'logger'

const newRule = wrap(async (req, res) => {
  // const { body, params } = req
  // const { } = body
  yellow('newRule: RULES_COLLE', RULES_COLLECTION_NAME)
  try {
    const rule = {
      criteria: [],
      actions: []
    }

    const inserted = await insertOne(RULES_COLLECTION_NAME, rule)
    yellow('newRule: inserted', inserted)
    res.send(inserted)
  } catch (e) {
    redf('rules.newRule.newRule: ERROR', e.message)
    console.log(e)
  }
})

export default newRule

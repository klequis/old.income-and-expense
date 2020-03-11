import wrap from 'routes/wrap'
import { RULES_COLLECTION_NAME } from 'db/constants'
import { insertOne } from 'db/dbFunctions'

// eslint-disable-next-line
import { yellow, redf } from 'logger'

const newRule = wrap(async (req, res) => {
  try {
    const rule = {
      criteria: [],
      actions: []
    }

    const i = await insertOne(RULES_COLLECTION_NAME, rule)
    yellow('newRule: i', i)
    const { _id } = i[0]

    yellow('newRule: i_id', _id)
    res.send({ _id: _id })
  } catch (e) {
    redf('rules.newRule.newRule: ERROR', e.message)
    console.log(e)
  }
})

export default newRule

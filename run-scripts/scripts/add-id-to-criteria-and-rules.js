import wrap from 'routes/wrap'
import { RULES_COLLECTION_NAME } from 'db/constants'
import { findOneAndUpdate } from 'db'

// eslint-disable-next-line
import { red, green, yellow, logRequest } from 'logger'

const updateRules = wrap(async (req, res) => {
  const { body, params } = req
  const { _id } = body


  // 1. use copyTo() to duplicate the collection
  // 1.c copyTo('rules-copy-[timestamp]')

  // 2. rupdate all rules
  const r = await findOneAndUpdate(
    RULES_COLLECTION_NAME,
    { _id },

    
  )
})

export default updateRules

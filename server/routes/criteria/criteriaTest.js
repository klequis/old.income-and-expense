import wrap from 'routes/wrap'
import { find } from 'db'
import { DATA_COLLECTION_NAME } from 'db/constants'
import { filterBuilder } from 'actions/actionUtils'

// eslint-disable-next-line
import { redf, green, logRequest } from 'logger'

const criteriaTest = wrap(async (req, res, next) => {
  try {
    const { body } = req
    // body is an array
    green('body', body)

    if (body.length < 1) {
      redf('criteriaTest', 'body.length is 0')
    }

    const filter = filterBuilder(body)
    const data = await find(DATA_COLLECTION_NAME, filter)
    const descriptionsOnly = data.map(doc => doc.description)
    // green('descriptionsOnly', descriptionsOnly)
    res.send(descriptionsOnly)
  } catch (e) {
    redf('criteriaTest ERROR', e.message)
    console.log(e)
  }
})

export default criteriaTest

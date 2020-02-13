import wrap from 'routes/wrap'
import { find } from 'db'
import { CATEGORIES_COLLECTION_NAME } from 'db/constants'

// esling-disble-next-line
import { green, logRequest } from 'logger'

/**
 * @returns {object} [{ _id, title, completed }] and array of all todos
 */
const categories = wrap(async (req, res, next) => {
  const data = await find(CATEGORIES_COLLECTION_NAME, {})
  res.send(data)
})

export default categories

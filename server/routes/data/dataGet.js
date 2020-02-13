import wrap from 'routes/wrap'
import { find } from 'db'
import { DATA_COLLECTION_NAME } from 'db/constants'
import { toBoolean, isEmpty } from 'validator'
import { isNil, mergeRight } from 'ramda'

// eslint-disable-next-line
import { red, green, logRequest } from 'logger'

const isEmptyOrUndefined = val => {
  if (isNil(val)) {
    return true
  }
  return isEmpty(val)
}

/**
//  * @returns {object} [{ _id, title, completed }] and array of all todos
 */
const dataGet = wrap(async (req, res, next) => {
  const { params } = req
  // green('params', params)
  const { description, showOmitted } = params
  // const is = isEmptyOrUndefined(description)
  // green('** is', is)
  // green('description', `value:${description} is a ${typeof description}`)
  // green('showOmitted', `value:${showOmitted} is a ${typeof showOmitted}`)

  //
  const desc = isEmptyOrUndefined(description)
    ? {}
    : { description: { $regex: description, $options: 'im' } }
  const omitted = toBoolean(showOmitted)
    ? {}
    : { omit: false }
  const filter = mergeRight(desc, omitted)
  // green('filter', filter)
  //

  // let f
  // const bDesc = isEmptyOrUndefined(description)
  // const bOmitted = toBoolean(showOmitted)
  // if (isEmptyOrUndefined(description) && showOmitted === false) {
  //   // description = '' && showOmitted = false
  //   f = { omit: false }
  // } else if (isEmptyOrUndefined(description) && showOmitted === true) {
  //   // description = '' && showOmitted = true
  //   f = {}
  // } else if (isEmptyOrUndefined(description) && showOmitted === false) {
  //   // description = ATM && omitted = false
  //   f = {
  //     description: { $regex: description, $options: 'im' },
  //     omit: false
  //   }
  // } else if (isEmptyOrUndefined(description) && showOmitted === true) {
  //   // description = ATM && omitted = true
  //   f = { description: { $regex: description, $options: 'im' } }
  // } else {
  //   red('failed')
  // }

  const data = await find(DATA_COLLECTION_NAME, filter)

  res.send(data)
})

export default dataGet

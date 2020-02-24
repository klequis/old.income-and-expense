import wrap from 'routes/wrap'
import { find } from 'db'
import { DATA_COLLECTION_NAME } from 'db/constants'
import { toBoolean, isEmpty } from 'validator'
import { isNil, mergeRight } from 'ramda'
import { filterBuilder } from 'actions/action-utils'

// eslint-disable-next-line
import { red, green, logRequest } from 'logger'

const isEmptyOrUndefined = val => {
  if (isNil(val)) {
    return true
  }
  return isEmpty(val)
}

const dataGetByCriteria = wrap(async (req, res, next) => {
  const { body } = req
  // body is an array
  green('body', body)

  const { field, operation, value } = body
  const filter = filterBuilder([{ field, operation, value }])
  const data = await find(DATA_COLLECTION_NAME, filter)
  res.send(data)
})

export default dataGetByCriteria

/*
  - produce when running rules


*/
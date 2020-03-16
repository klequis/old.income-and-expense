import {
  RULE_CREATE_KEY,
  RULE_CREATE_REQUEST_KEY,
  RULE_DELETE_REQUEST_KEY,
  RULES_READ_KEY,
  RULE_READ_BY_ID_REQUEST_KEY,
  RULES_READ_REQUEST_KEY,
  RULE_UPDATE_REQUEST_KEY,
  RULE_UPDATE_KEY,
  RULETMP_ADD_KEY,
  RULETMP_REMOVE_KEY,
  RULETMP_UPDATE_KEY
} from './constants'
import { setToast } from 'store/toast/actions'
import { createRequestThunk } from '../action-helpers'
import api from 'api'
import { TOAST_WARN } from 'global-constants'

// eslint-disable-next-line
import { orange } from 'logger'


// export const ruleNew = newRule => {
//   return {
//     type: RULE_NEW_KEY,
//     payload: newRule
//   }
// }

// export const ruleCreate = newRule => {
//   return {
//     type: RULE_CREATE_KEY,
//     payload: newRule
//   }
// }

export const ruleTmpAdd = data => {
  // orange('ruleTmpAdd: data', data)
  return {
    type: RULETMP_ADD_KEY,
    payload: data
  }
}

export const ruleTmpUpdate = data => {
  return {
    type: RULETMP_UPDATE_KEY,
    payload: data
  }
}

export const ruleTmpRemove = (ruleId) => {
  return {
    type: RULETMP_REMOVE_KEY,
    payload: { ruleId }
  }
}

const rulesRead = data => {
  return {
    type: RULES_READ_KEY,
    payload: data
  }
}

export const ruleReadByIdRequest = createRequestThunk({
  request: api.rules.readById,
  key: RULE_READ_BY_ID_REQUEST_KEY,
  success: [rulesRead],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not get rules', level: TOAST_WARN })
  ]
})

const ruleUpdate = data => {
  return {
    type: RULE_UPDATE_KEY,
    payload: data
  }
}

export const rulesReadRequest = createRequestThunk({
  request: api.rules.read,
  key: RULES_READ_REQUEST_KEY,
  success: [rulesRead],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not get data', level: TOAST_WARN })
  ]
})

export const ruleCreateRequest = createRequestThunk({
  request: api.rules.create,
  key: RULE_CREATE_REQUEST_KEY,
  // a successful create will always return [rule]
  success: [(data) => rulesReadRequest(data)],
  failure: [
    e =>
      setToast({
        error: e,
        message: 'Some fields need attention',
        level: TOAST_WARN
      })
  ]
})

// Delete
export const ruleDeleteRequest = createRequestThunk({
  request: api.rules.delete,
  key: RULE_DELETE_REQUEST_KEY,
  success: [rule => rulesReadRequest(rule[0]._id)],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not deleteRule', level: TOAST_WARN })
  ]
})

export const ruleUpdateRequest = createRequestThunk({
  request: api.rules.update,
  key: RULE_UPDATE_REQUEST_KEY,
  success: [ruleUpdate],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not get data', level: TOAST_WARN })
  ]
})

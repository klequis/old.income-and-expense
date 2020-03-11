import {
  RULES_READ_KEY,
  RULE_CREATE_KEY,
  RULE_UPDATE_KEY,
  RULE_NEW_KEY,
  RULETMP_ADD_KEY,
  RULETMP_REMOVE_KEY,
  RULETMP_UPDATE_KEY
} from './constants'
import { findIndex, propEq, insert, remove } from 'ramda'

// eslint-disable-next-line
import { blue } from 'logger'
import { ruleTmpAdd } from './actions'

const replaceRule = (newRule, rules) => {
  const { _id } = newRule
  const idx = findIndex(propEq('_id', _id))(rules)
  const newRules = insert(idx, newRule, remove(idx, 1, rules))
  return newRules
}

const removeRule = (ruleId, rules) => {
  const idx = findIndex(propEq('_id', ruleId))(rules)
  const newRules = remove(idx, 1, rules)
  return newRules
}

export function rulesReducer(state = [], { type, payload }) {
  switch (type) {
    case RULES_READ_KEY:
      return payload
    case RULE_CREATE_KEY:
      throw new Error('RULE_CREATE_KEY return is undefined')
    case RULE_UPDATE_KEY:
      // Will receive 1 rule. Replace rule with same id
      return replaceRule(payload, state)
    default:
      return state
  }
}

export const ruleNewReducer = (state = [], { type, payload }) => {
  switch (type) {
    case RULE_NEW_KEY:
      return payload
    default:
      return state
  }
}

/**
 * 
 * @param {array} state ruleTmp state is an object
 * @param {string} type
 * @param {object || string} payload. Payload is an object for ADD & UPDATE
 *                                    and a string id for REMOVE
 */

export const ruleTmpReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case RULETMP_ADD_KEY:
      console.group()
      blue('ruleTmpReducer: state', state)
      blue('ruleTmpReducer: type', type)
      blue('ruleTmpReducer: payload', payload)
      console.groupEnd()
      return payload
    case RULETMP_REMOVE_KEY:
      return removeRule(payload, state)
    case RULETMP_UPDATE_KEY:
      // update is a replace
      return replaceRule(payload, state)
    default:
      return state
  }
}

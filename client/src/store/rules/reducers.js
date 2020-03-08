import { RULES_READ_KEY, RULE_CREATE_KEY, RULE_UPDATE_KEY, RULE_NEW_KEY } from './constants'
import { findIndex, propEq, insert, remove } from 'ramda'

// eslint-disable-next-line
import { blue } from 'logger'

const replaceRule = (newRule, rules) => {
  const { _id } = newRule
  const idx = findIndex(propEq('_id', _id))(rules)
  const newRules = insert(idx, newRule,remove(idx, 1, rules))
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
      blue('rulesReducer: action.payload', payload)
      blue('rulesReducer: state', state)
      const a = replaceRule(payload, state)
      blue('a', a)
      return a
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

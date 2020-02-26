import { RULES_READ_KEY, RULE_CREATE_KEY, RULE_UPDATE_KEY } from './constants'

// eslint-disable-next-line
import { blue } from 'logger'

export function rulesReducer(state = [], action) {
  switch (action.type) {
    case RULES_READ_KEY:
      return action.payload
    case RULE_CREATE_KEY:
      throw new Error('RULE_CREATE_KEY return is undefined')
    case RULE_UPDATE_KEY:
      break
    default:
      return state
  }
}

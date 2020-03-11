import { startsWith } from 'ramda'

// eslint-disable-next-line
import { yellow } from 'logger'


export function getRules(state) {
  return state.rules
}

export const getRuleById = (state, _id) => {
  if (startsWith('tmp_', _id)) {
    return state.ruleTmp
  }
  return state.rules.find(r => r._id === _id )
}

export const getNewRule = (state) => {
  return state.newRule
}
// eslint-disable-next-line
import { yellow } from 'logger'
import { startsWith } from 'ramda'

export function getRules(state) {
  return state.rules
}

export const getRuleById = (state, _id) => {
  if ( startsWith('tmp_', _id)) {
    return state.ruleTmp
  }
  return state.rules.find(r => r._id === _id )
}

export const getNewRule = (state) => {
  return state.newRule
}
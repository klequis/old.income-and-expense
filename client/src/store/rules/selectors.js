import isTmpRule from 'lib/isTmpRule'
import getRule from 'lib/getRule'

// eslint-disable-next-line
import { yellow } from 'logger'

export function getRules(state) {
  return state.rules
}

export const getRuleById = (state, _id) => {
  // yellow('getRuleById: state', state)
  yellow('getRuleById: _id', _id)
  if (isTmpRule(_id)) {
    const a = getRule(_id, state.ruleTmp)
    return a
  }
  const o = state.rules.find(r => {
    return r._id === _id
  })
  return o
}

export const getNewRule = state => {
  return state.newRule
}

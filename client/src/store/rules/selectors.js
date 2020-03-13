import { startsWith } from 'ramda'

// eslint-disable-next-line
import { yellow } from 'logger'

export function getRules(state) {
  return state.rules
}

export const getRuleById = (state, _id) => {
  // yellow('getRuleById: state', state)
  // yellow('getRuleById: _id', _id)
  if (startsWith('tmp_', _id)) {
    const a = state.ruleTmp
    return a
  }
  const o = state.rules.find(r => {
    // yellow('getRuleById: r', r)
    // yellow('getRuleById: r._id', r._id)
    // yellow('getRuleById: _id', _id)
    return r._id === _id
  })
  // yellow('getRuleById: o', o)
  return o
}

export const getNewRule = state => {
  return state.newRule
}

export const getRuleTmp = state => {
  return state.ruleTmp
}

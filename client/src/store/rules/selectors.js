// eslint-disable-next-line
import { yellow } from 'logger'

export function getRules(state) {
  return state.rules
}

export const getRuleById = (state, _id) => {
  const o = state.rules.find(r => r._id === _id )
  return o
}

export const getNewRule = (state) => {
  return state.newRule
}
export function getRules(state) {
  return state.rules
}

export const getRule = (state, _id) => {
  return state.rules.find(r => r._id === _id )
}

export const getNewRule = (state) => {
  return state.newRule
}
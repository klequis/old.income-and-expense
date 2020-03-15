import { findIndex, propEq } from 'ramda'
import { green } from 'logger'

const getRule = (ruleId, rules) => {
  green('getRule: ruleId', ruleId)
  green('getRule: rules', rules)
  const idx = findIndex(propEq('_id', ruleId))(rules)
  green('getRule: idx', idx)

  return rules[idx]
}

export default getRule
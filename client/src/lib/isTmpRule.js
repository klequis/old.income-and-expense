import { startsWith } from 'ramda'

const isTmpRule = ruleId => {
  return startsWith('tmp_', ruleId)
}

export default isTmpRule
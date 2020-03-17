import { startsWith } from 'ramda'
import { blue } from 'logger'


const isTmpRule = ruleId => {
  blue('ruleId', ruleId)
  return startsWith('tmp_', ruleId)
}

export default isTmpRule
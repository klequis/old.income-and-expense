import { startsWith } from 'ramda'

// eslint-disable-next-line
import { yellow } from 'logger'


export function getCriteriaTestResults(state) {
  return state.criteriaTestResults || []
}

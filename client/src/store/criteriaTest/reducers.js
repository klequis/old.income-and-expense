import { CRITERIA_TEST_CLEAR_KEY, CRITERIA_TEST_READ_KEY } from './constants'

// eslint-disable-next-line
import { blue } from 'logger'

export const criteriaTestReducer = (state = [], { type, payload }) => {
  switch (type) {
    case CRITERIA_TEST_READ_KEY:
      console.group(criteriaTestReducer)
      blue('state', state)
      blue('type', type)
      blue('payload', payload)
      console.groupEnd()
      
      return payload
    case CRITERIA_TEST_CLEAR_KEY:
      return []
    default:
      return state
  }
}

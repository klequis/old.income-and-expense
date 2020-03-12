import { CRITERIA_TEST_READ_KEY } from './constants'

// eslint-disable-next-line
import { blue } from 'logger'

export const criteriaTestReducer = (state = [], { type, payload }) => {
  switch (type) {
    case CRITERIA_TEST_READ_KEY:
      return payload
    default:
      return state
  }
}

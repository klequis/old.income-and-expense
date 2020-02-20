import { CATEGORY_REPORT_READ_KEY } from './constants'

// eslint-disable-next-line
import { blue } from 'logger'

export function categoryReportReducer(
  state = [],
  action
) {
  switch (action.type) {
    case CATEGORY_REPORT_READ_KEY:
      return action.payload
    default:
      return state
  }
}
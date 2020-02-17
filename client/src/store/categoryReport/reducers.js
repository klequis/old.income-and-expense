import { CATEGORY_REPORT_READ_KEY } from './constants'
import { blue } from 'logger'

export function categoryReportReducer(
  state = [],
  action
) {
  switch (action.type) {
    case CATEGORY_REPORT_READ_KEY:
      blue('state', state)
      blue('action', action)
      return action.payload
    default:
      return state
  }
}
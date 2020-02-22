import {
  AMOUNT_BY_CATEGORY_READ_KEY,
  CHANGES_BY_DATA_DOC_READ_KEY
} from './constants'

// eslint-disable-next-line
import { blue } from 'logger'

export function amountByCategoryReducer(state = [], action) {
  switch (action.type) {
    case AMOUNT_BY_CATEGORY_READ_KEY:
      return action.payload
    default:
      return state
  }
}

export function changesByDataDocReducer(state = [], action) {
  switch (action.type) {
    case CHANGES_BY_DATA_DOC_READ_KEY:
      return action.payload
    default:
      return state
  }
}

import {
  VIEW_READ_KEY
} from './constants'

// // eslint-disable-next-line
// import { blue } from 'logger'

// export function amountByCategoryReducer(state = [], action) {
//   switch (action.type) {
//     case AMOUNT_BY_CATEGORY_READ_KEY:
//       return action.payload
//     default:
//       return state
//   }
// }

// export function dataChangesReducer(state = [], action) {
//   switch (action.type) {
//     case DATA_CHANGES_READ_KEY:
//       return action.payload
//     default:
//       return state
//   }
// }

// export function allDataByDescriptionReducer(state = [], action) {
//   switch (action.type) {
//     case VIEW_READ_KEY:
//       return action.payload
//     default:
//       return state
//   }
// }

export const viewDataReducer = (state = [], { type, payload }) => {
  switch (type) {
    case VIEW_READ_KEY:
      return payload
    default:
      return state
  }
}

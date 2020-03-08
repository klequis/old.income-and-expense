import { combineReducers } from 'redux'
import { dataReducer } from './data/reducers'
import { requestsReducer } from './requests/reducers'
import { toastReducer } from './toast/reducers'
import { validationErrorsReducer } from './validation/reducers'
import { userReducer } from './user/reducers'
import { amountByCategoryReducer, dataChangesReducer, allDataByDescriptionReducer } from './views/reducers'
import { rulesReducer, ruleNewReducer } from './rules/reducers'

const rootReducer = combineReducers({
  data: dataReducer,
  allDataByDescription: allDataByDescriptionReducer,
  amountByCategory: amountByCategoryReducer,
  dataChanges: dataChangesReducer,
  requests: requestsReducer,
  rules: rulesReducer,
  ruleNew: ruleNewReducer,
  toast: toastReducer,
  validationErrors: validationErrorsReducer,
  userId: userReducer
})

export default rootReducer

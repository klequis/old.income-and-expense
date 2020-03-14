import { combineReducers } from 'redux'
import { dataReducer } from './data/reducers'
import { requestsReducer } from './requests/reducers'
import { toastReducer } from './toast/reducers'
import { validationErrorsReducer } from './validation/reducers'
import { userReducer } from './user/reducers'
import {
  viewDataReducer
} from './views/reducers'
import { rulesReducer, /*ruleNewReducer,*/ ruleTmpReducer } from './rules/reducers'
import { criteriaTestReducer } from './criteriaTest/reducers'

const rootReducer = combineReducers({
  viewData: viewDataReducer,
  criteriaTestResults: criteriaTestReducer,
  requests: requestsReducer,
  rules: rulesReducer,
  ruleTmp: ruleTmpReducer,
  toast: toastReducer,
  validationErrors: validationErrorsReducer,
  userId: userReducer
})

export default rootReducer

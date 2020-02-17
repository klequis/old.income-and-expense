import { combineReducers } from 'redux'
import { dataReducer } from './data/reducers'
import { requestsReducer } from './requests/reducers'
import { toastReducer } from './toast/reducers'
import { validationErrorsReducer } from './validation/reducers'
import { userReducer } from './user/reducers'
import { categoryReportReducer } from './categoryReport/reducers'

const rootReducer = combineReducers({
  data: dataReducer,
  categoryReportData: categoryReportReducer,
  requests: requestsReducer,
  toast: toastReducer,
  validationErrors: validationErrorsReducer,
  userId: userReducer
})

export default rootReducer

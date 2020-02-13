import { combineReducers } from 'redux'
import { dataReducer } from './data/reducers'
import { requestsReducer } from './requests/reducers'
import { toastReducer } from './toast/reducers'
import { validationErrorsReducer } from './validation/reducers'
import { userReducer } from './user/reducers'


const rootReducer = combineReducers({
  data: dataReducer,
  requests: requestsReducer,
  toast: toastReducer,
  validationErrors: validationErrorsReducer,
  userId: userReducer
})

export default rootReducer

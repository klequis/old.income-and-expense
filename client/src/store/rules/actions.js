import {
  RULES_READ_KEY,
  RULES_READ_REQUEST_KEY
} from './constants'
import { setToast } from 'store/toast/actions'
import { createRequestThunk } from '../action-helpers'
import api from 'api'
import { TOAST_WARN } from 'global-constants'
import { yellow } from 'logger'

export const rulesRead = data => {
  yellow('rulesRead: data', data)

  return {
    type: RULES_READ_KEY,
    payload: data
  }
}

export const rulesReadRequest = createRequestThunk({
  request: api.rules.read,
  key: RULES_READ_REQUEST_KEY,
  success: [rulesRead],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not get data', level: TOAST_WARN })
  ]
})

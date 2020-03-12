import {
  CRITERIA_TEST_READ_KEY,
  CRITERIA_TEST_READ_REQUEST_KEY,
  CRITERIA_TEST_CLEAR_KEY
} from './constants'
import { setToast } from 'store/toast/actions'
import { createRequestThunk } from '../action-helpers'
import api from 'api'
import { TOAST_WARN } from 'global-constants'

// eslint-disable-next-line
import { yellow } from 'logger'

const criteriaTestRead = data => {
  return {
    type: CRITERIA_TEST_READ_KEY,
    payload: data
  }
}

export const criteriaTestClear = () => {
  return {
    type: CRITERIA_TEST_CLEAR_KEY
  }
}

export const criteriaTestReadRequest = createRequestThunk({
  request: api.criteria.read,
  key: CRITERIA_TEST_READ_REQUEST_KEY,
  success: [criteriaTestRead],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not get data', level: TOAST_WARN })
  ]
})

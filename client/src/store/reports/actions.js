import {
  AMOUNT_BY_CATEGORY_READ_KEY,
  AMOUNT_BY_CATEGORY_READ_REQUEST_KEY,
  CHANGES_BY_DATA_DOC_READ_KEY,
  CHANGES_BY_DATA_DOC_READ_REQUEST_KEY
} from './constants'
import { setToast } from 'store/toast/actions'
import { createRequestThunk } from '../action-helpers'
import api from 'api'
import { TOAST_WARN } from 'global-constants'
import { yellow } from 'logger'

export const amountByCategoryRead = data => {
  yellow('amountByCategoryRead: data', data)

  return {
    type: AMOUNT_BY_CATEGORY_READ_KEY,
    payload: data
  }
}

export const changesByDataDocRead = data => {
  // yellow('changesByDataDocRead: data', data)

  return {
    type: CHANGES_BY_DATA_DOC_READ_KEY,
    payload: data
  }
}

export const amountByCategoryReadRequest = createRequestThunk({
  request: api.reports.read,
  key: AMOUNT_BY_CATEGORY_READ_REQUEST_KEY,
  success: [amountByCategoryRead],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not get data', level: TOAST_WARN })
  ]
})

export const changesByDataDocReadRequest = createRequestThunk({
  request: api.reports.read,
  key: CHANGES_BY_DATA_DOC_READ_REQUEST_KEY,
  success: [changesByDataDocRead],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not get data', level: TOAST_WARN })
  ]
})



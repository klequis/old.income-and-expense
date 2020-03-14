import {
  VIEW_READ_KEY,
  VIEW_READ_REQUEST_KEY,
  AMOUNT_BY_CATEGORY_READ_KEY,
  AMOUNT_BY_CATEGORY_READ_REQUEST_KEY,
  DATA_CHANGES_READ_KEY,
  DATA_CHANGES_READ_REQUEST_KEY
} from './constants'
import { setToast } from 'store/toast/actions'
import { createRequestThunk } from '../action-helpers'
import api from 'api'
import { TOAST_WARN } from 'global-constants'
import { yellow } from 'logger'

export const amountByCategoryRead = data => {

  return {
    type: AMOUNT_BY_CATEGORY_READ_KEY,
    payload: data
  }
}

const dataChangesRead = data => {
  // yellow('changesByDataDocRead: data', data)

  return {
    type: DATA_CHANGES_READ_KEY,
    payload: data
  }
}

const viewRead = data => {
  return {
    type: VIEW_READ_KEY,
    payload: data
  }
}

export const amountByCategoryReadRequest = createRequestThunk({
  request: api.views.read,
  key: AMOUNT_BY_CATEGORY_READ_REQUEST_KEY,
  success: [amountByCategoryRead],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not get data', level: TOAST_WARN })
  ]
})

export const dataChangesReadRequest = createRequestThunk({
  request: api.views.read,
  key: DATA_CHANGES_READ_REQUEST_KEY,
  success: [dataChangesRead],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not get data', level: TOAST_WARN })
  ]
})

export const viewReadRequest = createRequestThunk({
  request: api.views.read,
  key: VIEW_READ_REQUEST_KEY,
  success: [viewRead],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not get data', level: TOAST_WARN })
  ]

})



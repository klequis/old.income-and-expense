import {
  CATEGORY_REPORT_READ_KEY,
  CATEGORY_REPORT_READ_REQUEST_KEY
} from './constants'
import { setToast } from 'store/toast/actions'
import { createRequestThunk } from '../action-helpers'
import api from 'api'
import { TOAST_WARN } from 'global-constants'
import { yellow } from 'logger'

export const categoryReportRead = data => {
  yellow('categoryReportRead: data', data)

  return {
    type: CATEGORY_REPORT_READ_KEY,
    payload: data
  }
}

export const categoryReportReadRequest = createRequestThunk({
  request: api.categoryReport.read,
  key: CATEGORY_REPORT_READ_REQUEST_KEY,
  success: [categoryReportRead],
  failure: [
    e =>
      setToast({ error: e, message: 'Could not get data', level: TOAST_WARN })
  ]
})

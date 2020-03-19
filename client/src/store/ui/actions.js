import {
  ROW_ID_SHOW_SET_KEY,
  ROW_ID_SHOW_CLEAR_KEY
} from './constants'
import { setToast } from 'store/toast/actions'
import { createRequestThunk } from '../action-helpers'
import api from 'api'
import { TOAST_WARN } from 'global-constants'

// eslint-disable-next-line
import { yellow } from 'logger'


export const rowIdShowSet = (tableRowId) => {
  return {
    type: ROW_ID_SHOW_SET_KEY,
    payload: tableRowId
  }
}

export const rowIdShowClear = () => {
  return {
    type: ROW_ID_SHOW_CLEAR_KEY,
  }
}
import {
  IMPORT_DATA_REQUEST_KEY,
} from './constants'
import { createRequestThunk } from '../action-helpers'
import api from 'api'
import { viewReadRequestAction } from 'store/views/actions'

// eslint-disable-next-line
import { purple, green, red } from 'logger'





// import data
export const importDataRequest = createRequestThunk({
  request: api.data.importData,
  key: IMPORT_DATA_REQUEST_KEY,
  // success: [() => dataReadRequest()],
  success: [],
  failure: [() => console.log('import fail')]
})

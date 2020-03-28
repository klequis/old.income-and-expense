export const REQUEST_PENDING = 'REQUEST_PENDING'
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
export const REQUEST_FAILURE = 'REQUEST_FAILURE'
export const TOAST_WARN = 'TOAST_WARN'
export const TOAST_INFO = 'TOAST_INFO'

export const operators = {
  beginsWith: 'beginsWith',
  contains: 'contains',
  doesNotContain: 'doesNotContain',
  equals: 'equals',
  regex: 'regex',
  // in: 'in'
}

export const dataFields = {
  description: 'description',
  type: 'type',
  credit: 'credit',
  debit: 'debit'
}

export const actionTypes = {
  replaceAll: 'replaceAll',
  categorize: 'categorize',
  omit: 'omit',
  strip: 'strip',
}

export const viewModes = {
  modeView: 'modeView',
  modeEdit: 'modeEdit',
  modeNew: 'modeNew'
}

export const dataFieldNames = {
  date: 'date',
  description: 'description',
  credit: 'credit',
  debit: 'debit',
  category1: 'category1',
  category2: 'category2',
  type: 'type',
  omit: 'omit'
}

export const sortDirections = {
  ascending: 'ascending',
  descending: 'descending'
}

export const views = {
  amountByCategory: 'amount-by-category',
  allDataByDescription: 'all-data-by-description',
  rawData: 'raw-data'
}
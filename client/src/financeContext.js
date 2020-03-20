import React, { useCallback, useContext } from 'react'
import {
  ruleTmpAddAction,
  ruleTmpUpdateAction,
  ruleTmpRemoveAction,
  rulesReadRequestAction,
  ruleCreateRequestAction,
  ruleDeleteRequestAction,
  ruleUpdateRequestAction
} from 'store/rules/actions'

import { viewReadRequestAction } from 'store/views/actions'
import { useDispatch } from 'react-redux'
import {
  criteriaTestClearAction,
  criteriaTestReadRequestAction
} from 'store/criteriaTest/actions'
import { importDataRequestAction } from 'store/import/actions'
import {
  requestPendingAction,
  requestFailedAction,
  requestSuccessAction
} from 'store/requests/actions'
import {
  rowIdShowClearAction,
  rowIdShowSetAction,
  currentViewNameClearAction,
  currentViewNameSetAction
} from 'store/ui/actions'

import isNilOrEmpty from 'lib/isNillOrEmpty'

// eslint-disable-next-line
import { red, blue } from 'logger'


const MODULE_NAME = 'financeContext'

export const FinanceContext = React.createContext()
export const useFinanceContext = () => useContext(FinanceContext)

export const FinanceProvider = ({ children }) => {
  const dispatch = useDispatch()

  const viewReadRequest = useCallback(
    async view => {
      if (isNilOrEmpty(view)) {
        throw new Error(`${MODULE_NAME} ERROR`, 'parameter view has no value')
      }
      dispatch(await viewReadRequestAction(view))
    },
    [dispatch]
  )

  const rulesReadRequest = useCallback(async () => {
    dispatch(await rulesReadRequestAction())
  }, [dispatch])

  const criteriaTestClear = () => {
    dispatch(criteriaTestClearAction())
  }

  const currentViewNameClear = () => {
    dispatch(currentViewNameClearAction())
  }

  const currentViewNameSet = (viewName) => {
    dispatch(currentViewNameSetAction(viewName))
  }

  const requestPending = key => {
    dispatch(requestPendingAction(key))
  }

  const requestSuccess = key => {
    dispatch(requestSuccessAction(key))
  }

  const requestFailed = (reason, key) => {
    dispatch(requestFailedAction(reason, key))
  }

  const criteriaTestReadRequest = useCallback(
    async criteria => {
      dispatch(await criteriaTestReadRequestAction(criteria))
    },
    [dispatch]
  )

  const importDataRequest = useCallback(async () => {
    dispatch(await importDataRequestAction())
  }, [dispatch])

  const rowIdShowClear = () => {
    dispatch(rowIdShowClearAction())
  }

  const rowIdShowSet = (ruleId) => {
    dispatch(rowIdShowSetAction(ruleId))
  }

  const ruleTmpAdd = data => {
    dispatch(ruleTmpAddAction(data))
  }

  const ruleTmpUpdate = data => {
    dispatch(ruleTmpUpdateAction(data))
  }

  const ruleTmpRemove = ruleId => {
    dispatch(ruleTmpRemoveAction(ruleId))
  }

  const ruleCreateRequest = useCallback(
    async rule => {
      dispatch(await ruleCreateRequestAction(rule))
      dispatch(await viewReadRequestAction())
      dispatch(await rulesReadRequestAction())

    },
    [dispatch]
  )

  const ruleDeleteRequest = useCallback(
    async ruleId => {
      if (isNilOrEmpty(ruleId)) {
        throw new Error('parameter ruleId is incorrect.')
      }
      dispatch(await ruleDeleteRequestAction(ruleId))
    },
    [dispatch]
  )

  const ruleUpdateRequest = useCallback(
    async (ruleId, newRule, currentViewName) => {
      blue('ruleUpdateRequest', currentViewName)
      dispatch(await ruleUpdateRequestAction(ruleId, newRule))
      blue('DONE ruleUpdateRequestAction')
      dispatch(await viewReadRequestAction(currentViewName))
      blue('DONE viewReadRequestAction')
      dispatch(await rulesReadRequestAction())
      blue('DONE rulesReadRequestAction')
    },
    [dispatch]
  )

  return (
    <FinanceContext.Provider
      value={{
        criteriaTestClear,
        criteriaTestReadRequest,
        currentViewNameClear,
        currentViewNameSet,
        importDataRequest,
        requestFailed,
        requestPending,
        requestSuccess,
        rowIdShowClear,
        rowIdShowSet,
        ruleCreateRequest,
        rulesReadRequest,
        ruleTmpAdd,
        ruleDeleteRequest,
        ruleTmpRemove,
        ruleTmpUpdate,
        ruleUpdateRequest,
        viewReadRequest
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

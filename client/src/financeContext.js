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

// eslint-disable-next-line
import { red, blue } from 'logger'

export const FinanceContext = React.createContext()
export const useFinanceContext = () => useContext(FinanceContext)

export const FinanceProvider = ({ children }) => {
  const dispatch = useDispatch()

  const viewReadRequest = useCallback(
    async view => {
      dispatch(await viewReadRequestAction(view))
    },
    [dispatch]
  )

  const rulesReadRequest = useCallback(
    async () => {
      blue('rulesReadRequest()')
      dispatch(await rulesReadRequestAction())
    },
    [dispatch]
  )

  const criteriaTestClear = () => {
    dispatch(criteriaTestClearAction())
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

  const ruleTmpAdd = data => {
    dispatch(ruleTmpAddAction(data))
  }

  const ruleTmpUpdate = data => {
    dispatch(ruleTmpUpdateAction(data))
  }

  const ruleTmpRemove = ruleId => {
    dispatch(ruleTmpRemoveAction(ruleId))
  }

  const ruleCreateRequest = useCallback(async () => {
    dispatch(await ruleCreateRequestAction())
  }, [dispatch])

  const ruleDeleteRequest = useCallback(async () => {
    dispatch(await ruleDeleteRequestAction())
  }, [dispatch])

  const ruleUpdateRequest = useCallback(
    async (ruleId, newRule) => {
      dispatch(await ruleUpdateRequestAction(ruleId, newRule))
    },
    [dispatch]
  )

  return (
    <FinanceContext.Provider
      value={{
        criteriaTestClear,
        criteriaTestReadRequest,
        importDataRequest,
        requestFailed,
        requestPending,
        requestSuccess,
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

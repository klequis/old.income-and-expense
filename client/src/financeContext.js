import React, { useEffect, useState, useContext, useCallback } from 'react'
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
import { getViewDataSelector } from 'store/views/selectors'

import { useDispatch, useSelector } from 'react-redux'

import { RULETMP_ADD_KEY } from 'store/rules/constants'

import { red, blue } from 'logger'

const MODULE_NAME = 'financeContext'

export const FinanceContext = React.createContext()
export const useFinanceContext = () => useContext(FinanceContext)

const sayHi = 'hi'

export const FinanceProvider = ({ children }) => {
  const dispatch = useDispatch()

  const viewReadRequest = useCallback(
    async view => {
      dispatch(await viewReadRequestAction(view))
    },
    [dispatch]
  )

  //  criteriaTestClear


  //  criteriaTestReadRequest
  //  getCriteriaTestResults
  //  importDataRequest
  //  ruleTmpAdd
  const ruleTmpAdd = data => {
    dispatch(ruleTmpAddAction(data))
  }
  //  ruleTmpUpdate
  //  ruleTmpRemove
  //  rulesReadRequest
  //  ruleCreateRequest
  //  ruleDeleteRequest
  //  ruleUpdateRequest
  //  getRules
  //  getRuleById
  //  getViewData
  
  
  
  
  return (
    <FinanceContext.Provider
      value={{
        viewData: useSelector(state => state.viewData),
        ruleTmpAdd,
        viewReadRequest
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

// WORKS!
// const updateView2 = async view => {
//   dispatch(await viewReadRequest(view))
// }
// const updateView = useCallback(async view => {
//   await updateView2(view)
// }, [updateView2])
// WORKS!

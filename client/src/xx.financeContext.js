import React, { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'
// import { compose } from 'recompose'

import {
  criteriaTestClear,
  criteriaTestReadRequest
} from 'store/criteriaTest/actions'
import { getCriteriaTestResults } from 'store/criteriaTest/selectors'
import { importDataRequest } from 'store/import/actions'
import {
  ruleTmpAdd,
  ruleTmpUpdate,
  ruleTmpRemove,
  rulesReadRequest,
  ruleCreateRequest,
  ruleDeleteRequest,
  ruleUpdateRequest
} from 'store/rules/actions'
import { getRules, getRuleById } from 'store/rules/selectors'

import { viewReadRequest } from 'store/views/actions'
import { getViewData } from 'store/views/selectors'

import { red, blue } from 'logger'

const MODULE_NAME = 'financeContext'

export const FinanceContext = React.createContext()
blue('FinanceContext', FinanceContext)
export const useFinanceContext = () => useContext(FinanceContext)
blue('useFinanceContext', useFinanceContext)

const FinanceProvider = ({
  children,
  criteriaTestClear,
  criteriaTestReadRequest,
  importDataRequest,
  ruleTmpAdd,
  ruleTmpUpdate,
  ruleTmpRemove,
  rulesReadRequest,
  ruleCreateRequest,
  ruleDeleteRequest,
  ruleUpdateRequest,
  viewReadRequest
}) => {

  const getRulesAndData = async (view) => {
    try {
      
      await rulesReadRequest()
      await viewReadRequest(view)
      
    } catch (e) {
      red(MODULE_NAME, e.message)
      console.log(e)
    }
  }
  return (
    <FinanceContext.Provider value={{
      getRulesAndData: getRulesAndData,
      redColor: 'red'
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

const actions = {
  criteriaTestClear,
  criteriaTestReadRequest,
  importDataRequest,
  ruleTmpAdd,
  ruleTmpUpdate,
  ruleTmpRemove,
  rulesReadRequest,
  ruleCreateRequest,
  ruleDeleteRequest,
  ruleUpdateRequest,
  viewReadRequest
}

const mstp = state => {
  return {}
}

export default connect(mstp, actions)(FinanceProvider)

import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import isNilOrEmpty from 'lib/isNillOrEmpty'
import getRuleById from 'lib/getRuleById'
import Button from '@material-ui/core/Button'
import { useFinanceContext } from 'financeContext'

// eslint-disable-next-line
import { green } from 'logger'

const useStyles = makeStyles({
  wrapper: {
    marginBottom: 12
  }
})

const grouped = array =>
  array.reduce((acc, str) => {
    const key = str
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(str)
    return acc
  }, {})

const TestCriteriaResults = ({ ruleId }) => {
  const { criteriaTestReadRequest } = useFinanceContext()
  const _classes = useStyles()
  const rule = useSelector(state => getRuleById(ruleId, state))
  const { criteria } = rule

  const _testCriteria = async () => {
    await criteriaTestReadRequest(criteria)
  }

  const data = useSelector(state => state.criteriaTestResults)

  const groupedData = grouped(data)

  return (
    <div className={_classes.wrapper}>
      <Button variant="outlined" size="small" onClick={_testCriteria}>
        Test Criteria
      </Button>
      {!isNilOrEmpty(groupedData)
        ? Object.keys(groupedData).map(key => {
            return (
              <div
                key={groupedData[key]}
              >{`${key} (${groupedData[key].length})`}</div>
            )
          })
        : null}
    </div>
  )
}

export default TestCriteriaResults

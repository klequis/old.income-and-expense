import React, { useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TR from './TR'
import { useFinanceContext } from 'financeContext'
import SortButtons from 'ui/elements/SortButtons'
import { sortWith, prop, ascend, descend, mergeRight } from 'ramda'
import { dataFieldNames, sortDirections } from 'global-constants'

// eslint-disable-next-line
import { green, red } from 'logger'

const VIEW_NAME = 'all-data-by-description'

const useStyles = makeStyles({
  th: {
    display: 'flex',
    flexFlow: 'row nowrap',
    paddingBottom: 5
  },
  thText: {
    marginRight: 10,
    whiteSpace: 'nowrap',
    textTransform: 'capitalize'
  }
})

const AllDataByDescription = () => {
  // Actions
  const {
    rulesReadRequest,
    viewReadRequest,
    currentViewNameSet
  } = useFinanceContext()

  // State
  const [_loading, _setLoading] = useState(false)
  const [_switchState, _setSwitchState] = useState({
    showOrigDescription: false,
    showOmitted: false
  })
  const [_sort, _setSort] = useState({
    fieldName: dataFieldNames.description,
    direction: sortDirections.ascending
  })

  // Methods
  const _updateRulesAndView = useCallback(async () => {
    await rulesReadRequest()
    await viewReadRequest(VIEW_NAME)
  }, [rulesReadRequest, viewReadRequest])

  // Effects

  useEffect(() => {
    _setLoading(true)
    ;(async () => {
      await _updateRulesAndView()
      currentViewNameSet(VIEW_NAME)
    })()
    _setLoading(false)
  }, [currentViewNameSet, _updateRulesAndView])

  // Local vars
  const _viewData = useSelector(state => state.viewData)
  const _classes = useStyles()

  if (_loading) {
    return <h1>Loading</h1>
  }

  const getViewData = () => {
    const { direction, fieldName } = _sort
    // _viewData.forEach(d => green('category1', typeof d.category1))
    if (direction === sortDirections.ascending) {
      return sortWith([ascend(prop(fieldName))])(_viewData)
    }
    return sortWith([descend(prop(fieldName))])(_viewData)
  }

  const _handleSwitchChange = name => event => {
    _setSwitchState({ ..._switchState, [name]: event.target.checked })
  }

  const _updateSort = (fieldName, direction) => {
    _setSort({
      fieldName,
      direction
    })
  }

  const ColumnHeading = ({ fieldName }) => {
    return (
      <th>
        <div className={_classes.th}>
          <span className={_classes.thText}>{fieldName}</span>
          <SortButtons updateSort={_updateSort} fieldName={fieldName} />
        </div>
      </th>
    )
  }

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={_switchState.showOrigDescription}
            onChange={_handleSwitchChange('showOrigDescription')}
            value="showOrigDesc"
          />
        }
        label="Show Original Description"
      />
      <FormControlLabel
        control={
          <Switch
            checked={_switchState.showOmitted}
            onChange={_handleSwitchChange('showOmitted')}
            value="showOmitted"
          />
        }
        label="Show Omitted"
      />

      <table>
        <thead>
          <tr>
            <ColumnHeading fieldName={dataFieldNames.date} />
            <ColumnHeading fieldName={dataFieldNames.acctId} />
            <ColumnHeading fieldName={dataFieldNames.description} />
            <ColumnHeading fieldName={dataFieldNames.credit} />
            <ColumnHeading fieldName={dataFieldNames.debit} />
            <ColumnHeading fieldName={dataFieldNames.category1} />
            <ColumnHeading fieldName={dataFieldNames.category2} />
            <ColumnHeading fieldName={dataFieldNames.type} />
            <ColumnHeading fieldName={dataFieldNames.omit} />
          </tr>
        </thead>
        <tbody>
          {getViewData().map(doc => {
            const { _id, omit } = doc
            if (_switchState.showOmitted === false && omit) {
              return null
            }
            return (
              <TR
                key={_id}
                doc={doc}
                showOrigDescription={_switchState.showOrigDescription}
                showOmitted={_switchState.showOmitted}
                updateRulesAndView={_updateRulesAndView}
                view={VIEW_NAME}
              />
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default AllDataByDescription

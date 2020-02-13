import React from 'react'
import DataItem from './DataItem'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/styles'
import MaterialTable from 'material-table'
import { format } from 'date-fns'
import { mergeRight } from 'ramda'

// eslint-disable-next-line
import { green, red } from 'logger'

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: 130
  },
  dataList: {
    width: '100%'
  }
})

/*
  - date
  - description
  - category1
  - category2
  - omit

*/

const noWrapStyle = { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }

const DataContainer = ({ data, showOrigDesc }) => {
  const classes = useStyles()
  return (
    <div id="dataContainer" className={classes.wrapper}>
      <MaterialTable
        columns={[
          { title: 'Date', field: 'date', type: 'date' },
          {
            title: 'Description',
            field: 'description',
            cellStyle: noWrapStyle
          },
          { title: 'Credit', field: 'credit', type: 'currency' },
          { title: 'Debit', field: 'debit', type: 'currency' },
          { title: 'Category1', field: 'category1', cellStyle: noWrapStyle },
          { title: 'Category2', field: 'category2', cellStyle: noWrapStyle },
          { title: 'Omit', field: 'Omit' }
        ]}
        data={
          data.map(
            doc => mergeRight(doc, {date: format(new Date(doc.date), 'MM/dd/yyyy')})
          )
        }
        title="Chase Data"
        options={{ pageSize: 1000, padding: 'dense' }}
      />
    </div>
  )
}

export default DataContainer

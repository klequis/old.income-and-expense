import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useFinanceContext } from 'financeContext'
import { makeStyles } from '@material-ui/styles'
import { views } from 'global-constants'
import { format } from 'date-fns'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

// eslint-disable-next-line
import { green } from 'logger'

const noWrapStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap'
}

const useStyles = makeStyles({
  tableDataPaper: {
    padding: 4
  }
})

// const sortByDate = sortBy(prop('date'))

const TDPaper = ({ children }) => {
  const _classes = useStyles()
  // return <TDPaper className={_classes.tableDataPaper}>{data}</TDPaper>
  return <td>{children}</td>
}

const TR = ({ rowData }) => {
  green('rowData', rowData)
  // const _classes = useStyles()
  const { _id, date, description } = rowData
  return (
    <tr>
      {/* <TDPaper data={format(new Date(date), 'MM/dd/yyyy')} /> */}
      <TDPaper>{format(new Date(date), 'MM/dd/yyyy')}</TDPaper>
      <TDPaper>{description}</TDPaper>

      <TDPaper>{_id}</TDPaper>
    </tr>
  )
}

const Row = ({ data }) => {
  const {
    _id,
    date,
    description,
    origDescription,
    debit,
    credit,
    type,
    checkNumber,
    omit,
    category1,
    category2
  } = data
  return (
    <TableRow>
      <TableCell>{format(new Date(date), 'MM/dd/yyyy')}</TableCell>
      <TableCell>
        <div>{description}</div>
        <div>{origDescription}</div>
      </TableCell>
      <TableCell>{debit}</TableCell>
      <TableCell>{credit}</TableCell>
      <TableCell>{checkNumber}</TableCell>
      <TableCell>
        <div>{category1}</div>
        <div>{category2}</div>
      </TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>{omit ? 'yes' : ''}</TableCell>
      <TableCell>{_id}</TableCell>
    </TableRow>
  )
}

const RawData = () => {
  // Actions
  const { viewReadRequest, currentViewNameSet } = useFinanceContext()
  const _classes = useStyles()

  useEffect(() => {
    ;(async () => {
      await viewReadRequest(views.rawData)
    })()
  }, [viewReadRequest])
  const _viewData = useSelector(state => state.viewData)

  return (
    <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Debit</TableCell>
            <TableCell>Credit</TableCell>
            <TableCell>Check#</TableCell>
            <TableCell>Categories</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Omit</TableCell>
            <TableCell>_id</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {_viewData.map(data => (
            <Row key={data._id} data={data} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RawData

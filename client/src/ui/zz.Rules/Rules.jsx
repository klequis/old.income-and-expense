import React, { useEffect, forwardRef /*, useState */ } from 'react'
// import { makeStyles } from '@material-ui/styles'
import MaterialTable from 'material-table'
import { connect } from 'react-redux'
import { compose } from 'recompose'


import Rule from './Rule'
// import Search from '@material-ui/icons/Search'
// import FirstPage from '@material-ui/icons/FirstPage'
// import LastPage from '@material-ui/icons/LastPage'
// import ChevronLeft from '@material-ui/icons/ChevronLeft'
// import ChevronRight from '@material-ui/icons/ChevronRight'
// import Clear from '@material-ui/icons/Clear'

//
// import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward'
// import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
// import DeleteOutline from '@material-ui/icons/DeleteOutline';
// import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
// import Remove from '@material-ui/icons/Remove';
// import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search'
// import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  // Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  // Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  // Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  // Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  // Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />)
  // ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  // ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
}

// eslint-disable-next-line
import { green, red } from 'logger'

// const styles = useStyles({

// })

const Rules = ({ data, rulesReadRequest }) => {
  useEffect(() => {
    ;(async () => {
      try {
        await rulesReadRequest()
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [rulesReadRequest])

  return (
    <MaterialTable
      columns={[
        
        { title: 'Acct', field: 'acct' },
        { title: 'ID', field: '_id', searchable: false },
        // { title: 'Description'}
        // { title: 'Description', field: 'description' }
      ]}
      data={data.map(doc => {
        // green('doc', doc)
        return {
          _id: doc._id,
          acct: doc.acct,
          criteria: doc.criteria,
          actions: doc.actions,
          description: doc.description
        }
      })/*.filter(doc => doc._id === '5e45ca2f6d8f4438b8ee5936')*/ }
      options={{
        padding: 'dense',
        pageSize: 20,
        filtering: true,
        sorting: true,
        // rowStyle: {
        //   backgroundColor: 'green',
        //   boxShadow:
        //     '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        //   borderRadius: '4px',
        //   color: '#fff',
        //   transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        //   backgroundColor: '#424242'
        // }
      }}
      icons={tableIcons}
      detailPanel={rowData => {
        // green('rowData', rowData.criteria)
        // return <div>HI</div>
        return <Rule _id={rowData._id} criteria={rowData.criteria} actions={rowData.actions} />
      }}
      // icons={{
      //   Search: Search,
      //   FirstPage: FirstPage,
      //   LastPage: LastPage,
      //   NextPage: ChevronRight,
      //   PreviousPage: ChevronLeft,
      //   Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />)
      // }}
    />
  )
}

const actions = {
  rulesReadRequest
}

const mapStateToProps = state => {
  return {
    data: getRules(state)
  }
}

export default compose(connect(mapStateToProps, actions))(Rules)

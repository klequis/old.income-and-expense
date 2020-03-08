import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { getAllDataByDescription } from 'store/views/selectors'
import { allDataByDescriptionRequest } from 'store/views/actions'
import TD from './TD'
import { format } from 'date-fns'

const AllDataByDescription = ({ allDataByDescriptionRequest, data }) => {
  useEffect(() => {
    ;(async () => {
      try {
        await allDataByDescriptionRequest('all-data-by-description')
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [allDataByDescriptionRequest])

  return (
    <table>
      <thead>
        <th>Date</th>
        <th>Description</th>
        <th>Credit</th>
        <th>Debit</th>
        <th>Category 1</th>
        <th>Categoty 2</th>
        <th>Type</th>
        <th>Omit</th>
      </thead>
      <tbody>
        {data.map(doc => {
          const {
            date,
            description,
            credit,
            debit,
            category1,
            category2,
            type,
            omit
          } = doc
          return (
            <tr>
              <TD align='left'>{format(new Date(doc.date), 'MM/dd/yyyy')}</TD>
              <TD align='left'>{description}</TD>
              <TD>{credit}</TD>
              <TD>{debit}</TD>
              <TD>{category1}</TD>
              <TD>{category2}</TD>
              <TD>{type}</TD>
              <TD>{omit}</TD>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const actions = {
  allDataByDescriptionRequest
}

const mapStateToProps = state => {
  return {
    data: getAllDataByDescription(state)
  }
}
export default compose(connect(mapStateToProps, actions))(AllDataByDescription)

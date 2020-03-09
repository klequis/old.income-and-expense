import React from 'react'
import Criterion from './Criterion'
import shortid from 'shortid'

// eslint-disable-next-line
import { green, red } from 'logger'

const Criteria = ({ criteria, updateRule, updateCriterion, editMode }) => {
  return criteria.map(c => {
    const { _id } = c
    return (
      <Criterion
        key={_id}
        criterion={c}
        updateRule={updateRule}
        updateCriterion={updateCriterion}
        editMode={_id === 'newCriterion' ? true : editMode}
      />
    )
  })
}

export default Criteria

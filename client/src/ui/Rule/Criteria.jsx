import React from 'react'
import Criterion from './Criterion'
import shortid from 'shortid'

// eslint-disable-next-line
import { green, red } from 'logger'

const Criteria = ({ criteria, updateRule, editMode }) => {
  green('Criteria: criteria')
  return criteria.map(c => (
    <Criterion
      key={shortid.generate()}
      criterion={c}
      updateRule={updateRule}
      editMode={editMode}
    />
  ))
}

export default Criteria

import React from 'react'
import Criterion from './Criterion'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import shortid from 'shortid'
import { makeStyles } from '@material-ui/styles'

// eslint-disable-next-line
import { green, red } from 'logger'

const useStyles = makeStyles({
  criteriaTitle: {
    fontWeight: 'bold',
    paddingTop: 8,
    paddingBottom: 4
  },
})

const Criteria = ({ criteria, updateRule, updateCriterion, editMode }) => {
  const classes = useStyles()


  const handleAddCriterionClick = () => {
    addNewCriterion()
  }
  return (
    <>
    <div className={classes.criteriaTitle}>
          Criteria{' '}
          <IconButton onClick={handleAddCriterionClick}>
            <AddIcon />
          </IconButton>
        </div>
  
  {criteria.map(c => {
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
  })}
  </>
  )
}

export default Criteria

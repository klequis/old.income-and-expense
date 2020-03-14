import React, { useState } from 'react'
import { useErrors } from './useErrors'
import Add from '@material-ui/icons/Add'
import Clear from '@material-ui/icons/Clear'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import DueDate from './DueDate'
import IconButton from '@material-ui/core/IconButton'

// eslint-disable-next-line
import { green } from 'logger'

const useStyles = makeStyles(theme => ({
  wrapper: {
    margin: '8px 16px',
    // backgroundColor: 'red'
  },
  form: {
    display: 'flex',
    padding: '8px 16px',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  title: {
    // backgroundColor: 'blue'
  },
  left: {
    // display: 'flex',
    flexBasis: '60%',
    // backgroundColor: 'lightblue'
  },
  right: {
    flexBasis: '40%',
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'flex-end',
    // backgroundColor: 'lightgreen'
  },
  button: {
    // paddingLeft: 0,
    // paddingRight: 0,
    // margin: theme.spacing(0),
    // border: '1px solid red',
    // minWidth: 40
  }

}))

const AddTodo = props => {

  const [title, setTitle] = useState('')
  const [dueDate /*, setDueDate*/] = useState(null)
  const { getError, setError } = useErrors(state => state.validationErrors)
  const classes = useStyles()
  const { handleAddTodo } = props

  const handleInputChange = e => {
    setTitle(e.target.value)
  }

  const handleOnSubmit = e => {
    e.preventDefault()
    // TODO: send all paramaters for the todo, not just 'title'
    handleAddTodo(title)
    setTitle('')
  }

  const handleCancelClick = () => {
    setTitle('')
  }

  const handleTitleOnBlur = e => {
    const { id, value } = e.target
    // green('id', id)
    // green('value', value)
    if (value.length <= 2) {
      setError(id, 'client - Title must be at least 3 charters long')
    } else {
      setError('','')
    }
  }

  const handleDateChange = (_id, dueDate) => {
    // don't need the _id for POST

  }

  return (
    <Paper className={classes.wrapper}>
      <form className={classes.form} onSubmit={handleOnSubmit}>
        <div className={classes.left}>
          <TextField
            className={classes.title}
            id="title"
            onChange={handleInputChange}
            onBlur={handleTitleOnBlur}
            placeholder='Enter new todo'
            type="text"
            value={title}
            fullWidth
          />
          <div>{getError('title')}</div>
        </div>
        <div className={classes.right}>
          <DueDate
            _id=""
            hendleDateChange={handleDateChange}
            dueDate={dueDate}
          />

          {/* <Button type="submit" className={classes.button}>
            <Add />
          </Button> */}
          <IconButton type="submit" className={classes.button} size="small">
            <Add />
          </IconButton>
          <IconButton onClick={handleCancelClick} type="button" size="small">
            <Clear />
          </IconButton>
        </div>
      </form>
    </Paper>
  )
}

export default AddTodo

// import React, { useState } from 'react'
// import Paper from '@material-ui/core/Paper'
// import TextField from '@material-ui/core/TextField'
// import Button from '@material-ui/core/Button'
// import { makeStyles, createStyles } from '@material-ui/styles'
// import { green } from 'logger'

// const useStyles = makeStyles(theme =>
//   createStyles({
//     wrapper: {},
//     textField: {
//       width: '50%'
//     }
//   })
// )

// const Filter = ({ filterData }) => {
//   const [value, setValue] = React.useState('');
//   const classes = useStyles()

//   const handleChange = event => {
//     setValue(event.target.value);
//   };

//   return (
//     <Paper className={classes.wrapper}>
//       <TextField
//         id="standard-multiline-flexible"
//         label="Multiline"
//         multiline
//         rowsMax="4"
//         value={value}
//         onChange={handleChange}
//       />
//       <Button>Filter</Button>
//     </Paper>
//   )
// }

// export default Filter

import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles, createStyles } from '@material-ui/styles'
import { green } from 'logger'

const useStyles = makeStyles(theme =>
  createStyles({
    wrapper: {},
    textField: {
      width: '50%'
    }
  })
)

const Filter = ({ filterChanged }) => {
  const [description, setDescription] = useState('')
  const classes = useStyles()

  const handleDescriptionChange = e => {
    setDescription(e.target.value)
  }

  const handleFilterButtonChange = () => {
    filterChanged('descriptionFilter', description)
  }

  return (
    <Paper className={classes.wrapper}>
      <TextField
        id="filterText"
        className={classes.textField}
        onChange={handleDescriptionChange}
        placeholder={'Enter filter/regex'}
        value={description}
        fullWidth
      />
      <Button id="filterButton" onClick={handleFilterButtonChange}>Filter</Button>
    </Paper>
  )
}

export default Filter

import React, { useState } from 'react'
import { DatePicker } from '@material-ui/pickers'
import { isISO8601 } from 'validator'
import DateRange from '@material-ui/icons/DateRange'
import { makeStyles } from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'

// eslint-disable-next-line
import { green } from 'logger'

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: 130
  }
})

const DueDate = ({ handleDateChange, dueDate }) => {
  const [selectedDate, setSelectedDate] = useState(
    isISO8601(dueDate + '') ? dueDate : null
  )
  const [pickerOpen, setPickerOpen] = useState(false)

  const handlePickerOnChange = newDate => {
    setPickerOpen(false)
    const d = new Date(newDate).toISOString()
    setSelectedDate(d)
    handleDateChange(d)
  }

  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <DatePicker
        autoOk
        format="MMM d, yyyy"
        variant="inline"
        value={selectedDate}
        onChange={handlePickerOnChange}
        InputProps={{
          disableUnderline: true
        }}
        //
        open={pickerOpen}
        onOpen={() => setPickerOpen(true)}
        onClose={() => setPickerOpen(false)}
      />
      <IconButton size="small">
        <DateRange onClick={() => setPickerOpen(true)} />
      </IconButton>
    </div>
  )
}

export default DueDate

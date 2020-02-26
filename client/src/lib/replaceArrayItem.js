import { update } from 'ramda'
import { green } from '@material-ui/core/colors'
const replaceArrayItem = (array, itemToReplace, newItem) => {
  const idx = array.findIndex(itemToReplace)
  green('array', array)
  green('itemToReplace', itemToReplace)
  green('newItem', newItem)
  const a = update(idx, newItem, array)
  return a
}

export default replaceArrayItem
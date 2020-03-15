import React from 'react'
import isNilOrEmpty from 'lib/isNillOrEmpty'
import { green } from 'logger'


const TestCriteriaResults = ({ arrayOfStrings }) => {
  green('TestCriteriaResults: arrayOfStrings', arrayOfStrings)
  if (isNilOrEmpty(arrayOfStrings)) {
    return null
  }
  const groupOrigValues = array => {
    
    const grouped = array.reduce((acc, str) => {
      // acc.push(str)
      const key = str
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(str)
      return acc
    }, {})
    

    return Object.keys(grouped).map(key => {
      return <div key={grouped[key]}>{`${key} (${grouped[key].length})`}</div>
    })
  }

  return <div>{groupOrigValues(arrayOfStrings)}</div>
}

export default TestCriteriaResults
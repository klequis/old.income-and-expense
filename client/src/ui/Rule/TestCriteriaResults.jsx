import React from 'react'
import { useSelector } from 'react-redux'
import isNilOrEmpty from 'lib/isNillOrEmpty'

// eslint-disable-next-line
import { green } from 'logger'


const grouped = array  => array.reduce((acc, str) => {
  const key = str
  if (!acc[key]) {
    acc[key] = []
  }
  acc[key].push(str)
  return acc
}, {})

const TestCriteriaResults = () => {

  const data = useSelector(state => state.criteriaTestResults)

  // if (isNilOrEmpty(data)) {
  //   return null
  // }
  if (data.length === 0) {
    return null
  }
  const groupedData = grouped(data)
  green('groupedData', groupedData)

  // return <div key={groupedData[key]}>{`${key} (${grouped[key].length})`}</div>


  // const groupOrigValues = array => {
    
    

  //   const groupResult = grouped(data)
  //   green('groupedResult', groupResult)

    return Object.keys(groupedData).map(key => {
      return <div key={groupedData[key]}>{`${key} (${groupedData[key].length})`}</div>
    })
    
  // }
  // return <div>{groupOrigValues(criteriaTestResults)}</div>
}

export default TestCriteriaResults
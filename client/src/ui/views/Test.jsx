import React, { useEffect } from 'react'

const Test = ({ updateRulesAndData }) => {
  useEffect(() => {
    ;(async () => {
      await updateRulesAndData('all-data-by-description')
    })()
  }, [])

  // useEffect(() => {
  //   ;(async () => {
  //     await updateRulesAndData('all-data-by-description')
  //   })()
  // }, [updateRulesAndData])

  return (
    <>
      <div>
        test{' '}
        {typeof test === 'function' ? 'is a function' : 'is NOT a function'}
      </div>
      <div>
        updateRulesAndData{' '}
        {typeof updateRulesAndData === 'function'
          ? 'is a function'
          : 'is NOT a function'}
      </div>
      <div>updateRulesAndData is a {typeof updateRulesAndData}</div>
    </>
  )
}

export default Test

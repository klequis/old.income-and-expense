import wrap from 'routes/wrap'
// import dataImport from 'actions/data-import'
// import runRules from 'actions/run-rules'
// import { find } from 'db'
// import getRulesAndData from 'actions/get-rules-and-data'

import dataImport from 'actions/data-import'

// eslint-disable-next-line
import { green, yellow } from 'logger'

const importData = wrap(async (req, res, next) => {
  // const rulesAndData = getRulesAndData()
  // const ld = await dataImport()
  const ld = await dataImport(true)
  // const rr = await runRules(rulesAndData)
  res.send(JSON.stringify({ dataLoaded: ld /*, rulesRun: rr */ }))
})

export default importData

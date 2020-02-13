import wrap from 'routes/wrap'
import dataImport from 'actions/data-import'
import runRules from 'actions/run-rules'
import getRulesAndData from 'actions/get-rules-and-data'

// eslint-disable-next-line
import { green } from 'logger'

const importData = wrap(async (req, res, next) => {
  const rulesAndData = getRulesAndData()
  const ld = await dataImport(rulesAndData)
  // const rr = await runRules(rulesAndData)
  res.send(JSON.stringify({ dataLoaded: ld /*, rulesRun: rr */ }))
})

export default importData

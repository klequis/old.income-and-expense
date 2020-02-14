import wrap from 'routes/wrap'
import dataImport from 'actions/data-import'
import runRules from 'actions/run-rules'
// import getRulesAndData from 'actions/get-rules-and-data'
import { DATA_RULE_MAP_COLLECTION_NAME } from 'db/constants'
import { find } from 'db'

// eslint-disable-next-line
import { green } from 'logger'

const importData = wrap(async (req, res, next) => {
  // const rulesAndData = getRulesAndData()
  const dataRuleMap = await find(DATA_RULE_MAP_COLLECTION_NAME, {})
  green('dataRuleMap', dataRuleMap)
  const ld = await dataImport(dataRuleMap)
  // const rr = await runRules(rulesAndData)
  res.send(JSON.stringify({ dataLoaded: ld /*, rulesRun: rr */ }))
})

export default importData

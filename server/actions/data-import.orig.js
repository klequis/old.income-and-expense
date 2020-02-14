import { createIndex, dropCollection, insertMany } from 'db'

import { ACCOUNTS_COLLECTION_NAME } from 'db/constants'
import { mergeRight, find } from 'ramda'
// eslint-disable-next-line
import { green, greenf, redf, yellow } from 'logger'

const dataImport = async (loadRaw = false) => {
  yellow('**** START')
  const accounts = await find('accounts', {})
  green('accounts', accounts)
  yellow('**** END')
}

export default dataImport

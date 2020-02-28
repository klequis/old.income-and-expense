import { expect } from 'chai'
import sendRequest from 'test/sendRequest'
import { redf, green, yellow } from 'logger'


const newRule = {
  _id: '5e4b11ea7834d2aa640765e5',
  acctId: 'saphire.chase.credit-card.8567',
  criteria: [
    {
      _id: '5e57d48edfb85a470c44e5b8',
      field: 'description',
      operation: 'beginsWith',
      value: '24 Hour Fitness **'
    }
  ],
  actions: [
    {
      action: 'replaceAll',
      field: 'description',
      replaceWithValue: '24 Hour Fitness',
      _id: '5e57d48edfb85a470c44e5b9'
    },
    {
      action: 'categorize',
      category1: 'gym',
      _id: '5e57d48edfb85a470c44e5ba'
    }
  ]
}

describe('test update-rule', function() {
  it('is rule changed', async function() {
    const _id = '5e4b11ea7834d2aa640765e5'
    const uri = `/api/rules/ruleid/${_id}`
    const r = await sendRequest({
      method: 'PATCH',
      uri: uri,
      status: 200,
      body: newRule
    })
  })
})

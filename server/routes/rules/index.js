import express from 'express'
import getRules from './getRules'
import getRule from './getRule'
import patchRule from './patchRule'
import newRule from './newRule'
// import addId from './add-id'

const router = express.Router()

router.get('/', getRules)
router.get('/ruleid/:ruleid', getRule)
router.patch('/ruleid/:ruleid', patchRule)
router.post('/new-rule', newRule)
// router.get('/add-id', addId)

export default router

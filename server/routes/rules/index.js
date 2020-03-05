import express from 'express'
import getRules from './get-rules'
import getRule from './get-rule'
import patchRule from './patch-rule'

// import addId from './add-id'

const router = express.Router()

router.get('/', getRules)
router.get('/ruleid/:ruleid', getRule)
router.patch('/ruleid/:ruleid', patchRule)
// router.get('/add-id', addId)

export default router

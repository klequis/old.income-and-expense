import express from 'express'
import rules from './rules'
import updateRule from './update-rule'
// import addId from './add-id'

const router = express.Router()

router.get('/', rules)
router.patch('/ruleid/:ruleid', updateRule)
// router.get('/add-id', addId)

export default router

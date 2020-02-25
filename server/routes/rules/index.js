import express from 'express'
import rules from './rules'
import updateRule from './update-rule'

const router = express.Router()

router.get('/', rules)
    
router.patch('/ruleid/:ruleid', updateRule)

export default router

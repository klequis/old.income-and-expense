import express from 'express'
import amountByCategory from './amount-by-category'
import dataChanges from './dataChanges'

const router = express.Router()

router.get('/amount-by-category', amountByCategory)
router.get('/data-changes', dataChanges)

export default router

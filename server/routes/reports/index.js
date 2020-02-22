import express from 'express'
import amountByCategory from './amount-by-category'
import changesByDataDoc from './changes-by-data-doc'

const router = express.Router()

router.get('/amount-by-category', amountByCategory)
router.get('/changes-by-data-doc', changesByDataDoc)

export default router

import express from 'express'
import importData from './import-data'

const router = express.Router()
router.get('/', importData)

export default router

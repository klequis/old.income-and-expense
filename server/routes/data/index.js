import express from 'express'
import dataGet from './dataGet'

const router = express.Router()
router.get('/', dataGet)
router.get('/:description', dataGet)
router.get('/showOmitted/:showOmitted', dataGet)
router.get('/description/:description/showOmitted/:showOmitted', dataGet)

export default router

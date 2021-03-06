import express from 'express'
import dataGet from './dataGet'
import dataGetByCriteria from './dataGetByCriteria'

const router = express.Router()

router.get('/', dataGet)
router.get('/:description', dataGet)
router.get('/showOmitted/:showOmitted', dataGet)
router.get('/description/:description/showOmitted/:showOmitted', dataGet)
router.get('/view/viewid', dataGet)
// router.get('/field/:field/operation/:operation/value/:value', dataGetByCriteria)
router.post('/criteria', dataGetByCriteria)

export default router

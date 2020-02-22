import { fetchJson } from './api-helpers'
import { isEmpty } from 'validator'

// eslint-disable-next-line
import { orange, green } from 'logger'
import { redf } from 'logger'

/*
    [description] && [true || false]

    '' && true

    someVale && true

    '' && false

    someVale && false
*/

// Errors are handled by fetchJson()
export default {
  rules: {
    async read() {
      const url = `/api/rules`
      const data = await fetchJson(url, {
        method: 'GET'
      })
      return data
    }
  },
  reports: {
    async read(reportUrlPart) {
      // orange('reportUrlPart', reportUrlPart)      
      try {
        const url = `/api/reports/${reportUrlPart}`
        const data = await fetchJson(url, {
          method: 'GET'
        })
        // orange('data', data)
        return data
      } catch (e) {
        redf('api.data.reports ERROR', e.message)
        console.log(e)
      }
      
    }
  },
  data: {
    async read(description, showOmitted) {
      // /description/:description/showOmitted/:showOmitted
      const descriptionPart = isEmpty(description)
        ? ''
        : `/description/${description}`
      const showOmittedPart = `/showOmitted/${showOmitted}`
      const url = `/api/data${descriptionPart}${showOmittedPart}`
      const data = await fetchJson(url, {
        method: 'GET'
      })
      return data
    },
    async readByCriteria(field, operation, value) {
      orange('readByCriteria', `${field}, ${operation}, ${value}`)
      try {
        const url = `/api/data/criteria/`
        const data = await fetchJson(url, {
          method: 'POST',
          body: JSON.stringify({
            field,
            operation,
            value
          })
        })
        return data
      } catch (e) {
        redf('api.data.readByCriteria ERROR', e.message)
        console.log(e)
      }
    },
    async importData() {
      const data = await fetchJson(`api/import`, {
        method: 'GET'
      })
      orange('importData: data', data)
      return data
    }
  }
}

import { fetchJson } from './api-helpers'
import { isEmpty } from 'validator'

// eslint-disable-next-line
import { orange, green } from 'logger'
import { redf } from 'logger'
import { dataReadByIdRequest } from 'store/data/actions'

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
    },
    async rulesReadById(ruleId) {
      const url = `api/rules/${ruleId}`
      const data = await fetchJson(url, {
        method: 'GET'
      })
      return data
    },
    async create(rule) {
      const url = `api/rules`
      const data = await fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(rule)
      })
      return data
    },
    async delete(ruleId) {
      const url = `api/rules/${ruleId}`
      const data = await fetchJson(url, {
        method: 'DELETE'
      })
      return data
    },
    async update(_id, rule) {
      const url = `api/rules/ruleid/${_id}`
      const data = await fetchJson(url, {
        method: 'PATCH',
        body: JSON.stringify(rule)
      })
      return data
    }
  },
  views: {
    async read(viewUrlPart) {
      // orange('reportUrlPart', reportUrlPart)
      try {
        const url = `/api/views/${viewUrlPart}`
        const data = await fetchJson(url, {
          method: 'GET'
        })
        // orange('data', data)
        return data
      } catch (e) {
        redf('api.data.views ERROR', e.message)
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

import { fetchJson } from './api-helpers'
import { isEmpty } from 'validator'

// eslint-disable-next-line
import { orange, green } from 'logger'

/*
    [description] && [true || false]

    '' && true

    someVale && true

    '' && false

    someVale && false
*/

// Errors are handled by fetchJson()
export default {
  data: {
    async read(description, showOmitted) {
      orange('api.data.read: description', description)
      orange('api.data.read: showOmitted', showOmitted)
      // /description/:description/showOmitted/:showOmitted
      
      const descriptionPart = isEmpty(description) ? '' : `/description/${description}`
      const showOmittedPart = `/showOmitted/${showOmitted}`

      const url = `/api/data${descriptionPart}${showOmittedPart}`
      orange('url', url)
      const data = await fetchJson(
        url,
        {
          method: 'GET'
        }
      )
      // const data = await fetchJson(`api/todo/${userId}`, {
      //   method: 'GET'
      // })
      return data
    },
    async importData() {
      orange('data.importData')
      const data = await fetchJson(`api/import`, {
        method: 'GET'
      })
      orange('importData: data', data)
      return data
    }
    // async readById(userId, todoId) {
    //   const data = await fetchJson(`api/todo/${userId}/${todoId}`, {
    //     method: 'GET'
    //   })
    //   return data
    // },
    // async create(userId, todo) {
    //   const data = await fetchJson(`api/todo/${userId}`, {
    //     method: 'POST',
    //     body: JSON.stringify(todo)
    //   })
    //   return data
    // },
    // async delete(userId, todoId) {
    //   const data = await fetchJson(`api/todo/${userId}/${todoId}`, {
    //     method: 'DELETE'
    //   })
    //   return data
    // },
    // async update(userId, todoId, todo) {
    //   orange('api.update: userId', userId)
    //   orange('api.update: todoId', todoId)
    //   orange('api.update: todo', todo)
    //   const data = await fetchJson(`api/todo/${userId}/${todoId}`, {
    //     method: 'PATCH',
    //     body: JSON.stringify(todo)
    //   })
    //   return data
    // }
    // async update(userId, todoId, todo) {
    //   // orange('api.update: userId', userId)
    //   // orange('api.update: todoId', todoId)
    //   // orange('api.update: todo', todo)
    //   const data = await fetchJson(`api/data/${todoId}`, {
    //     method: 'PATCH',
    //     body: JSON.stringify(todo)
    //   })
    //   return data
    // }
  }
}

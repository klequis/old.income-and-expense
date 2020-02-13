import { SET_USER } from './constants'

export const setUser = userId => {
  return {
    type: SET_USER,
    payload: { userId }
  }
}

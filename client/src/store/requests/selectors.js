import { yellow } from 'logger'

const noStatus = {
  status: 'none',
  error: null
}
export const getRequest = (state, key) => {
  if (state.requests[key] === null) {
    return noStatus
  } else {
    return state.requests[key]
  }
}

export const getRequests = state => state.requests
export const areRequestsPending = state => {
  const { requests } = state
  yellow('requests', requests)
  return Object.keys(requests).some(key => requests[key].status === 'pending')
}

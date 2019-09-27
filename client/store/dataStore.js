import axios from 'axios'
import history from '../history'
import util from '../plaidUtils'

/* PROBABLY NOT THE BEST PLACE TO STORE FINANCIAL DATA BUT FOR THE PURPOSES OF DEVELOPMENT
THE DATA WILL BE STORED HERE*/

// INITIAL STATE
const initialState = {}

// ACTION TYPES
const GET_DATA = 'GET_DATA'

// ACTION CREATOR
const getData = data => ({
  type: GET_DATA,
  data
})

// THUNK CREATORS
/* Probable best to move those onLoads that contain the 'util' calls should probably go
in a thunk as to move them out of the onSuccess block and instead let them affect a state
so the page can rerender and also have some persistent DATA*/

export const getDataThunk = responseBody => {
  return async dispatch => {
    try {
      const finData = util({
        parameters: {
          access_token: responseBody.access_token,
          item_id: responseBody.item_id,
          error: responseBody.error
        },
        url: 'http://localhost:8080/api/plaid/transactions',
        method: 'GET'
      })
      console.log(finData, 'this is finData')
    } catch (error) {
      console.log('error in getDataThunk: ', error)
    }
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return {
        data: action.data
      }
    default:
      return state
  }
}

// util({
//   parameters: {
//     access_token: responseBody.access_token,
//     item_id: responseBody.item_id,
//     error: responseBody.error
//   },
//   url: 'http://localhost:8080/api/plaid/transactions',
//   method: 'GET',
// })

// util({
//   parameters: {
//     access_token: responseBody.access_token,
//     item_id: responseBody.item_id,
//     error: responseBody.error
//   },
//   url: 'http://localhost:8080/api/plaid/auth',
//   method: 'GET',
//   onLoad: function(statusCode, responseBody) {
//     // console.log(this, 'this inside 3 onLoads')
//     // holder = this.props.getData(responseBody)
//     // console.log(holder, 'this is holder')
//   }
// })
// }
// })

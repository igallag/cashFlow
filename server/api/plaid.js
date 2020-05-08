const bodyParser = require('body-parser')
const router = require('express').Router()
const plaid = require('plaid')
const moment = require('moment')

// We store the access_token in memory - in production, store it in
// a secure
// persistent data store
let ACCESS_TOKEN = null
let PUBLIC_TOKEN = null

const client = new plaid.Client(
  '5d8be07b8e856300113b29d5',
  '5700e48880f7362dbe882eecb6df59',
  '498272ecf14c471af0dd91aec416e6',
  plaid.environments.sandbox
)

// Accept the public_token sent from Link

router.post('/get_access_token', function(request, response, next) {
  PUBLIC_TOKEN = request.body.token

  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    if (error !== null) {
      console.log('Could not exchange public_token!' + '\n' + error)
      return response.json({error: error.message})
    }
    // console.log(tokenResponse, 'this is tokenResponse')
    ACCESS_TOKEN = tokenResponse.access_token
    let ITEM_ID = tokenResponse.item_id
    console.log('Access Token: ' + ACCESS_TOKEN)
    console.log('Item ID: ' + ITEM_ID)
    response.json({
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: false
    })
  })
})

// uses the access token to retrieve account data
router.get('/auth', function(request, response, next) {
  console.log('inside get')
  client.getAuth(ACCESS_TOKEN, function(error, authResponse) {
    console.log('inside of getAuth')
    if (error !== null) {
      return response.json({
        error: error
      })
    }

    console.log(authResponse.accounts, 'this is auth responseaccounts')
    response.json({error: null, auth: authResponse})
  })
})

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
router.get('/transactions', function(request, response, next) {
  // Pull transactions for the Item for the last 30 days
  // console.log('INSIDE OF THE GET TRANSACTIONS ROUTE' , response)
  const startDate = moment()
    .subtract(30, 'days')
    .format('YYYY-MM-DD')
  var endDate = moment().format('YYYY-MM-DD')
  client.getTransactions(
    ACCESS_TOKEN,
    startDate,
    endDate,
    {
      count: 5,
      offset: 0
    },
    function(error, transactionsResponse) {
      if (error !== null) {
        // prettyPrintResponse(error)
        console.log('ERROR INSIDE OF TRANSACTIONS INSIDE FUNCTION', error)
        return response.json({
          error: error
        })
      } else {
        // prettyPrintResponse(transactionsResponse)
        // window.localStorage.setItem('test', 'this is a test')
        // window.localStorage.setItem('data', JSON.stringify(transactionsResponse))
        // console.log(transactionsResponse, 'this is transactionsResponse = = = = = = = = = = = = = = = = = = = = = = = = = = =')
        response.json({
          error: false,
          transactions: transactionsResponse
        })
      }
      const transactions = transactionsResponse.transactions
      console.log(transactions, 'THIS IS TRANSACTIONS')
    }
  )
})

// router.listen(8080)
module.exports = router

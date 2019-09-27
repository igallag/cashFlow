const bodyParser = require('body-parser')
const router = require('express').Router()
const plaid = require('plaid')

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
// const router = express()
router.post('/get_access_token', function(request, response, next) {
  PUBLIC_TOKEN = request.body.token

  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    if (error !== null) {
      console.log('Could not exchange public_token!' + '\n' + error)
      return response.json({error: error.message})
    }
    ACCESS_TOKEN = tokenResponse.access_token
    let ITEM_ID = tokenResponse.item_id
    console.log('Access Token: ' + ACCESS_TOKEN)
    console.log('Item ID: ' + ITEM_ID)
    response.json({error: false})
  })
})

// router.listen(8080)
module.exports = router

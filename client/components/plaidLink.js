import React from 'react'
import PlaidLink from 'react-plaid-link'
import util from '../plaidUtils'

class PlaidLinkComponent extends React.Component {
  async handleOnSuccess(token, metadata) {
    let publicTokenHolder = {}
    let accessTokenHolder = {}
    let finDataHolder = {}

    // console.log(this, 'this is props')
    publicTokenHolder = util({
      parameters: {
        token: token,
        metadata: metadata
      },
      url: 'http://localhost:8080/api/plaid/get_access_token',
      method: 'POST',
      onError: function() {
        console.log('onError')
      }
    })
    console.log(publicTokenHolder, 'this is publicTokenHolder')
    accessTokenHolder = util({
      parameters: {
        access_token: publicTokenHolder.access_token,
        item_id: publicTokenHolder.item_id,
        error: publicTokenHolder.error
      },
      url: 'http://localhost:8080/api/plaid/auth',
      method: 'GET'
    })
    console.log(accessTokenHolder, 'THIS IS ACCESSTOKENHOLDER')
    finDataHolder = await util({
      parameters: {
        access_token: accessTokenHolder.access_token,
        item_id: accessTokenHolder.item_id,
        error: accessTokenHolder.error
      },
      url: 'http://localhost:8080/api/plaid/transactions',
      method: 'GET'
    })
    console.log(finDataHolder.response, 'THIS IS FINDATA')
  }

  handleOnExit(error, metadata) {
    // handle the case when your user exits Link
    console.log('link: user exited')
    console.log(error, metadata)
  }

  render() {
    return (
      <div>
        <PlaidLink
          clientName="Cash Flow"
          env="sandbox"
          product={['auth', 'transactions']}
          publicKey="498272ecf14c471af0dd91aec416e6"
          onExit={this.handleOnExit}
          onSuccess={this.handleOnSuccess}
        >
          Connect your Bank Account
        </PlaidLink>
      </div>
    )
  }
}

export default PlaidLinkComponent

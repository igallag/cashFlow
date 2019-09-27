import React from 'react'
import PlaidLink from 'react-plaid-link'
import util from '../plaidUtils'

class PlaidLinkComponent extends React.Component {
  handleOnSuccess(token, metadata) {
    console.log('SUCCESS')
    util({
      parameters: {
        token: token,
        metadata: metadata
      },
      url: 'http://localhost:8080/api/plaid/get_access_token',
      method: 'POST',
      onError: function() {
        console.log('onError')
      },
      onLoad: function(statusCode, responseBody) {
        // console.log(responseBody, 'this is responseBody in handleSuccess>onLoad')
        util({
          parameters: {
            access_token: responseBody.access_token,
            item_id: responseBody.item_id,
            error: responseBody.error
          },
          url: 'http://localhost:8080/api/plaid/auth',
          method: 'GET'
        })
      }
    })
  }

  handleOnExit(error, metadata) {
    // handle the case when your user exits Link
    console.log('link: user exited')
    console.log(error, metadata)
  }

  render() {
    return (
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
    )
  }
}

export default PlaidLinkComponent

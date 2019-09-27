import React from 'react'
import PlaidLink from 'react-plaid-link'
import util from '../plaidUtils'
import {connect} from 'react-redux'
import {getDataThunk} from '../store/dataStore'

class PlaidLinkComponent extends React.Component {
  // constructor(props) {
  //   super(props)
  // }

  componentDidMount() {
    // console.log(this, 'this in class')
  }

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
    accessTokenHolder = util({
      parameters: {
        access_token: publicTokenHolder.access_token,
        item_id: publicTokenHolder.item_id,
        error: publicTokenHolder.error
      },
      url: 'http://localhost:8080/api/plaid/auth',
      method: 'GET'
    })
    // console.log(accessTokenHolder.access_token, 'THIS IS ACCESSTOKENHOLDER')
    finDataHolder = await util({
      parameters: {
        access_token: accessTokenHolder.access_token,
        item_id: accessTokenHolder.item_id,
        error: accessTokenHolder.error
      },
      url: 'http://localhost:8080/api/plaid/transactions',
      method: 'GET'
    })
    console.log(finDataHolder, 'THIS IS FINDATA')
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

const mapDispatchToProps = dispatch => {
  return {
    getData: responseBody => dispatch(getDataThunk(responseBody))
  }
}

export default connect(null, mapDispatchToProps)(PlaidLinkComponent)

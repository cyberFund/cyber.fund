import React from 'react'
import { If, Then, Else } from 'react-if'
import Loading from "./Loading"
import helpers from '../helpers'

class BitcoinPrice extends React.Component {
  constructor(params){
    super(params)
    const data = helpers._btcPrice()
    this.state = {
      btcPrice: data ? helpers.readableNumbers(data) : ''
    }
  }
  render () {
        return (
            <If condition={Boolean(this.state.btcPrice)}>
                <Then><span>${this.state.btcPrice} per&nbsp;Ƀ</span></Then>
                <Else><Loading /></Else>
            </If>
        )
    }
}

export default BitcoinPrice

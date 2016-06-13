import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { $ } from 'meteor/jquery'
import { Cell, Textfield, Button } from 'react-mdl'
import { If, Then, Else } from 'react-if'
import helpers from '../helpers'
import SystemLogo from './SystemLogo'

/* while porting this component from blaze zero thought were given in the process,
    so this code is a mess. PLus api's were changin at the same time.
    TODO: refactor */
class BalanceChecker extends React.Component {
  constructor(params){
    super(params)
    this.state = {
      lastAddress: '',
      lastStatus: '',
      lastData: [],
      queryingAddress: '',
      disabled: false
    }
  }
  _handleChange (e) {
      this.setState({queryingAddress: e.target.value.split('&')[0].trim()})
  }
  _handleSubmit(e){
    e.preventDefault()
    if ($(this.refs.button).attr("disabled")) return
    // if query will not get results in 15 seconds make analytics report
    const timeout = Meteor.setTimeout(()=>{
      analytics.track("balance check", {status: "timeout"})
      this.setState({ disabled: false})
    }, 15000)
    , disableButton = ()=>{ // previously known as toggleButton
        //
        if (timeout) Meteor.clearTimeout(timeout)
        this.setState({ disabled: true })
    }
    , address = this.state.queryingAddress

    disableButton()
    //this.setState({queryingAddress: address});

    Meteor.call("checkBalance", address, (err, result)=>{
        const lastStatus = result[0] == 'error' ? result[1].statusCode : ''
        this.setState({
          lastAddress: address,
          lastStatus: lastStatus,
          lastData: lastStatus ? null : result,
          queryingAddress: '',
          disabled: false
        })
        if (result[0] == 'error') {
          analytics.track("balance check", {status: "success"})
        } else {
          analytics.track("balance check", {status: "failure", address})
        }
    })
  }
  _handleReset(){
    this.setState({
      lastAddress: '',
      lastStatus: '',
      lastData: [],
      queryingAddress: '',
      disabled: false
    })
    $(this.refs.text).val('')
  }

  render (){
    const pr = this.props
    const st = this.state
    return ( //error="Please input an address!" inputClassName="is-invalid"
      <Cell col={pr.col} {...pr}>
          <h6>{pr.title}</h6>
          {st.lastAddress ? (
            <a onClick={this._handleReset} className="red-text reset-all btn-floating btn-tiny red">
                <i
                  className="material-icons tiny right">delete</i>
            </a>
              ) : ''}
          <form onSubmit={this._handleSubmit.bind(this)}>
              <Textfield
                    onChange={this._handleChange.bind(this)}
                    ref="text"
                    label="input address"
                    style={{width: '100%'}}
                    required
                />
            {/*<div className="mdl-textfield mdl-js-textfield">
              <input ref="text" className="mdl-textfield__input mdl-js-textfield" id="balancechecker__input" type="text" required />
              <label className="mdl-textfield__label" htmlFor="balancechecker__input">
                input address
              </label>
            </div> */}
            <Button disabled={st.disabled} ref="button" primary ripple component="button" type="submit">
              Query balance
            </Button>
          </form>
          <If condition={Boolean(st.queryingAddress)}>
              <Then><p>Querying address: {st.queryingAddress}</p></Then>
          </If>
          <If condition={Boolean(st.lastAddress)}>
              <Then>
                  <div>
                      <h6>{st.lastAddress}</h6>
                      <If condition={Boolean(st.lastStatus)}>
                          <Then>
                              {helpers.eq(st.lastStatus, 400) ? 'wrong address' : 'unknown error'}
                          </Then>
                          <Else>
                              <div>
                                  {st.lastData ? st.lastData.map(item => {
                                      console.log(item)
                                      return <div key={item.asset}>
                                                <SystemLogo system={item} className="logo-portfolio" />
                                                <span>{item.asset + ' ' + item.quantity}</span>
                                                <If condition={Boolean(item.vBtc || item.vUsd )}>
                                                    <Then>
                                                        <span>
                                                            {item.vBtc ? `Ƀ${helpers.readableN4(item.vBtc)} ` : null}
                                                            {item.vUsd ? `$${helpers.readableN2(item.vUsd)} ` : null}
                                                        </span>
                                                    </Then>
                                                </If>
                                             </div>
                                  }) : null}
                              </div>
                          </Else>
                      </If>
                  </div>
              </Then>
          </If>
      </Cell>
    )
  }
}

BalanceChecker.defaultProps = {
 title: 'Balance checker widget',
 shadow: 2,
 col: 12
}

BalanceChecker.propTypes = {
 title: PropTypes.string,
 shadow: PropTypes.number,
 col: PropTypes.number
}

export default BalanceChecker

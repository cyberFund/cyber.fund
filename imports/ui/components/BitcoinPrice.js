import React from 'react'

className Bitcoin extends React.Component {
  constructor(params){
    super(params)
    this.state = {
      lastAddress: undefined,
      lastStatus: undefined
    }
  }
  render () {
    return (
      <div className="card">
          <h6>Balance checker widget</h6>
          <div className="card-content">
            {this.state.lastAddress ? (
              <a className="red-text reset-all btn-floating btn-tiny red"<i
                    className="material-icons tiny right">delete</i></a>
                ) : ''}
            <div className="row">
              <div className="input-field col s12">
                <input name="address" type="text" />
                <label>input address</label>
              </div>
            </div>
              <a href="#" className="btn query-balance">Query Balance</a>
              {/* unfinished goes here */}
          </div>

      </div>
  )}
}
/*{{#if lastAddress}}
  <h6>{{lastAddress}} </h6>

    {{#if lastStatus}}
    <div className="row">
      {{#if eq lastStatus 400}} wrong address {{else}} unknown error {{/if}}
    </div>
    {{else}}

      {{#each lastData}}
        <div className="row no-bottom-margin">{{> cgSystemLogo className="logo-portfolio" system=asset}}{{displaySystemName (systemFromId asset)}}:{{quantity}}
          {{#if or vUsd vBtc}}(
            {{#if vBtc}}Ƀ{{readableN4 vBtc}}{{/if}}
            {{#if and vUsd vBtc}}/{{/if}}
            {{#if vUsd}}${{readableN2 vUsd}}{{/if}}
          ){{/if}}</div>
      {{/each}}
    {{/if}}

{{/if}}
{{#if queryingAddress}}
  <p>Querying address: {{queryingAddress}}</p>
{{/if }}*/
export default Bitcoin

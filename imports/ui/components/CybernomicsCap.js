import React, { PropTypes } from 'react'
import { If, Then, Else } from 'react-if'
import { Cell } from 'react-mdl'
import helpers from '../helpers'
import CrowdsaleCard from './CrowdsaleCard'

const CybernomicsCap = props =>{
    const largeText = {fontSize: '136%'}
    const margin = {marginBottom: '14px'}
    return (
      <Cell {...props} className="text-center mdl-card">
          <h4>{props.title}</h4> {/* default is: 'Cybernomics Cap' */}
          <If condition={Boolean(props.capUsd)}>
            <Then>
              <div style={margin}>
                <div style={largeText}>
                  $&nbsp;{helpers.readableN0(props.capUsd)}
                </div>
                <If condition={Boolean(props.capUsdDailyChange)}>
                  <Then>
                    <span className={helpers.greenRedNumber(props.capUsdDailyChange)}>
                      {helpers.percentsToTextUpDown(props.capUsdDailyChange, 4)}
                    </span>
                  </Then>
                  <Else>&nbsp;</Else>
                </If>
              </div>
            </Then>
          </If>
          <If condition={Boolean(props.capBtc)}>
            <Then>
              <div style={margin}>
                  <div style={largeText}>
                    Ƀ&nbsp;{helpers.readableN0(props.capBtc)}
                  </div>
                  <If condition={Boolean(props.capBtcDailyChange)}>
                    <Then>
                      <span className={helpers.greenRedNumber(props.capBtcDailyChange)}>
                        {helpers.percentsToTextUpDown(props.capBtcDailyChange, 4)}
                      </span>
                    </Then>
                    <Else>&nbsp;</Else>
                  </If>
              </div>
            </Then>
          </If>
      </Cell>
  )
}

/*        {{#if capBtc}}
              <p>
                  <span class="enlarge">Ƀ&nbsp;{{readableN0 capBtc}}</span>
                  <br> {{#if capBtcDailyChange}}

                  <span class="{{greenRedNumber capBtcDailyChange}}">
          {{percentsToTextUpDown capBtcDailyChange 4}}</span> {{else}}&nbsp; {{/if}}
              </p>
              {{/if}}*/
CybernomicsCap.defaultProps = {
 title: 'Cybernomics Cap',
 shadow: 2
}

CybernomicsCap.propTypes = {
 title: PropTypes.string,
 shadow: PropTypes.number,
 capBtc: PropTypes.number.isRequired,
 capUsd: PropTypes.number.isRequired,
 capBtcDailyChange: PropTypes.number.isRequired,
 capUsdDailyChange: PropTypes.number.isRequired
}

export default CybernomicsCap

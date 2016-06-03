import React from 'react'

class Card extends React.Component {
  render () {
    return (
      <div className="col s12 m6 l4">
            <div className="card radar-card">
                <a href={`/system/${_id}`}>
                  <div>
                       { _usersStarred.length ? (
                         <div>
                            <span >
                              <i className="material-icons yellow-text">stars</i>
                              <span>{{_usersStarred.length}}</span>
                            </span>
                           </div>
                         ) : null }
                       <div>
                         {{> cgSystemLogo system=this className="logo-fullwh"}}
                       </div>
                  </div>
                  <div>{{displaySystemName this}}</div>
                  <div>{{descriptions.headline}}</div>
                </a>


            </div>
        </div>
  )}
}
/*               <div className="card-content">
                  {{#if cgIsActiveCrowdsale}}
                      <div className="left">
                          <strong>{{daysLeft crowdsales.end_date}} days
                              left</strong>
                      </div>
                      <div className="right">
                          {{#if raised}}
                              <strong>Currently
                                  raised: </strong>{{readableN1 raised}}
                              Ƀ
                          {{/if}}
                      </div>
                      <div style="height: 12px">&nbsp;</div>
                  {{/if}}

                  {{#if cgIsUpcomingCrowdsale}}
                      <div className="left">
                          <strong>{{daysLeft crowdsales.start_date }} days
                              left</strong>
                      </div>
                      <div style="height: 12px">&nbsp;</div>
                  {{/if}}


                  {{#if cgIsPastCrowdsale}}
                      <div className="center-align" style="margin-bottom: 1.6em">
                          {{daysPassed crowdsales.end_date}} days ago
                      </div>

                      <div style="position: absolute; bottom: 0.3em; left: 12px;">
                          {{#if crowdsales.btc_raised}}<strong>
                              {{readableN0 crowdsales.btc_raised}}
                              Ƀ raised</strong>{{else}}&nbsp;{{/if}}
                      </div>

                      <div style="position: absolute; bottom: 0.3em; right: 12px;">
                          {{#if  metrics.cap.btc}}<strong>
                              {{readableN0 metrics.cap.btc}} Ƀ
                              cap</strong>{{else}}&nbsp;{{/if}}
                      </div>
                  {{/if}}


              </div>



                              {{#if crowdsales}}
                                  {{#if not cgIsPastCrowdsale}}
                                      <div className="card-action">
                                          {{#if isAfterNow crowdsales.end_date}}
                                              <a href="{{crowdsales.funding_terms}}"
                                                 target="_blank">Funding terms </a>
                                          {{/if}}
                                          {{#if cgIsActiveCrowdsale}}
                                              <a href="{{crowdsales.funding_url}}"
                                                 target="_blank">Invest</a>
                                          {{/if}}
                                      </div>
                                  {{/if}}
                              {{/if}}


              */

export default Card

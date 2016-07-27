import React, { PropTypes } from 'react'
import { Card, CardTitle, CardText, CardActions, CardMenu, IconButton, Cell, Button } from 'react-mdl'
import moment from 'moment'
import get from 'oget'
import helpers from '../helpers'
import SystemLink from '../components/SystemLink'

// TODO: refactoring needed. Hint: maybe separate into multiple components?

const CrowdsaleCard = (props) => {
	
    /* CARDFOOTER */
    const CardFooter = () => {
      // variables
	  /* some documents do not have proper structure, so
	     "cannot read property of undefined" can occur anywhere
	     so seems like brute force checking existence of data is the only way */
      const {item} = props,
            fundUrl = get(item, 'crowdsales.funding_url', ''),
            termsUrl = get(item, 'crowdsales.funding_terms', ''),
            btcRaised = get(item, 'crowdsales.btc_raised', 0),
            btcCap = get(item, 'metrics.cap.btc', ''),
            startDate = get(item, 'crowdsales.start_date', ''),
            endDate = get(item, 'crowdsales.end_date', '')
      // null because react does not like "undefined"
      let footerTop = null
      let footerBottom = null

      function daysLeft (date) {
                return moment(date).diff( moment(), 'days')
      }
      function currentlyRaised () {
                let value = get(item, 'metrics.currently_raised') || btcRaised
                return CF.Utils.formatters.readableN1(value)
      }

      // different card types require different footer
      // function returns boolean
      function displayFooter (type) {
          const fundLink = <Button key="1" component="a" href={fundUrl} target="blank" colored>Invest</Button>
          const termsLink = <Button key="2" component="a" href={termsUrl} target="blank" colored>Funding Terms</Button>
          switch (type) {
            case 'active':
              footerTop = <div className="mdl-card__supporting-text" style={{width: 'auto'}}>
                            <strong className="left">{daysLeft(endDate) + ' days left'}</strong>
                            <span className="right"><strong>Currently raised: </strong> {currentlyRaised() + ' Ƀ'}</span>
                          </div>
              // return two links if they exists
              if (termsUrl && fundUrl) footerBottom = <CardActions border>{[termsLink, fundLink]}</CardActions>
              // else return one of them or none
              else footerBottom = <CardActions border>{termsLink ? termsLink : fundLink ? fundLink : null}</CardActions>
              return true
            case 'upcoming':
              footerTop = <div className="mdl-card__supporting-text" style={{width: 'auto'}}>
                            <strong className="left">{daysLeft(startDate) + ' days left'}</strong>
                          </div>
              // return termsLink if it exists
              footerBottom = <CardActions border>{termsLink ? termsLink : null}</CardActions>
              return true
            case 'past':
              const readableBtcCap = CF.Utils.formatters.readableN0(btcCap)
              footerTop = <div className="mdl-card__supporting-text" style={{width: 'auto'}}>
                            <p className="text-center">{`${moment().diff(moment(endDate), 'days')} days ago`}</p>
                            <strong className="left">{`${CF.Utils.formatters.readableN0(btcRaised)} Ƀ raised`}</strong>
                            <strong className="right">
                                {/* specifically check against zero because  ternary operator (?) returns 0 = true*/}
                                {readableBtcCap != 0 ? `${readableBtcCap} Ƀ cap` : ''}
                            </strong>
                          </div>
              return true
            // in projects footer is not needed
            case 'projects':
            default:
              return false
          }
      }

      // render footer or not
      return displayFooter(props.type) ? <div>{footerTop}{footerBottom}</div> : null
    }

    /* CARDMAIN */
    /* variables */
    const 	{ item } = props,
            nickname = get(item, 'aliases.nickname', item._id),
            usersStarred = get(item, '_usersStarred.length', 0)

    /* styles */
    const cardStyle = {width: 'auto'},
            linkStyle = {color: 'inherit', textDecoration: 'none'},
            imageStyle = {
                height: '176px',
                background: `url(${CF.Chaingear.helpers.cgSystemLogoUrl(item)}) no-repeat center / contain`
            }

    /* sizes */
    const bigCard =  <Cell col={4} tablet={4} phone={4}  {...props} >
                        <Card className="hover-shadow" shadow={2} style={cardStyle}>
                          <a href={`/system/${item._id.replace(/\ /g, "_")}`} style={linkStyle}>
                            <div className="text-right" style={{margin: '15px 15px 0'}}>
                                <i className="material-icons"
                                  style={{fontSize: "1.8rem", verticalAlign: "text-bottom", color: '#ffeb3b'}}>
                                  stars
                                </i>
                                <span style={{fontSize: '1.7rem', margin: 'auto'}}>{usersStarred}</span>
                            </div>
                            <div style={imageStyle}></div>
                            {/*<CardTitle style={titleStyle}>{nickname}</CardTitle>*/}
                            <CardText>
                              <h2 className="mdl-card__title-text">{nickname}</h2>
                              <p style={{minHeight: 48}}>{item.descriptions.headline}</p>
                            </CardText>
                          </a>
                          {CardFooter()}
                        </Card>
                      </Cell>

    const smallCard = <SystemLink system={item} card />

	// choose which card to return
    switch (props.size) {
	    case 'small':
	        return smallCard
	    case 'big':
	    default:
	        return bigCard
    }
}

CrowdsaleCard.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['active', 'upcoming', 'past', 'projects']),
  size: PropTypes.oneOf(['big', 'small', ''])
}

export default CrowdsaleCard

import React, { PropTypes } from 'react'
import { Card, CardTitle, CardText, CardActions, CardMenu, IconButton, Cell, Button } from 'react-mdl'
import moment from 'moment'
// TODO: refactoring needed. Hint: maybe separate into multiple components?
/* some documents do not have proper structure, so
   "cannot read property of undefined" can occur anywhere
   so seems like brute force checking existence of data is the only way */

const CardFooter = (props) => {
  /* variables */
  const {item, type} = props,
        {crowdsales} = item
  const fundUrl = crowdsales && crowdsales.funding_url ? crowdsales.funding_url : '',
        termsUrl = crowdsales && crowdsales.funding_terms ? crowdsales.funding_terms : '',
        fundLink = <Button key="1" component="a" href={fundUrl} target="blank" colored>Invest</Button>,
        termsLink = <Button key="2" component="a" href={termsUrl} target="blank" colored>Funding Terms</Button>,
        btcRaised = crowdsales && crowdsales.btc_raised ? crowdsales.btc_raised : '',
        btcCap = item.metrics && item.metrics.cap && item.metrics.cap.btc ? item.metrics.cap.btc : '',
        startDate = item.crowdsales && item.crowdsales.start_date ? item.crowdsales.start_date : '',
        endDate = item.crowdsales && item.crowdsales.end_date ? item.crowdsales.end_date : '',
        daysLeft = date => { return moment(date).diff( moment(), 'days') }
        currentlyRaised = () => {
            let value = () => {
              if (item.metrics && item.metrics.currently_raised) return item.metrics.currently_raised
              if (item.crowdsales && item.crowdsales.btc_raised) return item.crowdsales.btc_raised
              return 0
            }
            return CF.Utils.formatters.readableN1(value())
        }
  // set empty variables to null because react does not like "undefined"
  let footerTop = null, footerBottom = null
  /* end of variables */

  // different card types require different footer
  // function returns boolean
  function displayFooter (type) {
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
          footerTop = <div className="mdl-card__supporting-text" style={{width: 'auto'}}>
                        <p className="text-center">{`${moment().diff(moment(endDate), 'days')} days ago`}</p>
                        <strong className="left">{`${CF.Utils.formatters.readableN0(btcRaised)} Ƀ raised`}</strong>
                        <strong className="right">{`${CF.Utils.formatters.readableN0(btcCap)} Ƀ cap`}</strong>
                      </div>
          return true
        // in projects footer is not needed
        case 'projects':
        default:
          return false
      }
  }

  // render footer or not
  return displayFooter(type) ? <div>{footerTop}{footerBottom}</div> : null
}

const CrowdsaleCard = (props) => {
    /* variables */
    const item = props.item
    // nickname = aliases.nickname or _id
    let nickname = item.aliases && item.aliases.nickname ? item.aliases.nickname : item._id
    let usersStarred = item._usersStarred && item._usersStarred.length ? item._usersStarred.length : 0

    /* styles */
    const cardStyle = {width: 'auto'} //, clear: 'both'
    const linkStyle = {color: 'inherit', textDecoration: 'none'}
    const imageStyle = {height: '176px', background: `url(${CF.Chaingear.helpers.cgSystemLogoUrl(item)}) no-repeat center / contain`}

    return <Cell col={4} tablet={4} phone={4}>
            <Card className="hover-shadow" shadow={2} style={cardStyle}>
              <a href={`/system/${item._id.replace(/\ /g, "_")}`} style={linkStyle}>
                <div className="text-right" style={{margin: '10px 10px 0'}}>
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
                  <p>{item.descriptions.headline}</p>
                </CardText>
              </a>
              <CardFooter {...props} />
            </Card>
          </Cell>
}

CrowdsaleCard.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['active', 'upcoming', 'past', 'projects'])
}

export default CrowdsaleCard

import React, { PropTypes } from 'react'
import { Card, CardTitle, CardText, CardActions, CardMenu, IconButton, Cell, Button } from 'react-mdl'
import moment from 'moment'

/* some documents do not have proper structure, so
   "cannot read property of undefined" can occur anywhere
   so seems like brute force checking existence of data is the only way */

const CardFooter = (props) => {
  /* variables */
  const {item, type} = props,
        {crowdsales} = item
  const btcRaised = crowdsales && crowdsales.btc_raised ? crowdsales.btc_raised : ''
        fundUrl = crowdsales && crowdsales.funding_url ? crowdsales.funding_url : '',
        termsUrl = crowdsales && crowdsales.funding_terms ? crowdsales.funding_terms : '',
        fundLink = <Button key="1" component="a" href={fundUrl} target="blank" colored>Invest</Button>,
        termsLink = <Button key="2" component="a" href={termsUrl} target="blank" colored>Funding Terms</Button>
  // different card types require different footer
  function chooseFooter (type) {
      switch (type) {
        case 'active':
          // return two links if they exists
          if (termsUrl && fundUrl) return [termsLink, fundLink]
          // else return one of them or none
          else return termsLink ? termsLink : fundLink ? fundLink : null
        case 'upcoming':
          // return termsLink if it exists
          return termsLink ? termsLink : null
        case 'past':
          return `?? days ago, ${btcRaised} raised, ?? cap`
        // in projects footer is not needed
        case 'projects':
        default:
          return null
      }
  }
  return chooseFooter(type) ? <CardActions border>{chooseFooter(type)}</CardActions> : null
}

const CrowdsaleCard = (props) => {
    /* variables */
    const item = props.item
    let nickname = item.aliases && item.aliases.nickname ? item.aliases.nickname : ''
    let usersStarred = item._usersStarred && item._usersStarred.length ? item._usersStarred.length : 0
    let endDate = item.crowdsales && item.crowdsales.end_date ? item.crowdsales.end_date : ''
    let currentlyRaised = () => {
        let value = () => {
          if (item.metrics && item.metrics.currently_raised) return item.metrics.currently_raised
          if (item.crowdsales && item.crowdsales.btc_raised) return item.crowdsales.btc_raised
          return 0
        }
        return CF.Utils.formatters.readableN1(value())
      }
    const currentlyRaisedText = [<strong key="0">Currently raised: </strong>, currentlyRaised(), ' Ƀ']

    /* styles */
    const cardStyle = {width: 'auto'}
    const linkStyle = {color: 'inherit', textDecoration: 'none'}
    const titleStyle = {height: '176px', background: `url(${CF.Chaingear.helpers.cgSystemLogoUrl(item)}) no-repeat center / contain`}

    return <Cell col={4} tablet={4} phone={4} shadow={1}>
            <Card style={cardStyle}>
              <span style={{textAlign: 'right'}}>
                <i className="material-icons"
                  style={{fontSize: "1.8rem", verticalAlign: "text-bottom", color: '#ffeb3b'}}>
                  stars
                </i>
                <span style={{fontSize: '1.7rem', margin: 'auto'}}>{usersStarred}</span>
              </span>
              <a href={`/system/${item._id}`} style={linkStyle}>
                <CardTitle style={titleStyle}>{nickname}</CardTitle>
                <CardText>{item.descriptions.headline}</CardText>
              </a>
              <CardFooter {...props} />
            </Card>
          </Cell>
}

CrowdsaleCard.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string
}

export default CrowdsaleCard

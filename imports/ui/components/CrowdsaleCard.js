import React, { PropTypes } from 'react'
import { Card, CardTitle, CardText, CardActions, CardMenu, IconButton, Cell, Button } from 'react-mdl'

const CardFooter = (props) => {

}
const CardMain = (props) => {

}

const CrowdsaleCard = (props) => {
    /* variables */
    const item = props.item
    /* some documents do not have proper structure, so
       "cannot read property of undefined" can occur anywhere
       so seems like brute force checking existence of data is the only way */
    let nickname = item.aliases && item.aliases.nickname ? item.aliases.nickname : ''
    let fundUrl = item.crowdsales && item.crowdsales.funding_url ? item.crowdsales.funding_url : ''
    let fundTerms = item.crowdsales && item.crowdsales.funding_terms ? item.crowdsales.funding_terms : ''
    let usersStarred = item._usersStarred && item._usersStarred.length ? item._usersStarred.length : 0
    let btcRaised = item.crowdsales && item.crowdsales.btc_raised ? item.crowdsales.btc_raised : ''

    // different card types require different footer
    function chooseFooter (type) {
      const termsLink = <Button component="a" href={fundTerms} target="blank" colored>Funding Terms</Button>
      const fundLink = <Button component="a" href={fundUrl} target="blank" colored>Invest</Button>
      switch (type) {
        case 'active':
          // return two links if they exists
          if (fundTerms && fundUrl) return <CardActions border>{termsLink}{fundLink}</CardActions>
          // else return one of them or none
          else return <CardActions border>
                        {termsLink ? termsLink : fundLink ? fundLink : null}
                      </CardActions>
        case 'upcoming':
          // return fund terms link if it exists
          return <CardActions border>{termsLink ? termsLink : null}</CardActions>
        case 'past':
          return <CardActions border>{`?? days ago, ${btcRaised} raised, ?? cap`}</CardActions>
        // in projects footer is not needed
        case 'projects':
        default:
          return null
      }
    }

    /* styles */
    const cardStyle = {width: 'auto'}
    const linkStyle = {color: 'inherit', textDecoration: 'none'}
    const titleStyle = {height: '176px', background: `url(${CF.Chaingear.helpers.cgSystemLogoUrl(item)}) no-repeat center / contain`}

    return <Cell col={4} tablet={4} phone={4} shadow={1}>
            <Card style={cardStyle}>
              <a href={`/system/${item._id}`} style={linkStyle}>
                <CardTitle style={titleStyle}>
                  {nickname}
                </CardTitle>
                <CardText>
                    {item.descriptions.headline + ' ' + usersStarred}
                </CardText>
              </a>
              {chooseFooter(props.type)}
            </Card>
          </Cell>
}

/* <template name="hitryImage">
    <img src="{{img_url}}"
         itemprop="{{itemprop}}"
         itemmeta="{{itemmeta}}"
         style="{{style}}"
         class="{{class}} hidden"/>
</template>
*/

/*<CardMenu style={{color: '#fff'}}>
    <IconButton name="stars" />
</CardMenu>*/

CrowdsaleCard.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string
}

export default CrowdsaleCard

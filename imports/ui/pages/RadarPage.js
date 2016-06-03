import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import CrowdsalesList from '../components/CrowdsalesList'
import { Card, CardTitle, CardText, CardActions, Button, CardMenu, IconButton, Grid, Cell } from 'react-mdl'


class RadarPage extends Component {
  render() {
    const p = this.props
    // TODO: make proper loading indication
    const loadingIndicator = (<h3 className="center">Scanning cyberspace</h3>)

    return (// p.loaded ?
  <div style={{width: '80%', margin: 'auto', textAlign: 'center'}}>
    <Grid>
      <Cell col={12}>
        <Card shadow={1} style={{width: '512px', margin: 'auto'}}>
            <CardTitle style={{color: '#fff', height: '176px', background: 'url(http://www.getmdl.io/assets/demos/welcome_card.jpg) center / cover'}}>Welcome</CardTitle>
            <CardText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Mauris sagittis pellentesque lacus eleifend lacinia...
            </CardText>
            <CardActions border>
                <Button colored>Get Started</Button>
            </CardActions>
            <CardMenu style={{color: '#fff'}}>
                <IconButton name="stars" />
            </CardMenu>
        </Card>
      </Cell>
    </Grid>
    <Grid>
        <Cell col={12}>
          <h2>Free Services For Ingenious Inventors</h2>
          <p>If you excited about creating or already working on a blockchain project you have awesome free option to list your project in cyber•Fund's Radar.</p>
        </Cell>
    </Grid>
    <Grid>
        <Cell col={4} tablet={4} phone={12}>
            <i style={{color: '#ffeb3b', fontSize: '6em'}} className="material-icons">school</i>
            <h5>Due Diligence</h5>
        </Cell>
        <Cell col={4} tablet={4} phone={12}>
            <i style={{color: '#cddc39', fontSize: '6em'}} className="material-icons">group</i>
            <h5>Engaged Audience</h5>
        </Cell>
        <Cell col={4} tablet={12} phone={12}>
            <i style={{color: '#e91e63', fontSize: '6em'}} className="material-icons">whatshot</i>
            <h5>Blockchain Reporting</h5>
        </Cell>
    </Grid>
    <Grid>
      <Cell col={12}>
        <a
          className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
          href="http://cybertalks.org/t/radar-listing-of-cryptocurrencies-and-cryptoassets/354"
          target="blank">
          Get Listed!
        </a>
      </Cell>
    </Grid>
  </div>
    ) // : <Loading />
  }
}

RadarPage.propTypes = {
 crowdsales: PropTypes.array.isRequired,
 projects: PropTypes.array.isRequired,
 past: PropTypes.array.isRequired,
 upcoming: PropTypes.array.isRequired,
 active: PropTypes.array.isRequired
}

export default createContainer(() => {
  Meteor.subscribe('crowdsalesAndProjectsList')
  const {selectors} = CF.CurrentData,
  crowdsales = CurrentData.find(selectors.crowdsales()).fetch(),
  projects =  CurrentData.find({
    $or: [{
      'crowdsales.start_date': {
        $gt: new Date()
      }
    }, {
      'crowdsales.start_date': {
        $exists: false
      }
    }],
    $and: [
    selectors.projects()]
  }, {
    sort: {
      "calculatable.RATING.vector.LV.sum": -1
    }
  }).fetch(),
  past = CurrentData.find({
    $and: [selectors.crowdsales(), {
      'crowdsales.end_date': {
        $lt: new Date()
      }
    }]
  }, {
    sort: {
      'crowdsales.end_date': -1
    }
  }).fetch(),
  upcoming = CurrentData.find({
    $and: [selectors.crowdsales(), {
      'crowdsales.start_date': {
        $gt: new Date()
      }
    }]
  }, {
    sort: {
      'crowdsales.start_date': 1
    }
  }).fetch(),
  active = CurrentData.find({
    $and: [selectors.crowdsales(), {
      'crowdsales.end_date': {
        $gt: new Date()
      }
    }, {
      'crowdsales.start_date': {
        $lt: new Date()
      }
    }]
  }, {sort: {"metrics.currently_raised": -1}}).fetch()
  console.log('everything is fine!')
  console.log(crowdsales, projects, past, upcoming, active)
  return {crowdsales, projects, past, upcoming, active}
}, RadarPage)

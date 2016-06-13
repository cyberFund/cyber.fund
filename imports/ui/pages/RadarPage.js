import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import CrowdsaleCardList from '../components/CrowdsaleCardList'
import { Card, CardTitle, CardText, CardActions, Button, CardMenu, IconButton, Grid, Cell } from 'react-mdl'


class RadarPage extends Component {
  render() {
    const p = this.props
    // TODO: make proper loading indication
    // const loadingIndicator = (<h3 className="center">Scanning cyberspace</h3>)

    return (
      <div id="RadarPage">
        {/* INFO SECTION */}
        <CrowdsaleCardList title="Active Crowdsales" titleComponent="h2" type="active" items={p.active} />
        <CrowdsaleCardList title="Upcoming Crowdsales" titleComponent="h2" type="upcoming" items={p.upcoming} />
        <CrowdsaleCardList title="Anticipated Projects" titleComponent="h2" type="projects" items={p.projects} />
        <CrowdsaleCardList title="Successful Crowdsales" titleComponent="h2" type="past" items={p.past} />
        {/* CALL TO ACTION */}
        <div className="text-center">
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
              <Button raised accent ripple component="a"
                href="http://cybertalks.org/t/radar-listing-of-cryptocurrencies-and-cryptoassets/354"
                target="blank">
                Get Listed!
              </Button>
            </Cell>
          </Grid>
        </div>
      </div>
    )
  }
}

RadarPage.propTypes = {
 projects: PropTypes.array.isRequired,
 past: PropTypes.array.isRequired,
 upcoming: PropTypes.array.isRequired,
 active: PropTypes.array.isRequired
}

export default createContainer(() => {
  Meteor.subscribe('crowdsalesAndProjectsList')
  const {selectors} = CF.CurrentData,
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
  // seems like we don't use all of these
  return { projects, past, upcoming, active }
}, RadarPage)

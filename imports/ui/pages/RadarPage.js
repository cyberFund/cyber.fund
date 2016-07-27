import React, { PropTypes } from 'react'
import Loading from '../components/Loading'
import CrowdsaleCardList from '../components/CrowdsaleCardList'
import { Card, CardTitle, CardText, CardActions, Button, CardMenu, IconButton, Grid, Cell } from 'react-mdl'


const RadarPage = props => {
    // TODO: make proper loading indication
    // const loadingIndicator = (<h3 className="center">Scanning cyberspace</h3>)

    return props.loaded ? (
      <div id="RadarPage">

        {/* INFO SECTION */}
        <CrowdsaleCardList title="Active Crowdsales" type="active" items={props.active} />
        <CrowdsaleCardList title="Upcoming Crowdsales" type="upcoming" items={props.upcoming} />
        <CrowdsaleCardList title="Anticipated Projects" type="projects" items={props.projects} />
        <CrowdsaleCardList title="Successful Crowdsales" type="past" items={props.past} />

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
    ) : <Loading />
}

RadarPage.propTypes = {
 projects: PropTypes.array.isRequired,
 past: PropTypes.array.isRequired,
 upcoming: PropTypes.array.isRequired,
 active: PropTypes.array.isRequired,
 loaded: PropTypes.bool.isRequired
}

export default RadarPage

import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Card, CardTitle, CardText, CardActions, Button, CardMenu, IconButton, Grid, Cell } from 'react-mdl'
import Top5Assets from '../components/Top5Assets'

class IndexPage extends Component {
  render() {
    return ( //this.props.loaded ?
      <div id="IndexPage" className="center">
        {/* HEADERS */}
        <Grid>
          <Cell col={12}>
            <h2>Blockchains Grow Here</h2>
            <h5>{this.props.usersCount} people are ready to invest in {this.props.coinsCount} groundbreaking systems</h5>
          </Cell>
        </Grid>
        {/* ASSETS TABLE */}
        {/* Top5Assets is table component, but can act as a wrapper */}
        <Top5Assets>
          <Cell col={12} className="text-center">
            <Button component="a" href="/rating" style={{margin: '0 5px'}} raised colored>Start Investing</Button>
            <Button component="a" href="/listing" style={{margin: '0 5px'}} raised disabled>Attract Investments</Button>
          </Cell>
        </Top5Assets>
      </div>
    )// : <Loading />
  }
}

IndexPage.propTypes = {
 //skills: PropTypes.array.isRequired,
 //numberOfSkills: PropTypes.number.isRequired
}

export default IndexPage

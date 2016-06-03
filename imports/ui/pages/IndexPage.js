import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Card, CardTitle, CardText, CardActions, Button, CardMenu, IconButton, Grid, Cell } from 'react-mdl'
import Top5Assets from '../components/Top5Assets'

class IndexPage extends Component {
  render() {
    return ( //this.props.loaded ?
      <div id="IndexPage" className="center">
        <Grid>
          <Cell col={12} align="middle">
            <h2>Blockchains Grow Here</h2>
            <h5>{this.props.usersCount} people are ready to invest in {this.props.coinsCount} groundbreaking systems</h5>
          </Cell>
        </Grid>
        <Top5Assets />
      </div>
    )// : <Loading />
  }
}

IndexPage.propTypes = {
 //skills: PropTypes.array.isRequired,
 //numberOfSkills: PropTypes.number.isRequired
}

export default IndexPage

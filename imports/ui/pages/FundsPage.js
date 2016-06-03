import React, { Component, PropTypes } from 'react'
/*import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { $ } from 'meteor/jquery'
import { Counts } from 'meteor/tmeasday:publish-counts'
import { Skills } from '../../api/skills.js'
import List from '../components/List'
import Loading from '../components/Loading'*/

class FundsPage extends Component {
  render() {
    return ( //this.props.loaded ?
      <div>
        <h1>HELLO WORLD! <br/> THIS IS FUNDS PAGE</h1>
    </div>
  )// : <Loading />
  }
}

FundsPage.propTypes = {
 //skills: PropTypes.array.isRequired,
 //numberOfSkills: PropTypes.number.isRequired
}

export default FundsPage

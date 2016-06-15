import React from 'react'
import Blaze from 'meteor/gadicc:blaze-react-component'
import { Grid, Cell } from 'react-mdl'

const ProfilePage = props => {
    return (
          <Grid id="LoginPage">
              <Cell col={12}>
                  <h1>HELLO WORLD! THIS IS PROFILE PAGE</h1>
                  <h2>CURRENTLY UNDER CONSTRUCTION</h2>
                  <Blaze template="atForm" />
              </Cell>
          </Grid>
    )
}

export default ProfilePage

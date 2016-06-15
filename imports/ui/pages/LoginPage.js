import React from 'react'
import Blaze from 'meteor/gadicc:blaze-react-component'
import { Grid, Cell } from 'react-mdl'

const LoginPage = props => {
    return (
          <Grid id="LoginPage">
              <Cell col={12}>
                  <Blaze template="atForm" />
              </Cell>
          </Grid>
    )
}

export default LoginPage

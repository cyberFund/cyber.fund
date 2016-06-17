import React from 'react'
import { Grid, Cell } from 'react-mdl'
import Loading from '../components/Loading'

const ProfilePage = props => {
    return props.loaded ? (
          <Grid id="LoginPage">
              {/* USER INFO */}
              <Cell col={12}>
                  avatar
                  name
                  info
                  starred
                  followers
                  following
                  logout button
              </Cell>
              {/* PORTFOLIO */}
              <Cell col={12}>
                  tab 1:
                  header
                  video
                  graph
              </Cell>
              {/* ACCOUNTS */}
              <Cell col={12}>
                  tab:
                  blank
              </Cell>
          </Grid>
    ) : <Loading />
}

export default ProfilePage

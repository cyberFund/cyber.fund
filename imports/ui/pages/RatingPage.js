import React from 'react'
import { Grid, Cell } from 'react-mdl'
import Hiring from '../components/Hiring'
import RatingTableContainer from '../containers/RatingTableContainer'

const RatingPage = props => {
      return <Grid id="RatingPage">
                <Cell col={12}> <Hiring /> </Cell>
                <Cell col={12}> <RatingTableContainer /> </Cell>
              </Grid>
 }

export default RatingPage

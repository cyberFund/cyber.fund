import React, { PropTypes } from 'react'
import { Grid, Cell } from 'react-mdl'
import Loading from '../components/Loading'

const FundsPage = props => {
    return props.loaded ? ( //this.props.loaded ?
        <Grid>
            <Cell col={12}>
                Top Funds You Follow
                table
            </Cell>
            <Cell col={12}>
                Top Funds You Don't Follow
                We currently only list here people with 3+ followers
                table
            </Cell>
        </Grid>
  ) : <Loading />
}

FundsPage.propTypes = {
 //skills: PropTypes.array.isRequired,
 //numberOfSkills: PropTypes.number.isRequired
}

export default FundsPage

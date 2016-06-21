import React, { PropTypes } from 'react'
import { Grid, Cell, Button } from 'react-mdl'
import { Show, Hide } from '../components/Utils'
import FundsTable from '../components/FundsTable'
import Loading from '../components/Loading'

const FundsPage = props => {
    return props.loaded ? (
        <Grid id="FundsPage" className="text-center">
            <Cell col={12}>
                <Show condition={Meteor.userId()}>
                    <div>
                        <h4>Top Funds You Follow</h4>
                        <FundsTable funds={props.fundsIfollow} />
                    </div>
                </Show>
                <Hide condition={Meteor.userId()}>
                        <Button href="/welcome" raised accent ripple>Join Us</Button>
                 </Hide>
            </Cell>
            <Cell col={12}>
                <h4>Top Funds You Don't Follow</h4>
                <p>We currently only list here people with 3+ followers</p>
                <FundsTable funds={props.fundsIdontFollow} />
            </Cell>
        </Grid>
    ) : <Loading />
}

FundsPage.propTypes = {
 fundsIfollow: PropTypes.array.isRequired,
 fundsIdontFollow: PropTypes.array.isRequired
}

export default FundsPage

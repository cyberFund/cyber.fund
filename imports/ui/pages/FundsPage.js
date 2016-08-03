import React, { PropTypes } from 'react'
import { Grid, Cell, Button } from 'react-mdl'
import { Show, Hide } from '../components/Utils'
import FundsTable from '../components/FundsTable'
import PageLoading from '../higherOrderComponents/PageLoading'

const FundsPage = props => {
    return 	<Grid id="FundsPage" className="text-center">
	            <Cell col={12}>
	                <Show condition={Meteor.userId()}>
                        <h4>Top Funds You Follow</h4>
                        <FundsTable funds={props.fundsIfollow} />
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
}

FundsPage.propTypes = {
	fundsIfollow: PropTypes.array.isRequired,
	fundsIdontFollow: PropTypes.array.isRequired
}

export default PageLoading(FundsPage)

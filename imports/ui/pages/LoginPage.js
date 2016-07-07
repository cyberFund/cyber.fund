import React from 'react'
import Blaze from 'meteor/gadicc:blaze-react-component'
import { Grid, Cell } from 'react-mdl'

const LoginPage = props => {
    return 	<Grid id="LoginPage">
				<section className="mdl-shadow--4dp hover-shadow">
            		<Blaze template="atForm" />
				</section>
			</Grid>
}

export default LoginPage

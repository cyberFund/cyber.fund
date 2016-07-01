import React, { PropTypes } from 'react'
import { Grid, Cell, Icon, Button, Tabs, Tab } from 'react-mdl'
import { If } from '../components/Utils'

class SystemLinks extends React.Component {
	constructor(params) {
		super(params)
		this.state = {
			activeTab: 0,
			// if there are more than 8 links display tabs
			displayTabs: this.props.links.length > 8
		}
	}
	changeTab(activeTab) {
		console.log(activeTab)
		this.setState({activeTab})
	}
	render() {
		const {state, props, setState, changeTab, displayTabs} = this
		return  <Grid className="text-center">
					<Cell col={12} tablet={8} phone={4} >
						{/* TAB SELECTOR */}
						<If condition={state.displayTabs}>
							<Tabs activeTab={state.activeTab} onChange={changeTab.bind(this)} ripple>
								<Tab>Buy</Tab>
								<Tab>Hold</Tab>
								<Tab>Analyze</Tab>
								<Tab>Earn</Tab>
							</Tabs>
						</If>
						{/* CONTENT */}
						<section>
							  {props.links.map( (link, index) => <p key={index}>{link.name}</p> )}
						</section>
					</Cell>
				</Grid>
	}
}

SystemLinks.propTypes = {
	links: PropTypes.array.isRequired
}

export default SystemLinks

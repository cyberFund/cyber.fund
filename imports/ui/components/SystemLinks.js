import React, { PropTypes } from 'react'
import { Grid, Cell, Icon, Button, Tabs, Tab } from 'react-mdl'
import { If } from '../components/Utils'
import helpers from '../helpers'

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
		this.setState({activeTab})
	}
	renderLinksArea(tag) {
		function renderLinks(tag) {
			//helpers.existLinksWith

			return this.props.links.map( (link, i) => <p key={i}>{link.url}</p>)
		}
		switch (tag) {
			case 0:
				return renderLinks("Exchange")
			case 1:
				return renderLinks("Wallet")
			case 2:
				return renderLinks("Analytics")
			case 3:
				return renderLinks("Magic")
			default:
				return renderLinks()
		}
	}
	render() {
		const {state, props: {links}, setState, changeTab } = this
		const tags = ['Exchange', 'Wallet', 'Analytics', 'Magic']
		// TODO maybe create tabs with vanilla mdl instead of react-mdl?
		return  <Grid className="text-center">
					<Cell col={12}>
						{/* TAB SELECTOR */}
						<If condition={state.displayTabs}>
							<Tabs activeTab={state.activeTab} onChange={changeTab.bind(this)} ripple>
								<If
									condition={helpers.existLinksWith(links, 'Exchange')}
									component={Tab}>
									Buy
								</If>
								<If
									condition={helpers.existLinksWith(links, 'Wallet')}
									component={Tab}>
									Hold
								</If>
								<If
									condition={helpers.existLinksWith(links, 'Analytics')}
									component={Tab}>
									Analyze
								</If>
								<If
									condition={helpers.linksWithoutTags(links, tags)}
									component={Tab}>
									Earn
								</If>
							</Tabs>
						</If>
						{/* CONTENT */}
						<section>
							  {links.map( (link, index) => <p key={index}>{link.name}</p> )}
						</section>
					</Cell>
				</Grid>
	}
}

SystemLinks.propTypes = {
	links: PropTypes.array.isRequired
}

export default SystemLinks

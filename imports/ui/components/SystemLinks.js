import React, { PropTypes } from 'react'
import { Grid, Cell, Icon, Button, Tabs, Tab } from 'react-mdl'
import { _ } from 'meteor/underscore'
import { If } from '../components/Utils'
import ChaingearLink from '../components/ChaingearLink';
import helpers from '../helpers'

class SystemLinks extends React.Component {

	state = {
		activeTab: 0,
		// display tabs if there are alot of links
		displayTabs: this.props.links.length > 8
	}

	render() {

		if (_.isEmpty(this.props.links)) return null

		const 	{ links, systemId } = this.props,
				{ activeTab, displayTabs } = this.state,
				{ linksWithTag, linksWithoutTags, existLinksWith } = helpers,
				tags = ['Exchange', 'Wallet', 'Analytics', 'Magic', 'Earn']

		// renders links area
		function renderLinks(selector, tabIndex) {
			let linksToRender = linksWithTag(links, selector)
			// "Earn" tab needs special kind of data
			if (selector == 'Earn') linksToRender = linksWithoutTags(links, systemId)

			// display element only if tab is active
			return 	<Grid style={{ display: activeTab == tabIndex ? 'display' : 'none' }}>
						{
							linksToRender.map(
								(link, index)=> <ChaingearLink link={link} key={index} card />
							)
						}
					</Grid>
		}

		return  <section>

					{/* TAB SELECTOR */}
					<Grid className="text-center">
						<Cell col={12}>
							<If condition={displayTabs}>
								<Tabs
									activeTab={activeTab}
									onChange={activeTab => this.setState({activeTab})}
									ripple
								>
									<If condition={existLinksWith(links, 'Exchange')} component={Tab}>
										Buy
									</If>
									<If condition={existLinksWith(links, 'Wallet')} component={Tab}>
										Hold
									</If>
									<If condition={existLinksWith(links, 'Analytics')} component={Tab}>
										Analyze
									</If>
									<If condition={existLinksWith(links, 'Magic')} component={Tab}>
										Magic
									</If>
									<If condition={linksWithoutTags(links, systemId)} component={Tab}>
										Earn
									</If>
								</Tabs>
							</If>
						</Cell>
					</Grid>

					{/* CONTENT */}
					{ tags.map(renderLinks) }

				</section>
	}
}

SystemLinks.propTypes = {
	links: PropTypes.array.isRequired,
	systemId: PropTypes.string.isRequired
}

export default SystemLinks

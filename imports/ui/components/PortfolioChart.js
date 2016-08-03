import React, { PropTypes } from 'react'
import { Grid, Cell } from 'react-mdl'
import { _ } from 'meteor/underscore'

// usage example:
// <PortfolioChart />

class PortfolioChart extends React.Component {

	// create wrapper for chart
	render() { return <div className="ct-chart folio-pie"></div> }

	// create chart on mount
	componentDidMount() {
		// get systems
		const data = CF.Accounts.portfolioTableData()
		// chart dependencies
		let	series = [],
			labels = _.keys(data)

		// fill series array with values
		_.map(data, system => {
			var sum = 	_.reduce(
							_.map(data, it => it.vBtc),
							(memo, num) => memo + num,
							0
						)
			series.push(system.vBtc / sum)
		})

		// create chart instance
		new Chartist.Pie('.ct-chart', { labels, series, donut: true })
	}

}

export default PortfolioChart

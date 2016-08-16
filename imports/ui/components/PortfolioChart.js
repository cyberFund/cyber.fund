import React, { PropTypes } from 'react'
import { Cell } from 'react-mdl'
import { _ } from 'meteor/underscore'
import ChartistGraph from 'react-chartist'

// usage example:
// <PortfolioChart assets={array} />

class PortfolioChart extends React.Component {

	render() {

		const { assets } = this.props

		// chart dependencies
		let	series = [],
			labels = _.keys(assets)

		// fill series array with values
		_.map(assets, (system) => {
			var sum = 	_.reduce(
							_.map(assets, it => it.vBtc),
							(memo, num) => memo + num,
							0
						)
			series.push(system.vBtc / sum)
		})

		return 	<Cell col={12} {...this.props}>
					<ChartistGraph data={{ series, labels }} type={'Pie'} className="ct-chart folio-pie" />
				</Cell>

	}

}

PortfolioChart.propTypes = {
	assets: PropTypes.array.isRequired
}

export default PortfolioChart

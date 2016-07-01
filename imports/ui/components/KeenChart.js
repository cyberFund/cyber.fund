import React, { PropTypes } from 'react'

class KeenChart extends React.Component {
	render() {
		return <section id={this.props.id} className='keen-chart'></section>
	}
	componentDidMount() {
		/* TODO why do we need CF.keenflag? What does it do?
		If nothign remove this and ui/startup/keenIo */
		if (!CF.keenflag.get() && !this.props.value) return

		// Create a query instance
		const instance = new Keen.Query('count', {
			eventCollection: 'Viewed System Page',
			filters: [{
			  'operator': 'contains',
			  'property_name': 'path',
			  'property_value': this.props.value
			}],
			interval: 'daily',
			timeframe: 'this_21_days'
		})

		// Basic charting w/ `Keen().draw`:
		new Keen({
			projectId: '55c8be40d2eaaa07d156b99f',
			readKey: '4083b4d7a1ce47a40aabf59102162e3848d0886d457e4b9b57488361edfa28a1e49d2b100b6008299aa38303cd6254d4aa993db64137675d9d8d65928f283573c3932f413ec06050e8e3e9a642485cb6090d742d84da78f247aeb05f709e69f6c2085e9324a277e654bb12434f094412'
		}).draw(
			instance,
			document.getElementById(this.props.id),
			{
			  chartType: 'columnchart',
			  title: 'Page Visits',
			  label: 'test'
			}
		)
	}
}

KeenChart.defaultProps = {
	id: 'keen-chart'
}

KeenChart.propTypes = {
	id: PropTypes.string,
	value: PropTypes.string.isRequired
}

export default KeenChart

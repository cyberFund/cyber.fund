import React, { PropTypes } from 'react'
import { If, Show } from '../components/Utils'
import { Cell } from 'react-mdl'
import helpers from '../helpers'

const Metrics = props =>{
	const { title, usd, btc, usdChange, btcChange } = props
	const { greenRedNumber, percentsToTextUpDown, readableN0 } = helpers

	function renderTextBlock(cap, dailyChange) {
		return 	<If condition={cap}>
					<div style={{marginBottom: 14}}>
						<div className="text-large">
							$ {readableN0(cap)}
						</div>
						<Show condition={dailyChange}>
							<span className={greenRedNumber(dailyChange)}>
								{percentsToTextUpDown(dailyChange, 4)}
							</span>
						</Show>
					</div>
				</If>
	}

    return 	<Cell {...props} className="text-center mdl-card">
				<h4>{title}</h4>
				{renderTextBlock(usd, usdChange)}
				{renderTextBlock(btc, btcChange)}
				{props.children}
    		</Cell>
}

Metrics.defaultProps = {
 shadow: 2,
 // grid properties for <Cell />
 col: 3,
 tablet: 4,
 phone: 4
}

Metrics.propTypes = {
 title: PropTypes.string,
 shadow: PropTypes.number,
 btc: PropTypes.number.isRequired,
 usd: PropTypes.number.isRequired,
 btcChange: PropTypes.number.isRequired,
 usdChange: PropTypes.number.isRequired
}

export default Metrics

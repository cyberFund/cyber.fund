import React, { PropTypes } from 'react'
import { If, Else } from '../components/Utils'
import { Cell } from 'react-mdl'
import helpers from '../helpers'

// usage example
{/*
	<CybernomicsCap
		col={12}
		capUsd={props.capUsd}
		capBtc={props.capBtc}
		capBtcDailyChange={props.capBtcDailyChange}
		capUsdDailyChange={props.capUsdDailyChange}
	/>
*/}

const CybernomicsCap = props =>{

	// renders comparison of cap and dailyChange values
	function renderTextBlock(selector, currencySymbol) {

		const	cap = props[selector],
				dailyChange = props[selector + 'DailyChange'],
				{ readableN0, greenRedNumber, percentsToTextUpDown } = helpers

		return	<If condition={cap}>
				  <div style={{marginBottom: '14px'}}>
					<div className="text-large">
						{currencySymbol} &nbsp; {readableN0(cap)}
					</div>
					<If
						condition={dailyChange}
						className={greenRedNumber(dailyChange)}
						component='span'
					>
						{percentsToTextUpDown(dailyChange, 4)}
					</If>
					<Else condition={dailyChange}>&nbsp;</Else>
				  </div>
				</If>

	}

    return  <Cell {...props} className="text-center mdl-card">
				{/* default is: 'Cybernomics Cap' */}
				<h4>{props.title}</h4>
				{ renderTextBlock('capUsd', '$') }
				{ renderTextBlock('capBtc', 'Ƀ') }
			</Cell>
}

CybernomicsCap.defaultProps = {
 title: 'Cybernomics Cap',
 col: 12,
 shadow: 2
}

CybernomicsCap.propTypes = {
 title: PropTypes.string,
 col: PropTypes.number,
 shadow: PropTypes.number,
 capBtc: PropTypes.number.isRequired,
 capUsd: PropTypes.number.isRequired,
 capBtcDailyChange: PropTypes.number.isRequired,
 capUsdDailyChange: PropTypes.number.isRequired
}

export default CybernomicsCap

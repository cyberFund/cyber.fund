import React, { PropTypes } from 'react'
import { If, Show } from '../components/Utils'
import { Grid, Cell } from 'react-mdl'
import helpers from '../helpers'

const SystemMetrics = props =>{
	const 	{ metrics } = props.system

	let 	todayVolumeUsd = 0,
			yesterdayVolumeUsd = 0,
			todayVolumeBtc = 0,
			yesterdayVolumeBtc = 0,
			usdVolumeChange = 0,
			btcVolumeChange = 0

	// data is not well defined and structure is not always predictable.
	// define variable value safe way to avoid breaking errors
	try {
		todayVolumeUsd = metrics.tradeVolume * metrics.price.usd / metrics.price.btc
		yesterdayVolumeUsd = metrics.price.usd / metrics.price.btc * metrics.tradeVolumePrevious.day
		todayVolumeBtc = metrics.tradeVolume
		yesterdayVolumeBtc = metrics.tradeVolumePrevious.day
		btcVolumeChange = CF.Utils.deltaPercents(
			metrics.tradeVolume,
			metrics.tradeVolumePrevious.day
		),
		usdVolumeChange = CF.Utils.deltaPercents(
			metrics.price.usd / metrics.price.btc * metrics.tradeVolume,
			metrics.price.usd / metrics.price.btc * metrics.tradeVolumePrevious.day
		)
	} catch (err) {
		// do nothing
	}

	function renderGreenOrRedNumber(number) {
		if (!number) return '&nbsp;'
		return	<span className={helpers.greenRedNumber(number)}>
					{ helpers.percentsToTextUpDown(number, 2) }
				</span>
	}

    return 	<Grid className="text-center">
		<Cell col={3} tablet={4} phone={4} shadow={2} className="mdl-card">

				{/* PRICE */}
				<If condition={metrics.price}> {/* do we need this check? */}
						<If condition={metrics.price.usd || metrics.price.btc}> {/* do we need this check? */}
							<h4>Price</h4>
							<If condition={metrics.price.usd}>
								<p>
									<span itemScope itemProp="offers" itemType="http://schema.org/Offer" className="text-large">
										<span itemProp="priceCurrency" content="USD">$&nbsp;</span>
										<span  itemProp="price" content={metrics.price.usd}>
											{/* add normal comparison? */}
											{
												helpers.gte(metrics.price.usd, 0.1)
												? helpers.readableN2(metrics.price.usd)
												: helpers.satoshi_decimals(metrics.price.usd, 6)
											}
										</span>
							        </span>
									<br />
									{renderGreenOrRedNumber(metrics.priceChangePercents.day.usd)}
								</p>
							</If>
							<If condition={metrics.price.btc}>
								<p>
									<span itemProp="offers" itemScope itemType="http://schema.org/Offer" className="text-large">
										<span itemProp="priceCurrency" content="BTC">Ƀ&nbsp;</span>
										<span itemProp="price" content={metrics.price.btc}>
											{helpers.satoshi_decimals(metrics.price.btc, 8)}
										</span>
							        </span>
									<br />
									<If condition={metrics.priceChangePercents.day.btc}>
										{renderGreenOrRedNumber(metrics.priceChangePercents.day.btc)}
									</If>
								</p>
							</If>
						</If>
				</If>
			</Cell>

			{/* CAP */}
			<Cell col={3} tablet={4} phone={4} shadow={2} className="mdl-card">
				<If condition={metrics.cap}> {/* do we need this check? */}
						<If condition={metrics.cap.usd || metrics.cap.btc}> {/* do we need this check? */}
							<h4>Cap</h4>
							<If condition={metrics.cap.usd}>
								<p>
									<span className="text-large">
										{'$ ' + helpers.readableN0(metrics.cap.usd)}
									</span>
									<br />
									{renderGreenOrRedNumber(metrics.capChangePercents.day.usd)}
								</p>
							</If>
							<If condition={metrics.cap.btc}>
								<p>
									<span className="text-large">
										{'Ƀ ' + helpers.readableN0(metrics.cap.btc)}
									</span>
									<br />
									{renderGreenOrRedNumber(metrics.capChangePercents.day.btc)}
								</p>
							</If>
						</If>
				</If>
			</Cell>

			{/* TRADE */}
			<Cell col={3} tablet={4} phone={4} shadow={2} className="mdl-card">
				<If condition={todayVolumeUsd}>
						<h4>Trade</h4>
						<p>
							<span className="text-large">
								{'$ ' + helpers.readableN0(todayVolumeUsd)}
							</span>
							<br />
							{renderGreenOrRedNumber(usdVolumeChange)}
						</p>
						<p>
							<span className="text-large">
								{'Ƀ ' + helpers.readableN0(todayVolumeBtc)}
							</span>
							<br />
							{renderGreenOrRedNumber(btcVolumeChange)}
						</p>
				</If>
			</Cell>

			{/* SUPPLY */}
			<Cell col={3} tablet={4} phone={4} shadow={2} className="mdl-card">
				<If condition={metrics.supply}>
						<h4>Supply</h4>
						<p>
							<span className="text-large">
								{helpers.readableN0(metrics.supply)}
								&nbsp;
								{helpers.displayCurrencyName(props.system) + 's'}
							</span>
							<br />
							{renderGreenOrRedNumber(metrics.supplyChangePercents.day)}
						</p>
						<If condition={metrics.supplyChange} component='p'>
							{ helpers.withSign(metrics.supplyChange.day) }
							&nbsp;
							{ helpers.displayCurrencyName(props.system) + 's' }
						</If>
				</If>
			</Cell>
		</Grid>
}

SystemMetrics.propTypes = {
	system: PropTypes.object.isRequired
}

export default SystemMetrics

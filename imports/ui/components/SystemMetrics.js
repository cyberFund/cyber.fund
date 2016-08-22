import React, { PropTypes } from 'react'
import { If, Show } from '../components/Utils'
import { Grid, Cell } from 'react-mdl'
import helpers from '../helpers'
import get from 'oget'

// TODO add comments, refactoring
const SystemMetrics = props =>{

	const 	{ metrics } = props.system
	if(!metrics.price) return null
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

	function greenOrRedNumber(number) {
		if (!number) return '&nbsp;'
		return	<span className={helpers.greenRedNumber(number)}>
					{ helpers.percentsToTextUpDown(number, 2) }
				</span>
	}
	console.warn(metrics)
	console.warn(metrics.price)
	console.warn(Boolean(metrics.price))
	// when you pass () into If component it will throw an error,
	// because function tries to read data before processing it.
	const 	priceUsd = get(metrics, 'price.usd'),
			priceBtc = get(metrics, 'price.btc'),
			capUsd = get(metrics, 'cap.usd'),
			capBtc = get(metrics, 'capBtc')
	console.warn(priceUsd, priceBtc)
	console.warn(capUsd, capBtc)
    return 	<Grid className="text-center">
				<Cell col={3} tablet={4} phone={4} shadow={2} className="mdl-card">

				{/* PRICE */}
					<Show condition={priceUsd || priceBtc}>
						{ console.warn('THIS MUST NOT BE SHOWN')}
						<h4>Price</h4>
						<Show condition={priceUsd}>
							<p>
								<span itemScope itemProp="offers" itemType="http://schema.org/Offer" className="text-large">
									<span itemProp="priceCurrency" content="USD">$&nbsp;</span>
									<span  itemProp="price" content={priceUsd}>
										{/* add normal comparison? */}
										{
											helpers.gte(priceUsd, 0.1)
											? helpers.readableN2(priceUsd)
											: helpers.satoshi_decimals(priceUsd, 6)
										}
									</span>
						        </span>
								<br />
								{greenOrRedNumber(get(metrics, 'priceChangePercents.day.usd', 0))}
							</p>
						</Show>
						<Show condition={priceBtc}>
							<p>
								<span itemProp="offers" itemScope itemType="http://schema.org/Offer" className="text-large">
									<span itemProp="priceCurrency" content="BTC">Ƀ&nbsp;</span>
									<span itemProp="price" content={priceBtc}>
										{helpers.satoshi_decimals(priceBtc, 8)}
									</span>
						        </span>
								<br />
								<Show condition={metrics.priceChangePercents.day.btc}>
									{greenOrRedNumber(metrics.priceChangePercents.day.btc)}
								</Show>
							</p>
						</Show>
					</Show>
			</Cell>

			{/* CAP */}
			<Cell col={3} tablet={4} phone={4} shadow={2} className="mdl-card">
				<Show condition={capUsd || capBtc }> {/* do we need this check? */}
					<h4>Cap</h4>
					<Show condition={capUsd}>
						<p>
							<span className="text-large">
								{'$ ' + helpers.readableN0(capUsd)}
							</span>
							<br />
							{greenOrRedNumber(metrics.capChangePercents.day.usd)}
						</p>
					</Show>
					<Show condition={capBtc}>
						<p>
							<span className="text-large">
								{'Ƀ ' + helpers.readableN0(capBtc)}
							</span>
							<br />
							{greenOrRedNumber(metrics.capChangePercents.day.btc)}
						</p>
					</Show>
				</Show>
			</Cell>

			{/* TRADE */}
			<Cell col={3} tablet={4} phone={4} shadow={2} className="mdl-card">
				<Show condition={todayVolumeUsd}>
					<h4>Trade</h4>
					<p>
						<span className="text-large">
							{'$ ' + helpers.readableN0(todayVolumeUsd)}
						</span>
						<br />
						{greenOrRedNumber(usdVolumeChange)}
					</p>
					<p>
						<span className="text-large">
							{'Ƀ ' + helpers.readableN0(todayVolumeBtc)}
						</span>
						<br />
						{greenOrRedNumber(btcVolumeChange)}
					</p>
				</Show>
			</Cell>

			{/* SUPPLY */}
			<Cell col={3} tablet={4} phone={4} shadow={2} className="mdl-card">
				<Show condition={metrics.supply}>
					<h4>Supply</h4>
					<p>
						<span className="text-large">
							{helpers.readableN0(metrics.supply)}
							&nbsp;
							{helpers.displayCurrencyName(props.system) + 's'}
						</span>
						<br />
						{greenOrRedNumber(metrics.supplyChangePercents.day)}
					</p>
					<Show condition={metrics.supplyChange} component='p'>
						{ helpers.withSign(metrics.supplyChange.day) }
						&nbsp;
						{ helpers.displayCurrencyName(props.system) + 's' }
					</Show>
				</Show>
			</Cell>
		</Grid>
}

SystemMetrics.propTypes = {
	system: PropTypes.object.isRequired
}

export default SystemMetrics

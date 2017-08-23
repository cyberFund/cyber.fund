import { CurrentData } from '/imports/api/collections'

// TODO: \\switch to the new data source
function getLastBtcPrice(){
	let btc = CurrentData.findOne({
		_id: 'Bitcoin'
	}, {
		fields: {
			metrics: 1
		}
	})
	return btc && btc.metrics && btc.metrics.price && btc.metrics.price.usd
}

// TODO: switch to the new data source
function lastBtcPrice(){
  return getLastBtcPrice()
}
export { lastBtcPrice }

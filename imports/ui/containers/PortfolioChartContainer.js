import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import PortfolioChart from '../components/PortfolioChart'

var selectors = CF.CurrentData.selectors;
CF.UserAssets.graph = CF.UserAssets.graph || {};
CF.UserAssets.graph.minimalShare = 0.025;
const ns = CF.UserAssets.graph;

export default createContainer( props => {
// Template.currentData ? what the fuck is template?
// TODO extract assets from other components (u have done this before)
// var assets = Template.currentData() && Template.currentData().accountsData || {};
const 	assets = CF.Accounts.portfolioTableData()

if (_.isEmpty(assets)) {
	ns.folioPie = hideView()
	return ns.folioPie;
}

var series = [], labels = [], systems = _.keys(assets)

// this chunk basically fetches
var Find = CurrentData.find(selectors.system(systems));
var data = Find.fetch().sort(
	function(x, y) {
		var q1 = accounts[x._id] && accounts[x._id].quantity || 0,
			q2 = accounts[y._id] && accounts[y._id].quantity || 0
		return 	Math.sign(
					q2 * CF.CurrentData.getPrice(y)
					- q1 * CF.CurrentData.getPrice(x)
				)
				|| Math.sign(q2 - q1)
});

var sum = 0, // this to be used o determine if minor actives
	datum = [], // let s calculate first and put calculations here
	others = { // here be minor actives
		u: 0,
		b: 0,
		q: 0,
		symbol: "other"
	}

_.each(data, function(system) {
	var asset = assets[system._id] || {};
	var point = {
		symbol: get(system, 'aliases.nickname', system._id),
		q: asset.quantity || 0,
		u: asset.vUsd || 0,
		b: asset.vBtc || 0
	}

	datum.push(point);
	sum += point.b;
});

if (!sum) {
	ns.folioPie = instance.hideView();
	return ns.folioPie;
}

// push smalls into 'others'
_.each(datum, function(point) {
	if (point.b / sum >= ns.minimalShare) {
		labels.push(point.symbol)
		series.push({
			value: point.u,
			meta: "N: " + point.q.toFixed(4) + "; BTC: " + point.b.toFixed(4) + "; USD: " +  point.u.toFixed(2)
		});
	}
	else {
		others.u += point.u;
		others.b += point.b;
	}
});

// if others, draw them too
if (others.b && others.b > 0) {
	labels.push("Others");
	series.push({
		value: others.u,
		meta: "other assets: BTC: " + others.b.toFixed(4) + "; USD: " + others.u.toFixed(2)
	});
}

// final data check
if (series.length > 1) showView({ labels, series })
else hideView()

return ns.folioPie

}, PortfolioChart)

import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import get from 'oget'
import helpers from '../helpers'
import SystemPage from '../pages/SystemPage'

export default SystemPageContainer = createContainer(() => {
	// variables
	const 	systemName 		= helpers._toSpaces(FlowRouter.getParam("name_"))
			dependentsReady = Meteor.subscribe("dependentCoins", systemName).ready(),
			systemReady		= Meteor.subscribe("systemData", {name: systemName}).ready(),
			system 			= CurrentData.findOne({ _id: systemName }) || {},
			{selectors} 	= CF.CurrentData
	// functions
	function getMainLinks() {
		if (!system.links || !_.isArray(system.links))  return []

		return _.first(_.filter(system.links, function(link) {
				return (link.tags && _.isArray(link.tags) && link.tags.includes("Main"))
		}), 4)
	}

	if (system && system.dependencies) {
		var d = system.dependencies;
		if (!_.isArray(d)) d = [d];
		if (d.indexOf("independent") == -1) {
		  Meteor.subscribe("dependencies", d);
		}
	}

	// rework needed

	return {
			system,
			loaded: systemReady && dependentsReady,
			mainLinks: getMainLinks(),
			isProject: get(system, 'descriptions.state') == "Project",
			dependentsExist: CurrentData.find(selectors.dependents(systemName)).count(),
			dependents: CurrentData.find(
								selectors.dependents(systemName),
								{ sort: { _id: 1 } }
							).fetch(),
			existLinksWith: helpers.existLinksWith,
			linksWithoutTags: helpers.linksWithoutTags,
			anyCards: function(){
				const 	m = system.metrics,
						p = m.price,
						c = m.cap
				if (!m) return
				return 	m.tradeVolume || m.supply ||
						(p && (p.usd || p.btc || p.eth)) ||
						(c && (c.usd || c.btc || c.eth ))
			},

		/* THIS IS OLD SHIT */
	  yesterdaySupplyMetric: function(){
		var m = this.metrics;
		return (m.supply - m.supplyChange.day) || 0;
	  },
	  systemName: systemName,

	  depends_on: function() {
		var self = system;
		if (!self.dependencies) return [];
		var deps = self.dependencies;
		if (!_.isArray(deps)) deps = [deps];
		return CurrentData.find(selectors.dependencies(deps));
	  },

	  symbol: function() {
		return this.token ? this.token.symbol : "";
	  },

	  hashtag: function() {
		return (this.descriptions && this.descriptions.hashtag) ? this.descriptions.hashtag.slice(1) : "";
	  },

	  mainTags: function() {
		return ["Wallet", "Exchange", "Analytics", "Magic"];
	  },



	  // todo: currently, those are using current price to estimate yesterday' trade volume.
	  // not good. must be fixed.
	  todayVolumeUsd: function() {
		if (this.metrics && this.metrics.tradeVolume && this.metrics.price) {
		  return this.metrics.tradeVolume * this.metrics.price.usd / this.metrics.price.btc;
		}
		return 0;
	  },
	  yesterdayVolumeUsd: function() {
		var metrics = this.metrics;
		if (metrics && metrics.tradeVolumePrevious &&
		  metrics.tradeVolumePrevious.day && metrics.price) {
		  return metrics.price.usd / metrics.price.btc * metrics.tradeVolumePrevious.day;
		}
	  },
	  todayVolumeBtc: function() {
		if (this.metrics && this.metrics.tradeVolume && this.metrics.price) {
		  return this.metrics.tradeVolume;
		}
		return 0;
	  },
	  yesterdayVolumeBtc: function() {
		var metrics = this.metrics;
		if (metrics && metrics.tradeVolumePrevious &&
		  metrics.tradeVolumePrevious.day && metrics.price) {
		  return metrics.tradeVolumePrevious.day;
		}
	  },
	  usdVolumeChange: function() {
		var metrics = this.metrics;
		if (metrics && metrics.tradeVolumePrevious &&
		  metrics.tradeVolumePrevious.day && metrics.price && metrics.tradeVolume && metrics.price) {

		  return CF.Utils.deltaPercents(metrics.price.usd / metrics.price.btc * metrics.tradeVolume,
			metrics.price.usd / metrics.price.btc * metrics.tradeVolumePrevious.day);
		}
	  },
	  btcVolumeChange: function() {
		var metrics = this.metrics;
		if (metrics && metrics.tradeVolumePrevious &&
		  metrics.tradeVolumePrevious.day && metrics.tradeVolume) {

		  return CF.Utils.deltaPercents(metrics.tradeVolume,
			metrics.tradeVolumePrevious.day);
		}
	  },
	  ___join: function(k1, k2) {
		return k1 + "_" + k2;
	  },
	  systemIsStarredColor: function() {
		var ret = false;
		var user = Meteor.user();
		if (user && user.profile && user.profile.starredSystems) {
		  ret = user.profile.starredSystems.indexOf(this._id) > -1;
		}
		return ret ? "yellow" : "grey";
	  },
	  dailyData: function() {
		var _id = this._id;
		return FastData.find({
		  systemId: _id
		}, {
		  sort: {
			timestamp: 1
		  }
		});
	  }
  }
}, SystemPage)

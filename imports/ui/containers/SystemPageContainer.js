import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import get from 'oget'
import helpers from '../helpers'
import SystemPage from '../pages/SystemPage'

export default SystemPageContainer = createContainer(() => {
	// variables
	const systemName = helpers._toSpaces(FlowRouter.getParam("name_"))
	const loaded = Meteor.subscribe("systemData", {
						name: systemName
					}).ready() &&
					Meteor.subscribe("dependentCoins", systemName).ready()
	const system = CurrentData.findOne({ _id: systemName }) || {}
	const { selectors } = CF.CurrentData

	if (system && system.dependencies) {
		var d = system.dependencies;
		if (!_.isArray(d)) d = [d];
		if (d.indexOf("independent") == -1) {
		  Meteor.subscribe("dependencies", d);
		}
	}

/* what does this code even do???
	Meteor.startup(function() {
	  CF.keenflag = new ReactiveVar();
	  Keen.ready(function() {
	    CF.keenflag.set(true);
	  });
	});
*/

	function getMainLinks() {
	  if (!system.links || !_.isArray(system.links)) {
		return [];
	  }

	  return _.first(_.filter(system.links, function(link) {
		return (link.tags && _.isArray(link.tags) && link.tags.indexOf("Main") > -1);
	  }), 4);
	}
	// rework needed

  return {
	  	loaded,
		system: system || {},
		mainLinks: getMainLinks(),

		/* THIS IS OLD SHIT */
	  yesterdaySupplyMetric: function(){
		var m = this.metrics;
		return (m.supply - m.supplyChange.day) || 0;
	  },
	  anyCards: function(){
		if (!this.metrics) return false;
		var m = this.metrics;
		return m.tradeVolume || m.supply ||
		(m.price && (m.price.usd || m.price.btc || m.price.eth)) ||
		(m.cap && (m.cap.usd || m.cap.btc || m.cap.eth ));
	  },
	  systemName: systemName,
	  dependents: function() {
		return CurrentData.find(selectors.dependents(systemName), {
		  sort: {
			_id: 1
		  }
		});
	  },

	  depends_on: function() {
		var self = system;
		if (!self.dependencies) return [];
		var deps = self.dependencies;
		if (!_.isArray(deps)) deps = [deps];
		return CurrentData.find(selectors.dependencies(deps));
	  },

	  dependentsExist: function() {
		return CurrentData.find(selectors.dependents(systemName)).count();
	  },

	  symbol: function() {
		return this.token ? this.token.symbol : "";
	  },

	  hashtag: function() {
		return (this.descriptions && this.descriptions.hashtag) ? this.descriptions.hashtag.slice(1) : "";
	  },
	  existLinksWith: function(links, tag) {
		if (!_.isArray(links)) return false;
		return !!_.find(links, function(link) {
		  return (_.isArray(link.tags) && link.tags.indexOf(tag) > -1);
		});
	  },

	  mainTags: function() {
		return ["Wallet", "Exchange", "Analytics", "Magic"];
	  },

	  linksWithoutTags: function(links, tags) {
		if (!_.isArray(links)) return [];

		return _.filter(links, function(link) {
		  var ret = _.isArray(link.tags);
		  _.each(tags, function(tag) {
			if (link.tags.indexOf(tag) > -1) ret = false;
		  });

		  return ret;
		});
	  },

	  isProject: function() {
		return this.descriptions && this.descriptions.state == "Project";
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

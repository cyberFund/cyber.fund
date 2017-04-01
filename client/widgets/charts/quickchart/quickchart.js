import {Meteor} from 'meteor/meteor'
import {CurrentData, MarketData} from '/imports/api/collections'
var chartdata = function(systemId) {
  if (!systemId) return null
  return MarketData.find({
    systemId: systemId
  }, {
    sort: { //tooltip only, d3 does not need this
      timestamp: -1
    }
  });
};

var _timestampino = function(timestamp) {
  return moment(timestamp).format(Meteor.settings.public &&
    Meteor.settings.public.manyData ?
    "ddd D-MM HH:" : "ddd D-MM")
};

var formatValue = d3.format(",.4f");
var formatCurrency = function(d) {
  return "$" + formatValue(d)
}


Template["quickchart"].helpers({

});

var grab = {
  t: function(fruit) {
    return fruit && fruit.timestamp
  },
  sp: function(fruit) {
    return fruit && fruit.price_usd
  },
  bp: function(fruit) {
    return fruit && fruit.price_btc
  },
  sc: function(fruit) {
    return fruit && fruit.cap_usd
  },
  bc: function(fruit) {
    return fruit && fruit.cap_btc
  },
  bvd: function(fruit) {
    return fruit && fruit.volume24_btc
  }
};

Template["quickchart"].onCreated(function(){
});

function myGraphOnlyPrice(el, system, instance) { // temporary. now going to react + d3.
  el.selectAll("*").remove()
  this.selectedNode = null
  var graph = this
  var lastData = CurrentData.findOne({_id:system})
  var wf = 140
  var w = 140
  var hf = 50
  var mTop = 10
  var h = hf - mTop
  var svg = el
    .append("svg:svg")
    .attr("width", wf)
    .attr("height", hf)
    .attr("id", "svg-" + Blaze._globalHelpers._toAttr(system))
    .attr("pointer-events", "all")
    .attr("viewBox", "0 0 " + wf + " " + hf)
    .attr("class", "chart")
    .attr("preserveAspectRatio", "xMinYMid")
  var ficus = svg.append("g")
    .attr("class", "ficus")

  ficus.append("text")
    .attr("class", "price")
    .attr("dominant-baseline", "hanging")
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("x", 70)
    .attr("y", 16)
    .text(formatCurrency(lastData.metrics.price.usd))
}

function myGraph(el, system, instance) {
  el.selectAll("*").remove()
  this.selectedNode = null
  var graph = this

  var data = chartdata(system).fetch()
  data = data.sort(function(a, b) {
    return a.timestamp - b.timestamp
  })

  var lastData = CurrentData.findOne({_id:system})
  if (lastData && lastData.metrics && lastData.metrics.price && lastData.metrics.price.usd)                data.push({timestamp: new Date(), price_usd: lastData.metrics.price.usd})

  var wf = 140
  var w = 140
  var hf = 50
  var mTop = 10
  var h = hf - mTop
  var x = d3.time.scale()
    .domain([d3.min(data, grab.t), d3.max(data, grab.t)])
    .range([0 + 2, w - 2])
  var y = d3.scale.linear()
    .domain([d3.min(data, grab.sp), d3.max(data, grab.sp)])
    .range([hf - 1, mTop + 1])
  var xAxis = d3.svg.axis().scale(x).orient("bottom")
  var yAxis = d3.svg.axis().scale(y).orient("left")

  var svg = el
    .append("svg:svg")
    .attr("width", wf)
    .attr("height", hf)
    .attr("id", "svg-" + Blaze._globalHelpers._toAttr(system))
    .attr("pointer-events", "all")
    .attr("viewBox", "0 0 " + wf + " " + hf)
    .attr("class", "chart")
    .attr("preserveAspectRatio", "xMinYMid")

  var priceLine = d3.svg.line()
    .x(function(d) {
      return x(grab.t(d))
    })
    .y(function(d) {
      return y(grab.sp(d))
    })

  var drawing = svg.append("path")
    .attr("d", priceLine(data))
    .attr("class", "qc-line-1")

  // FOCUS DOMAIN
  var bisectDate = d3.bisector(function(d) {
    return d.timestamp
  }).left

  var ficus = svg.append("g")
    .attr("class", "ficus")

  ficus.append("text")
    .attr("class", "price")
    .attr("dominant-baseline", "hanging")
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("x", 70)
    .attr("y", 16)
    .text(data.length ? formatCurrency(grab.sp( data[data.length-1] )) : "")

  var focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none")

  focus.append("line")
    .attr("class", "focus-horiz")
    .attr("x1", 0).attr("x2", w)
    .attr("y1", 1).attr("y2", 1)

  focus.append("line")
    .attr("class", "focus-vert")
    .attr("x1", 1).attr("x2", 1)
    .attr("y1", mTop).attr("y2", hf)

  focus.append("text")
    .attr("class", "price")
    .attr("dominant-baseline", "hanging")
    .attr("font-size", "12px")
    .attr("x", 1)
    .attr("y", "2")

  focus.append("text")
    .attr("class", "date")
    .attr("x", 138)
    .attr("dominant-baseline", "hanging")
    .attr("font-size", "12px")
    .attr("text-anchor", "end")
    .attr("y", 38)

  /*focus.append("text")
    .attr("class", "price-reper")
    .attr("dominant-baseline", "hanging")
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("x", 65)
    .attr("y", 40)
    .text(data.length ? formatCurrency(grab.sp( data[data.length-1] )) : "")
    */

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]);
    var y0 = d3.mouse(this)[1];
    var val = (y.invert(y0))
    var i = bisectDate(data, x0, 1);

    var d0 = data[i - 1];
    var d1 = data[i];
    var d = x0 - grab.t(d0) > grab.t(d1) - x0 ? d1 : d0;

    var yv = y(grab.sp(d));
    var xv = x(grab.t(d));
    focus.select(".focus-horiz")
      .attr("y1", y0)
      .attr("y2", y0);

    focus.select(".focus-vert")
      .attr("x1", xv)
      .attr("x2", xv);

    focus.select("text.price")
      .text(formatCurrency(grab.sp(d)))

    focus.select("text.date")
      .text(_timestampino(grab.t(d)))

    /*focus.select("text.price-reper")
      .text(formatCurrency(val))*/
  }

  svg
    .on("mouseover", function() {
      focus.style("display", null)
      ficus.style("display", "none")
    })
    .on("mouseout", function() {
      focus.style("display", "none")
      ficus.style("display", null)
    })
    .on("mousemove", mousemove)
}

Template["quickchart"].onCreated(function() {
  var instance = this

})
function isDataReady(){
  return Session.get("qcMarketDataReady")
}
Template["quickchart"].onRendered(function() {
  let instance = this;
  instance.autorun(function(c) {
    let renderFn = Session.get("qcMarketDataReady") ? myGraph : myGraphOnlyPrice
    if (instance._system != Template.currentData().system) {
      instance._system = Template.currentData().system
    }
    new renderFn(d3.select("#quickchart-" + Blaze._globalHelpers._toAttr(instance._system)),
      instance._system, instance)
  })
})

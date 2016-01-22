var _chartdata = function(systemId) {
  if (!systemId) return null;
  return MarketData.find({
    systemId: systemId
  }, {
    sort: {
      timestamp: -1
    }
  })
}

Template['quickchart_tooltip'].helpers({
  'chartdata': _chartdata,
  'timestampino': function(timestamp) { // that too slow.
    // should render only on subscription ready.
    // and this should be OK for non realtime data.

    return moment(timestamp).format(Meteor.settings.public &&
      Meteor.settings.public.manyData ?
      "ddd D-MM HH:" : "ddd D-MM");
  }
});
Template['quickchart'].helpers({
  'chartdata': _chartdata,
  _ready: function() {
    return CF.CurrentData._sub_.ready();
  }
});

Template['quickchart'].onRendered(function() {
  if (!this.data.system) return;
  var i = this;
  var selector = {
    systemId: this.data.system
  }

  var graph;
  graph = new myGraph("#quickchart-" + this.data.system);

  function myGraph(el) {
    var grab = {
      t: function(fruit){ return fruit.timestamp},
      sp: function(fruit){ return fruit.price_usd},
      bp: function(fruit){ return fruit.price_btc},
      sc: function(fruit){ return fruit.cap_usd},
      bc: function(fruit){ return fruit.cap_btc},
      bvd: function(fruit){ return fruit.volume24_btc},
    }

    this.selectedNode = null;
    var graph = this;

    var data = _chartdata(i.data.system).fetch();

    var w = 124;
    var h = 18;
    var x = d3.time.scale()
      .domain([d3.min(data, grab.t), d3.max(data, grab.t)])
      .range([0+2, w-2]);
    var y = d3.scale.linear()
      .domain([d3.min(data, grab.sp), d3.max(data, grab.sp)])
      .range([h-1, 0+1]);
    var xAxis = d3.svg.axis().scale(x).orient('bottom');
    var yAxis = d3.svg.axis().scale(y).orient('left');

    var svg = d3.select(el)
      .append("svg:svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", "svg-" + i.data.coin)
      .attr("pointer-events", "all")
      .attr("viewBox", "0 0 " + w + " " + h)
      .attr('class', 'chart')
      .attr("preserveAspectRatio", "xMinYMid");

    var priceLine = d3.svg.line()
      //.interpolate("monotone")
      .x(function(d) {
        return x(grab.t(d));
      })
      .y(function(d) {
        return y(grab.sp(d));
      });

    var drawing = svg.append("path")
      .attr("d", priceLine(data))
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("fill", "none")

  }
})

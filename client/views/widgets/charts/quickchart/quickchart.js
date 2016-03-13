var _chartdata = function(systemId) {
  if (!systemId) return null;

  return MarketData.find({
    systemId: systemId
  }, {
    sort: { //tooltip only, d3 does not need this
      timestamp: -1
    }
  })
}

_timestampino = function(timestamp) {
  return moment(timestamp).format(Meteor.settings.public &&
    Meteor.settings.public.manyData ?
    "ddd D-MM HH:" : "ddd D-MM");
}

Template['quickchart_tooltip'].helpers({
  'chartdata': _chartdata,
  'timestampino': _timestampino
});
Template['quickchart'].helpers({
  'chartdata': _chartdata,
  __ready: function() {
    return Template.instance()._ready_ || CF.CurrentData._sub_.ready();
  }
});

Template['quickchart'].onCreated(function() {

})

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
  },
}

Template['quickchart'].onRendered(function() {
  if (!this.data.system) return;
  var i = this;
  var selector = {
    systemId: this.data.system
  }

  i.autorun(function(c) {

    if (CF.CurrentData._sub_.ready()) {
      if (_chartdata(i.data.system).count()) {
        i._ready_ = true;
      }
    }
    if (!i._ready_) return;

    var graph;
    graph = new myGraph("#quickchart-" + Blaze._globalHelpers._toUnderscores(i.data.system));

    function myGraph(el) {

      this.selectedNode = null;
      var graph = this;

      var data = _chartdata(i.data.system).fetch();
      data = data.sort(function(a, b) {
        return a.timestamp - b.timestamp
      })

      var wf = 140;
      var w = 140;
      var hf = 50;
      var mTop = 10;
      var h = hf - mTop;
      var x = d3.time.scale()
        .domain([d3.min(data, grab.t), d3.max(data, grab.t)])
        .range([0 + 2, w - 2]);
      var y = d3.scale.linear()
        .domain([d3.min(data, grab.sp), d3.max(data, grab.sp)])
        .range([hf - 1, mTop + 1]);
      var xAxis = d3.svg.axis().scale(x).orient('bottom');
      var yAxis = d3.svg.axis().scale(y).orient('left');

      var svg = d3.select(el)
        .append("svg:svg")
        .attr("width", wf)
        .attr("height", hf)
        .attr("id", "svg-" + i.data.system)
        .attr("pointer-events", "all")
        .attr("viewBox", "0 0 " + wf + " " + hf)
        .attr('class', 'chart')
        .attr("preserveAspectRatio", "xMinYMid");

      var priceLine = d3.svg.line()
        .x(function(d) {
          return x(grab.t(d));
        })
        .y(function(d) {
          return y(grab.sp(d));
        });

      var drawing = svg.append("path")
        .attr("d", priceLine(data))
        .attr("class", "qc-line-1")

      // FOCUS DOMAIN
      var bisectDate = d3.bisector(function(d) {
        return d.timestamp;
      }).left;

      var formatValue = d3.format(",.4f");
      var formatCurrency = function(d) {
        return "$" + formatValue(d);
      };





      var ficus = svg.append("g")
        .attr("class", "ficus")

      ficus.append("text")
        .attr("class", "price")
        .attr("dominant-baseline", "hanging")
        .attr("text-anchor", "middle")
        .attr("x", 70)
        .attr("y", "0")
        .text(data.length ? formatCurrency(grab.sp( data[data.length-1] )) : "")

      var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

      focus.append("line")
        .attr("class", "focus-horiz")
        .attr("x1", 0).attr("x2", w)
        .attr("y1", 1).attr("y2", 1);

      focus.append("line")
        .attr("class", "focus-vert")
        .attr("x1", 1).attr("x2", 1)
        .attr("y1", mTop).attr("y2", hf);

      focus.append("text")
        .attr("class", "price")
        .attr("dominant-baseline", "hanging")
        .attr("x", 1)
        .attr("y", "2");

      focus.append("text")
        .attr("class", "date")
        .attr("x", 138)
        .attr("dominant-baseline", "hanging")
        .attr("text-anchor", "end")
        .attr("y", "2");

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisectDate(data, x0, 1);

        var d0 = data[i - 1];
        var d1 = data[i];
        var d = x0 - grab.t(d0) > grab.t(d1) - x0 ? d1 : d0;

        var yv = y(grab.sp(d));
        var xv = x(grab.t(d));
        focus.select(".focus-horiz")
          .attr("y1", yv)
          .attr("y2", yv)

        focus.select(".focus-vert")
          .attr("x1", xv)
          .attr("x2", xv)

        focus.select("text.price")
          .text(formatCurrency(grab.sp(d)));

        focus.select("text.date")
          .text(_timestampino(grab.t(d)));
      }

      svg
        .on("mouseover", function() {
          focus.style("display", null);
          ficus.style("display", "none");
        })
        .on("mouseout", function() {
          focus.style("display", "none");
          ficus.style("display", null);
        })
        .on("mousemove", mousemove)

    }
    if (i._ready_) {
      c.stop();
    }
  })
})

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
    graph = new myGraph("#quickchart-" + i.data.system,  i.data.system);

    function myGraph(el, sys) {
      var grab = {
        t: function(fruit) {
          return fruit.timestamp
        },
        sp: function(fruit) {
          return fruit.price_usd
        },
        bp: function(fruit) {
          return fruit.price_btc
        },
        sc: function(fruit) {
          return fruit.cap_usd
        },
        bc: function(fruit) {
          return fruit.cap_btc
        },
        bvd: function(fruit) {
          return fruit.volume24_btc
        },
      }

      this.selectedNode = null;
      var graph = this;

      var data = _chartdata(sys).fetch();
      data = data.sort(function(a, b) {
        return a.timestamp - b.timestamp
      })

      var wf = 180;
      var w = 124;
      var h = 18;
      var x = d3.time.scale()
        .domain([d3.min(data, grab.t), d3.max(data, grab.t)])
        .range([0 + 2, w - 2]);
      var y = d3.scale.linear()
        .domain([d3.min(data, grab.sp), d3.max(data, grab.sp)])
        .range([h - 1, 0 + 1]);
      var xAxis = d3.svg.axis().scale(x).orient('bottom');
      var yAxis = d3.svg.axis().scale(y).orient('left');

      var svg = d3.select(el)
        .append("svg:svg")
        .attr("width", wf)
        .attr("height", h)
        .attr("id", "svg-" + sys)
        .attr("pointer-events", "all")
        .attr("viewBox", "0 0 " + wf + " " + h)
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
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none")



      // FOCUS DOMAIN
      var bisectDate = d3.bisector(function(d) {
        return d.timestamp;
      }).left;

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
        .attr("y1", 0).attr("y2", h);

      focus.append("text")
        .attr("class", "price")
        .attr("dx", w + 1)
        .attr("dy", "18");

      focus.append("text")
        .attr("class", "date")
        .attr("dx", w + 1)
        .attr("dy", "8");

      var formatValue = d3.format(",.4f");
      var formatCurrency = function(d) {
        return "$" + formatValue(d);
      };

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
        })
        .on("mouseout", function() {
          focus.style("display", "none");
        })
        .on("mousemove", mousemove)



    }
    if (i._ready_) {
      c.stop();
    }
  })
})

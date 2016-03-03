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

Template['slowchart'].helpers({
  'chartdata': _chartdata,
  __ready: function() {
    return true;
    return Template.instance()._ready_ ||
    (CF._sub_ && CF._sub_.ready());
  }
});

Template['slowchart'].onCreated(function() {

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

Template['slowchart'].onRendered(function() {
  if (!this.data.system) return;
  var i = this;
  var selector = {
    systemId: this.data.system
  }

  i.autorun(function(c) {
    if (CF._sub_ && CF._sub_.ready()) {
      if (_chartdata(i.data.system).count()) {
        i._ready_ = true;
      }
    }
    if (!i._ready_) return;

  var graph;
  graph = new myGraph("#slowchart-" + i.data.system);

  function myGraph(el) {
    this.selectedNode = null;
    var graph = this;

    var ww = d3.select(el).style("width");
    var hh = d3.select(el).style("height");

    var wf = ww.split('px')[0]; //widfull
    var w = wf - 60;
    var hf = hh.split('px')[0];
    var h = hf - 30;

    var data, x, y, xAxis, yAxis, svg, priceLine, drawing, bisectDate, formatValue, formatCurrency
    init();
    var obs = _chartdata(i.data.system).observe({
      added: function(item) {
        data.push(item);
      }
    })
    interact();




    function init() {
      data = _chartdata(i.data.system).fetch();
      /*data = data.sort(function(a, b) {
        return a.timestamp - b.timestamp
      })*/

      x = d3.time.scale()
        .domain([d3.min(data, grab.t), d3.max(data, grab.t)])
        .range([0 + 2, w - 2]);
      y = d3.scale.linear()
        .domain([d3.min(data, grab.sp), d3.max(data, grab.sp)])
        .range([h - 1, 0 + 1]);
      xAxis = d3.svg.axis().scale(x).orient('bottom');
      yAxis = d3.svg.axis().scale(y).orient('left');

      svg = d3.select(el)
        .append("svg:svg")
        //.attr("width", wf)
        //.attr("height", h)
        .attr("id", "svg-" + i.data.system)
        .attr("pointer-events", "all")
        .attr("viewBox", "0 0 " + wf + " " + h)
        .attr('class', 'chart')
        .attr("preserveAspectRatio", "xMinYMid");

      priceLine = d3.svg.line()
        .x(function(d) {
          return x(grab.t(d));
        })
        .y(function(d) {
          return y(grab.sp(d));
        });

      drawing = svg.append("path")
        .attr("d", priceLine(data))
        .attr("class", "qc-line-1")

      // FOCUS DOMAIN
      bisectDate = d3.bisector(function(d) {
        return d.timestamp;
      }).left;



      formatValue = d3.format(",.4f");
      formatCurrency = function(d) {
        return "$" + formatValue(d);
      };

      focus = svg.append("g")
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
    }

    function interact() {
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

  }
  if (i._ready_) {
      c.stop();
    }
  })
})

Template['quickchart'].onRendered(function() {
  if (!this.data.coin) return;
  var i = this;
  var selector = {
    systemId: this.data.coin
  }
  var graph;
  graph = new myGraph("#quickchart-" + this.data.coin);

  MarketData.find(selector).observe({
    added: function(doc) {
      graph.addPoint(doc._id, doc.timestamp, doc.price_usd);
    },
    removed: function(doc) {
      graph.removePoint(doc._id);
    }
  });

  function myGraph(el) {
    this.selectedNode = null;
    var graph = this;

    $(el).on('click', 'g.node', function(e) {
      var node = this;
      //graph.selectedNode = d3.select(node).data()[0].name;
      update();
    });

    var svg = d3.select(el)
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .attr("id","svg-" + i.data.coin)
    .attr("pointer-events", "all")
    .attr("viewBox","0 0 "+w+" "+h)
    .attr('class', 'chart')
    .attr("preserveAspectRatio","xMinYMid");

    var vis = svg.append('rect');
    vis.attr("kla", "klu");

    var w = 120;
    var h = 18;
    var x = d3.time.scale().range([0, w]);
    var y = d3.scale.linear().range([h, 0]);
    var xAxis = d3.svg.axis().scale(x).orient('bottom');
    var yAxis   = d3.svg.axis().scale(y).orient('left');

    var priceLine = d3.svg.line()
       .interpolate('monotone')
       .x(function(d) { return x(d.timestamp); })
       .y(function(d) { return y(d.price_usd); });


    var update = function(){
      console.log("u", i.data.coin)
    }

    this.addPoint = function(id, t, v){
      //console.log(id, t, v, i.data.coin)
    }

    this.removePoint = function(id) {
      //console.log(id,i.data.coin, "s")
    }
  }
})

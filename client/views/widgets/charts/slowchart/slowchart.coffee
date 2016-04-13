_chartdata = (systemId) ->
  if !systemId
    return null
  MarketData.find { systemId: systemId }, sort: timestamp: -1

myGraph = (el, i) ->

  mousemove = ->
    limitX = (v) -> Math.min(v, wf - tooltip.__w)
    limitY = (v) -> Math.min(v, mTop + hM - tooltip.__h)
    x0 = x.invert(d3.mouse(this)[0]-mLeft)
    y0 = y.invert(d3.mouse(this)[1])
    i = bisectDate(data, x0, 1)
    d0 = data[i - 1]
    d1 = data[i]
    d = if x0 - grab.t(d0) > grab.t(d1) - x0 then d1 else d0
    yv = y(grab.sp(d))
    xv = x(grab.t(d))
    focus.select('.focus-horiz').attr('y1', yv).attr 'y2', yv
    focus.selectAll('.focus-vert').attr('x1', xv).attr 'x2', xv
    tooltip.select('text.price').text formatCurrency(grab.sp(d))
    tooltip.select('text.date').text _timestampino(grab.t(d))
    tooltip.select('text.volume').text d3.format(',.0f')(grab.bvd(d))
    tooltip.attr('transform', "translate(#{limitX (xv+5)},#{limitY (d3.mouse(this)[1]-20)})")

    return

  @selectedNode = null
  graph = this
  wf = d3.select(el).style('width').split('px')[0]
  hf = d3.select(el).style('height').split('px')[0]


  mLeft = 40
  mRight = 40
  mTop = 20
  mBottom = 20
  mBetween = 15
  split = [1, 1/3, 1/3]
  splitsum = split[0] + split[1] + split[2]

  w = wf - mLeft - mRight
  h = hf - mTop - mBottom - mBetween*(split.length-1)

  hM = h*split[0] / splitsum
  hV = h*split[1] / splitsum
  hZ = h*split[2] / splitsum

  data = _chartdata(i.data.system).fetch()
    .sort((a, b) -> a.timestamp - (b.timestamp))

  x = d3.time.scale().domain([
    d3.min(data, grab.t)
    d3.max(data, grab.t)
  ]).range [ 0, w ]
  y = d3.scale.linear().domain([
    d3.min(data, grab.sp)
    d3.max(data, grab.sp)
  ]).range [ hM + 0, 0 ]

  xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(5).tickSize(-6)
  yAxis = d3.svg.axis().scale(y).orient('left').ticks(6).tickSize(-6).tickFormat(d3.format('s'))
  svg = d3.select(el).append('svg:svg')
    .attr('id', 'svg-' + i.data.system).attr('pointer-events', 'all')
    .attr('class', 'slowchart-svg')
    #.attr('width', wf)
    #.attr('height', hf)
    .attr('viewBox', '0 0 ' + wf + ' ' + hf)
    .attr('preserveAspectRatio', 'xMinYMid')
  mainChart = svg.append('g')
    #.attr('width', w)
    #//attr().height(hM)
    .attr('transform', 'translate(' + mLeft + ',' + mTop + ')')
    .attr('class', 'main-chart')
  mainChart
  .append('defs').append("clipPath").attr("id", "clip")
    .append('rect').attr('x', 0).attr('y', 0).attr('width', w).attr('height', hM)

  mainChart.append('g').attr('class', 'x axis')
  .attr('transform', 'translate(0,' + hM + ')').call(xAxis)
  mainChart.append('g').attr('class', 'y axis')
  .attr('transform', 'translate(' + 0 + ',0)').call(yAxis)

  priceLine = d3.svg.line()
  .x((d) -> x grab.t(d))
  .y((d) -> y grab.sp(d))
  drawing = mainChart.append('path').attr('d', priceLine(data)).attr('class', 'qc-line-1')

  # FOCUS DOMAIN
  bisectDate = d3.bisector((d) ->
    d.timestamp
  ).left
  formatValue = d3.format(',.4f')

  formatCurrency = (d) ->
    '$' + formatValue(d)

  focus = mainChart.append('g').attr('class', 'focus').style('display', 'none')
  focus.append('line').attr('class', 'focus-horiz')
  .attr('x1', 0).attr('x2', 0+w).attr('y1', 0).attr 'y2', 0
  focus.append('line').attr('class', 'focus-vert')
  .attr('x1', 0).attr('x2', 0).attr('y1', 0).attr 'y2', 0+hM

  focus.append('line').attr('class', 'focus-vert')
  .attr('x1', 0).attr('x2', 0).attr('y1', hM+mTop).attr 'y2', hM+mTop+hV

  tooltip = focus.append('g')
  tooltip.__w = 65
  tooltip.__h = 35
  tooltip.append('rect')
    .attr 'x', 0
    .attr 'width', tooltip.__w
    .attr 'y', 0
    .attr 'height', tooltip.__h
    .attr 'class', 'tooltip-box'
  tooltip.attr('transform', 'translate(40,0)')
  tooltip.append('text').attr('class', 'date')
    .attr 'dx', '2'
    .attr 'dy', '11'
  tooltip.append('text').attr('class', 'price')
    .attr 'dx', '2'
    .attr 'dy', '22'
  tooltip.append('text').attr('class', 'volume')
    .attr 'dx', '2'
    .attr 'dy', '33'

  volumeChart = svg.append('g')
  volumeChart.__top = mTop + mBetween + hM
  volumeChart
    .attr 'transform', "translate(#{mLeft}, #{volumeChart.__top})"
  volumeChart.append('text')
    .attr 'x', 0
    .attr 'y', 9
    .text 'volume'

  ###
  ###
  parseDate = d3.time.format('%Y-%m').parse

  x2 = d3.time.scale()
    .domain([
      d3.min(data, grab.t)
      d3.max(data, grab.t)
    ])
    .range [ 0, w ]


  y2 = d3.scale.linear().range([ hV, 0])
  xAxis2 = d3.svg.axis().scale(x2).orient('bottom').ticks(5)
  yAxis2 = d3.svg.axis().scale(y2).orient('left').ticks(5).tickFormat(d3.format("s"))

  #x2.domain data.map ((d) -> grab.t(d))
  y2.domain [0, d3.max(data, (d) -> grab.bvd(d))]
  volumeChart
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + hV + ')')
    .call(xAxis2)
    ###
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '-.55em')
    .attr 'transform', 'rotate(-90)'
    ###

  volumeChart
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis2)
    ###
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text 'Volume 24 (BTC)'###

  volumeChart
    .selectAll('bar')
    .data(data)
    .enter()
    .append('rect')
    .style('fill', 'steelblue')
    .attr 'x', (d) -> x2 grab.t(d)
    .attr('width', Math.min(10, Math.max(w/data.length-1, 1)))
    .attr 'y', (d) -> y2 grab.bvd(d)
    .attr 'height', (d)-> hV - y2( grab.bvd(d) )

  ###
  ###


  zoomChart = svg.append('g')
  zoomChart.__top = mTop + 2*mBetween + hM + hV
  zoomChart
    .attr 'transform', "translate(#{mLeft}, #{zoomChart.__top})"
  x3 = d3.time.scale().range([0, w])
  y3 = d3.scale.linear().range([hZ, 0])

  x3.domain(x.domain());
  y3.domain(y.domain());

  xAxis3 = d3.svg.axis().scale(x3).orient("bottom")

  priceLine3 = d3.svg.line()
    .x((d) -> x3 grab.t(d))
    .y((d) -> y3 grab.sp(d))

  zoomChart
    .append('path').attr('d', priceLine3(data)).attr('class', 'qc-line-1')
  zoomChart
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + hZ + ")")
    .call(xAxis3);

  brushed = () ->

    x.domain( if brush.empty() then x3.domain() else brush.extent())
    x2.domain( if brush.empty() then x3.domain() else brush.extent())

    d = if brush.empty() then data else
      data.slice(bisectDate(data, brush.extent()[0], 1), bisectDate(data, brush.extent()[1], 1))

    y.domain [ d3.min(d, grab.sp), d3.max(d, grab.sp) ]
    y2.domain [0, d3.max(d, grab.bvd)]

    mainChart.select(".x.axis").call(xAxis);
    mainChart.select(".y.axis").call(yAxis);
    mainChart.select(".qc-line-1").attr("d", priceLine(data));
    zoomChart.select(".remove-on-brush").text('')

    volumeChart.select(".x.axis").call(xAxis2);
    volumeChart.select(".y.axis").call(yAxis2);

    volumeChart.selectAll("rect").remove()
    volumeChart
      .selectAll('bar')
      .data(d)
      .enter()
      .append('rect')
      .style('fill', 'steelblue')
      .attr 'x', (d) -> x2 grab.t(d)
      .attr('width', Math.min(10, Math.max(w/d.length-1, 1)))
      .attr 'y', (d) -> y2 grab.bvd(d)
      .attr 'height', (d)-> hV - y2( grab.bvd(d) )

  brush = d3.svg.brush()
    .x(x3)
    .on("brush", brushed);

  zoomChart.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("y", -6)
    .attr("height", hZ + 7);

  zoomChart
    .append('text')
    .attr('class', 'remove-on-brush')
    .attr('text', "drag to zoom")
    .attr('dx', 20).attr('dy', 20)

  svg.on('mouseover', ->
    focus.style 'display', null
  ).on('mouseout', ->
    focus.style 'display', 'none'
  ).on 'mousemove', mousemove


_timestampino = (timestamp) ->
  # date format. maybe better use d3-provided ?
  moment(timestamp).format if Meteor.settings.public and Meteor.settings.public.manyData then 'ddd D-MM HH:' else 'ddd D-MM'

Template['slowchart'].helpers
  'chartdata': _chartdata
  __ready: ->
    # do not draw anything before data is loaded
    return Template.instance()._ready_ or CF._sub_ and CF._sub_.ready()

grab =
  t: (fruit) -> fruit and fruit.timestamp
  sp: (fruit) -> fruit and fruit.price_usd
  bp: (fruit) -> fruit and fruit.price_btc
  sc: (fruit) -> fruit and fruit.cap_usd
  bc: (fruit) -> fruit and fruit.cap_btc
  bvd: (fruit) -> fruit and fruit.volume24_btc

Template['slowchart'].onRendered ->
  if !@data.system
    return
  i = this
  selector = systemId: @data.system
  i.autorun (c) ->
    if CF._sub_ and CF._sub_.ready()
      if _chartdata(i.data.system).count()
        i._ready_ = true
    if !i._ready_
      return
    graph = new myGraph('#slowchart-' + Blaze._globalHelpers._toUnderscores(i.data.system), i)
    $(window).on 'resize', (e) ->
      $('#slowchart-' + i.data.system).empty()
      graph = new myGraph('#slowchart-' + i.data.system, i)
    if i._ready_
      c.stop()
    return
  return

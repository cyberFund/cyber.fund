_chartdata = (systemId) ->
  if !systemId
    return null
  MarketData.find { systemId: systemId }, sort: timestamp: -1

myGraph = (el, instance) ->

  data = instance.theData #_chartdata(instance.data.system).fetch()
    .sort((a, b) -> a.timestamp - (b.timestamp))
  if not data.length then return
  parent = d3.select(d3.select(el).node()?.parentNode)
  if parent
    parent.classed("hidden", false);
    controls = parent.select(".slowchart-controls")
    controlsButtons = parent.selectAll(".slowchart-controls .timeline.btn")


  @selectedNode = null

  graph = this
  wf = d3.select(el).style('width')?.split('px')[0]
  hf = d3.select(el).style('height')?.split('px')[0]

  mLeft = 40
  mRight = 40
  mTop = 20
  mBottom = 20
  mBetween = 20
  split = [1, 1/3, 1/3]
  splitsum = split[0] + split[1] + split[2]

  w = wf - mLeft - mRight
  h = hf - mTop - mBottom - mBetween*(split.length-1)

  hM = h*split[0] / splitsum
  hV = h*split[1] / splitsum
  hZ = h*split[2] / splitsum


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
    .attr('id', 'svg-' + instance.data.system).attr('pointer-events', 'all')
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

  volumeChart = svg.append('g')
  volumeChart.__top = mTop + mBetween + hM
  volumeChart
    .attr 'transform', "translate(#{mLeft}, #{volumeChart.__top})"
  volumeChart.append('text')
    .attr 'x', 0
    .attr 'y', 9
    .text 'volume'

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

  volumeChart
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis2)

  wid = Math.min(10, Math.max(w/data.length-1, 1))
  volumeChart
    .selectAll('bar')
    .data(data)
    .enter()
    .append('rect')
    .style('fill', 'steelblue')
    .attr 'x', (d) -> (x2 grab.t(d)) - wid/2
    .attr('width', wid)
    .attr 'y', (d) -> y2 grab.bvd(d)
    .attr 'height', (d)-> hV - y2( grab.bvd(d) )

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

  focus = mainChart.append('g').attr('class', 'focus').style('display', 'none')
  focus.append('line').attr('class', 'focus-horiz')
  .attr('x1', 0).attr('x2', 0+w).attr('y1', 0).attr 'y2', 0
  focus.append('line').attr('class', 'focus-vert')
  .attr('x1', 0).attr('x2', 0).attr('y1', 0).attr 'y2', 0+hM

  focus.append('line').attr('class', 'focus-vert')
  .attr('x1', 0).attr('x2', 0).attr('y1', hM+mTop).attr 'y2', hM+mTop+hV

  focus.append('line').attr('class', 'focus-vert-full')
  .attr('x1', 0).attr('x2', 0).attr('y1', hM+mTop+hV+mBetween).attr 'y2', hM+mTop+hV+mBetween+hZ

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

  day = 1000 * 60 * 60 * 24
  brushLen = (extent) ->
    return extent[1].valueOf() - extent[0].valueOf()

  brushTimeoutFn = ()->
    if brush.empty() then return
    d = Meteor.call 'fetchMarketData2', getSystemId(), brush.extent()[0], brush.extent()[1], (err, res)->
      if res
        d = instance.theData.concat(res).sort((a, b) -> a.timestamp - (b.timestamp));
        console.log(d.length);
        data = instance.theData = _.uniq(d, true, ((item)-> return item.timestamp));
        console.log (data.length)



  brushTimeoutT = 2000
  brushTimeout = null

  brushed = () ->
    x.domain( if brush.empty() then x3.domain() else brush.extent())
    x2.domain( if brush.empty() then x3.domain() else brush.extent())

    d = if brush.empty() then data else
      data.slice(bisectDate(data, brush.extent()[0], 1), bisectDate(data, brush.extent()[1], 1))

    y.domain [ d3.min(d, grab.sp), d3.max(d, grab.sp) ]
    y2.domain [0, d3.max(d, grab.bvd)*1.1]

    mainChart.select(".x.axis").call(xAxis);
    mainChart.select(".y.axis").call(yAxis);

    mainChart.select(".qc-line-1").attr("d", priceLine(data));

    if not brush.empty()
      if brushTimeout
        clearTimeout brushTimeout
      if brushLen(brush.extent())/day < 30
        brushTimeout = setTimeout brushTimeoutFn, brushTimeoutT


    zoomChart.select(".remove-on-brush").text('')

    volumeChart.select(".x.axis").call(xAxis2);
    volumeChart.select(".y.axis").call(yAxis2);

    volumeChart.selectAll("rect").remove()
    wid = Math.min(10, Math.max(w/d.length-1, 1))
    volumeChart
      .selectAll('bar')
      .data(d)
      .enter()
      .append('rect')
      .style('fill', 'steelblue')
      .attr 'x', (d) -> (x2 grab.t(d)) - wid/2
      .attr('width', wid)
      .attr 'y', (d) -> y2 grab.bvd(d)
      .attr 'height', (d)-> hV - y2( grab.bvd(d) )

  brush = d3.svg.brush()
    .x(x3)
    .on("brush", brushed);

  zoomChart.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("y", 0)
    .attr("height", hZ );

  zoomChart
    .append('text')
    .attr('class', 'remove-on-brush')
    .attr('text', "drag to zoom")
    .attr('dx', 20).attr('dy', 20)

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

    focus.selectAll('.focus-vert-full').attr('x1', x3(grab.t(d))).attr 'x2', x3(grab.t(d))

    tooltip.select('text.price').text formatCurrency(grab.sp(d))
    tooltip.select('text.date').text _timestampino(grab.t(d))
    tooltip.select('text.volume').text d3.format(',.0f')(grab.bvd(d))
    tooltip.attr('transform', "translate(#{limitX (xv+5)},#{limitY (d3.mouse(this)[1]-20)})")

    return

  svg.on('mouseover', ->
    focus.style 'display', null
  ).on('mouseout', ->
    focus.style 'display', 'none'
  ).on 'mousemove', mousemove

  if controlsButtons
    controlsButtons.on "click", (e ,t)->
      len = 0

      switch controlsButtons[0][t].getAttribute('len')
        when "full" then len = 3650 * day
        when "year" then len = 365 * day
        when "month" then len = 30 * day
        when "week" then len = 7 * day
        else len = 3650 * day

      fullDomain = x3.domain()
      selectedDomain = brush.extent()
      newFront = new Date ( fullDomain[1].valueOf()-len )
      newTail = new Date ( fullDomain[1].valueOf() )
      if (newFront < fullDomain[0])
        brush.clear()
        brush(d3.select(".brush").transition());
        brush.event(d3.select(".brush").transition().delay(10))
      else
        brush.extent [newFront,newTail]
        brush(d3.select(".brush").transition());
        brush.event(d3.select(".brush").transition().delay(10))

_timestampino = (timestamp) ->
  # date format. maybe better use d3-provided ?
  moment(timestamp).format if Meteor.settings.public and Meteor.settings.public.manyData then 'ddd D-MM HH:' else 'ddd D-MM'

Template['slowchart'].helpers
  'chartdata': _chartdata
  __ready: ->
    # do not draw anything before data is loaded
    return Template.instance()._ready_ or CF.subs.systemData and CF.subs.systemData.ready()
  hasNoData: ->
    return not (Template.instance()._ready_ or CF.subs.systemData and CF.subs.systemData.ready() and Template.instance().theData.length)

grab =
  t: (fruit) -> fruit and fruit.timestamp
  sp: (fruit) -> fruit and fruit.price_usd
  bp: (fruit) -> fruit and fruit.price_btc
  sc: (fruit) -> fruit and fruit.cap_usd
  bc: (fruit) -> fruit and fruit.cap_btc
  bvd: (fruit) -> fruit and fruit.volume24_btc

getSystemId = ()->Blaze._globalHelpers._toSpaces (FlowRouter.getParam('name_'))

Template['slowchart'].onRendered ->
  instance = this

  onResize = (sys)->
    (e) ->
      $('#slowchart-' + Blaze._globalHelpers._toAttr(sys)).empty()
      graph = new myGraph('#slowchart-' + Blaze._globalHelpers._toAttr(sys), instance)
  onresize = null

  instance.autorun (c) ->
    system = getSystemId()
    if not system then return
    Meteor.call "fetchMarketData1", system, (err, res)->
      if res
        instance.theData = res
        instance.$(".slowchart").empty();
        graph = new myGraph('#slowchart-' + Blaze._globalHelpers._toAttr(system), instance)
        if onresize
          $(window).off 'resize', onresize
        onresize = onResize(system)
        $(window).on 'resize', onresize
  return

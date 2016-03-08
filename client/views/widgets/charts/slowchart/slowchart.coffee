_chartdata = (systemId) ->
  if !systemId
    return null
  MarketData.find { systemId: systemId }, sort: timestamp: -1

myGraph = (el, i) ->

  mousemove = ->
    limitX = (v) -> Math.min(v, wf - tooltip.__w)
    limitY = (v) -> Math.min(v, mTop + hM - tooltip.__h)
    x0 = x.invert(d3.mouse(this)[0])
    y0 = y.invert(d3.mouse(this)[1])
    i = bisectDate(data, x0, 1)
    d0 = data[i - 1]
    d1 = data[i]
    d = if x0 - grab.t(d0) > grab.t(d1) - x0 then d1 else d0
    yv = y(grab.sp(d))
    xv = x(grab.t(d))
    focus.select('.focus-horiz').attr('y1', yv).attr 'y2', yv
    focus.select('.focus-vert').attr('x1', xv).attr 'x2', xv
    tooltip.select('text.price').text formatCurrency(grab.sp(d))
    tooltip.select('text.date').text _timestampino(grab.t(d))
    tooltip.attr('transform', "translate(#{limitX (xv+5)},#{limitY (d3.mouse(this)[1]-20)})")

    return

  @selectedNode = null
  graph = this
  wf = d3.select(el).style('width').split('px')[0]
  hf = d3.select(el).style('height').split('px')[0]


  mLeft = 40
  mRight = 40
  mTop = 20
  mBottom = 10
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
  ]).range [ mLeft, wf - mRight ]
  y = d3.scale.linear().domain([
    d3.min(data, grab.sp)
    d3.max(data, grab.sp)
  ]).range [ hM + mTop, mTop ]

  xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(5).tickSize(-6)
  yAxis = d3.svg.axis().scale(y).orient('left').ticks(6).tickSize(-6)
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
    #.attr('transform', 'translate(' + mLeft + ',' + mTop + ')')
    .attr('class', 'main-chart')

  xaxisdraw = mainChart.append('g').attr('class', 'x axis')
  .attr('transform', 'translate(0,' + (mTop + hM) + ')').call(xAxis)
  yaxisdraw = mainChart.append('g').attr('class', 'y axis')
  .attr('transform', 'translate(' + mLeft + ',0)').call(yAxis)

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
  .attr('x1', mLeft).attr('x2', mLeft+w).attr('y1', mTop).attr 'y2', mTop
  focus.append('line').attr('class', 'focus-vert')
  .attr('x1', mLeft).attr('x2', mLeft).attr('y1', mTop).attr 'y2', mTop+hM

  tooltip = focus.append('g')
  tooltip.__w = 60
  tooltip.__h = 20
  tooltip.append('rect')
    .attr 'x', 0
    .attr 'width', tooltip.__w
    .attr 'y', 0
    .attr 'height', tooltip.__h
    .attr 'class', 'tooltip-box'
  tooltip.attr('transform', 'translate(40,0)')
  tooltip.append('text').attr('class', 'price')
    .attr 'dx', '0'
    .attr 'dy', '18'
  tooltip.append('text').attr('class', 'date')
    .attr 'dx', '0'
    .attr 'dy', '8'

  volumeChart = svg.append('g')
  volumeChart.__top = mTop + mBetween + hM
  volumeChart.append('rect')
    .attr 'x', mLeft
    .attr 'y', volumeChart.__top
    .attr 'height', hV
    .attr 'width', w
    .attr 'class', 'tooltip-box'
  volumeChart.append('text')
    .attr 'dx', mLeft
    .attr 'dy', volumeChart.__top + 9
    .text 'volume'

  zoomChart = svg.append('g')
  zoomChart.__top = mTop + 2*mBetween + hM + hV
  zoomChart.append('rect')
    .attr 'x', mLeft
    .attr 'y', zoomChart.__top
    .attr 'height', hZ
    .attr 'width', w
    .attr 'class', 'tooltip-box'
  zoomChart.append('text')
    .attr 'dx', mLeft
    .attr 'dy', zoomChart.__top + 9
    .text 'zoom'

  svg.on('mouseover', ->
    focus.style 'display', null
    return
  ).on('mouseout', ->
    focus.style 'display', 'none'
    return
  ).on 'mousemove', mousemove
  return

_timestampino = (timestamp) ->
  # date format. maybe better use d3-provided ?
  moment(timestamp).format if Meteor.settings.public and Meteor.settings.public.manyData then 'ddd D-MM HH:' else 'ddd D-MM'

Template['slowchart'].helpers
  'chartdata': _chartdata
  __ready: ->
    # do not draw anything before data is loaded
    return Template.instance()._ready_ or CF._sub_ and CF._sub_.ready()
    true

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
    graph = new myGraph('#slowchart-' + i.data.system, i)
    $(window).on 'resize', (e) ->
      console.log('here')
      $('#slowchart-' + i.data.system).empty()
      graph = new myGraph('#slowchart-' + i.data.system, i)
    if i._ready_
      c.stop()
    return
  return

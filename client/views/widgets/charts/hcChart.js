Template['hcChart'].rendered = function () {
  var ticks = [];
  var self = this;
  Tracker.autorun(function (comp) {
      if (!self.data) return;
      var dailyData = self.data.dailyData;
      var hourlyData = self.data.hourlyData;
      var data = {
        cap_btc: [],
        cap_usd: [],
        price_btc: [],
        price_usd: [],
        volume24_btc: [],
        volume24_usd: []
      };

      _.each(dailyData, function (yearly, yI) {
        _.each(yearly, function (monthly, mI) {
          _.each(monthly, function (daily, dI) {
            data.price_btc.push([moment.utc({
              year: yI,
              month: mI,
              day: dI
            })._d, daily.price_btc]);
            data.price_usd.push([moment.utc({
              year: yI,
              month: mI,
              day: dI
            })._d, daily.price_usd]);
          })
        })
      });

      _.each(hourlyData, function (yearly, yI) {
        _.each(yearly, function (monthly, mI) {
          _.each(monthly, function (daily, dI) {
            _.each(daily, function (hourly, hI) {
              data.price_btc.push([moment.utc({
                year: yI,
                month: mI,
                day: dI,
                hour: hI
              })._d, hourly.price_btc]);
              data.price_usd.push([moment.utc({
                year: yI,
                month: mI,
                day: dI,
                hour: hI
              })._d, hourly.price_usd]);
            })
          })
        })
      });

      data.price_btc.sort(function (a, b) {
        return Math.sign(a[0] > b[0]);
      });

      data.price_usd.sort(function (a, b) {
        return Math.sign(a[0] > b[0]);
      });

      console.log(data);
      $('#hc-chart').highcharts({
        series: [{
          name: 'price BTC', data: data.price_btc, color: '#b0a080'
        },
          {name: 'price USD', data: data.price_usd, yAxis: 1, color: '#80f080'}
        ],
        title: {
          text: 'Price',
          x: -20 //center
        },
        chart: {
          zoomType: 'x'
        },
        tooltip: {},
        xAxis: {
          type: 'datetime'
        },
        legend: {
          show: false
        },
        yAxis: [{
          title: {
            text: 'price BTC',
            style: {
              color: '#b0a080'
            }
          },
          labels: {
            format: '{value} BTC'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#b0a080'
          }]
        },
          {
            title: {
              text: 'price USD',
              style: {
                color: '#80f080'
              }
            },
            labels: {
              format: '{value} USD'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#80f080'
            }],
            opposite: true
          }

        ]
      })
    }
  );
};

Template['hcChart'].helpers({
  'foo': function () {
    
  }
});

Template['hcChart'].events({
  'click .bar': function (e, t) {
    
  }
});
Router.onRun(function () {
    /*Meteor.call('_pageAnalytics', {
     path: location.path
     })*/
      this.next();
});

Router.configure({
    layoutTemplate: 'layoutMain',
    loadingTemplate: 'loading',
    load: function () {
        $('html, body').animate({
            scrollTop: 0
        }, 400);
        $("body").scrollTop(0);
        $('#main').hide().fadeIn(500);
        var $nav = $('#navicon');
        if ($nav && $nav.hasClass('open')) {
            $('body').animate({left: "0px"}, 200).css({"overflow": "scroll"});
            $('#main-nav').animate({right: "-250px"}, 200);
            $nav.removeClass('open').addClass('closed').html('&#9776; MENU');
            $('.fade').fadeOut();
        }
        this.next();
    }
});
Router.onBeforeAction('loading');

Router.map(function () {
    this.route("rating", {
        path: "/",
        //loadingTemplate: "",
        template: "ratingPage",
        onRun: function () {
            Session.set("curDataSelector", {"ratings.rating_cyber": 2});
            var self = this;
            Meteor.call('currentDataCount', function (err, ret) {
                if (!err && ret) Session.set("curDataCount", ret);
            });
            this.next();
        },
        onStop: function () {
            Session.set("curDataSelector", {"ratings.rating_cyber": 5});
        },
        waitOn: function () {
            return Meteor.subscribe("current-data", {"ratings.rating_cyber": 2});
        }
    });
    this.route("Portfolio", {
        path: "/portfolio",
        template: "portfolioPage"
    });
    this.route("Radar", {
        path: "/radar",
        template: "radarPage",
        waitOn: function () {
            return Meteor.subscribe('crowdsale');
        },
        data: function () {
            return {
                crowdsale: CurrentData.find(CF.Chaingear.selector.crowdsales)
            }
        }
    });
    this.route("Cyberep", {
        path: "/cyberep",
        template: "cyberepPage"
    });
    this.route("Accounts", {
        path: "/accounts",
        template: "accounts"
    });
    this.route("System", {
        path: "/system",
        template: "system"
    });
    this.route("Profile", {
        path: "/profile",
        template: "profile"
    });
    this.route("Invest", {
        path: "/invest",
        template: "invest"
    });
    this.route("Hello", {
        path: "/hello",
        template: "hello"
    });
    this.route("R2D2", {
        path: "/r2d2",
        template: "r2d2"
    });

    this.route("system2", {
        path: "/system/:name_/:symbol",
        template: "systemBasic",
        onRun: function () {
            var self=this;
            var name_ = this.params.name_;
            var name = Blaze._globalHelpers._toS(this.params.name_);
            Meteor.call("countByCurrencyName", name, function (err, ret) {
                if (ret == 1) {
                    self.redirect("system1", {name_: name_});
                    return;
                }
                if (ret == 0) {
                    Router.current().router.go("rating");
                    return;
                }
                this.next();
            })
        },
        data: function () {
            var name = Blaze._globalHelpers._toS(this.params.name), symbol = this.params.symbol;
            return {
                curData: CurrentData.find(CF.CurrentData.selectors.name_symbol(name, symbol))
            }
        },
        waitOn: function () {
            var name = Blaze._globalHelpers._toS(this.params.name_);
            return [
                Meteor.subscribe('systemData', {name: name, symbol: this.params.symbol} )
                //Meteor.subscribe('customMarketData', {"aliases.CurrencyName": name}, {limit: 20})
            ]
        }
    });

    this.route("system1", {
        path: "/system/:name_",
        template: "systemBasic",
        data: function () {
            var name = Blaze._globalHelpers._toS(this.params.name_);
            return {
                curData: CurrentData.find(CF.CurrentData.selectors.name(name))
            }
        },
        waitOn: function () {
            var name = Blaze._globalHelpers._toS(this.params.name_);
            return [
                Meteor.subscribe('systemData', {name: name})
            ]
        }
    })
})
;

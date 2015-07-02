CF.Chaingear.helpers = {
    'cgIcon': function (that) {
        var ret = (that.icon ? that.icon : that.name) || '';
        ret = ret.toString().toLowerCase();
        return "https://raw.githubusercontent.com/cyberFund/chaingear/gh-pages/logos/" + ret + ".png";
    }
};

_.each(CF.Chaingear.helpers, function (helper, key) {
    UI.registerHelper(key, helper);
});
CF.Chaingear.helpers = {
    /**
     *
     * @param that - CurrentData item
     * @returns {string} url to image
     */
    "cgSystemLogo": function (that) {
        var system = that.system;
        var icon = (that.icon ? that.icon : that.system) || '';
        icon = icon.toString().toLowerCase();

        return "https://raw.githubusercontent.com/cyberFund/chaingear/gh-pages/logos/" + icon + ".png";
    }
};

_.each(CF.Chaingear.helpers, function (helper, key) {
    UI.registerHelper(key, helper);
});
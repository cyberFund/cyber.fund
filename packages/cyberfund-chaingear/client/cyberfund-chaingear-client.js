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
    },
    /**
     *
     * @param link - link object (from CurrentData.links <- chaingear object)
     * returns specifically fa-icon class
     */
    "cgLinkIcon": function(link){
        switch (link.icon){
            case "twitter.png": return
        }
    }
};

_.each(CF.Chaingear.helpers, function (helper, key) {
    UI.registerHelper(key, helper);
});
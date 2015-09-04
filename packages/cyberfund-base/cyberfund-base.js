CF = {
    User: {
        selectors: {
            userByTwid: function(twid){
                return ({"profile.twitterName": twid});
            }
        }
    },
    Utils: {},
    Profile: {}
};

Meteor.users.findOneByTwid = function(twid){
    return Meteor.users.findOne({"profile.twitterName": twid});
}
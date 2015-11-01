CF = {
    User: {
        selectors: {
            userByTwid: function(twid){
                return ({"profile.twitterName": twid});
            }
        },
        get: function(){
            return Meteor.user();
        }
    },
    Utils: {},
    Profile: {}

};

Extras = new Meteor.Collection("extras");

Meteor.users.findOneByTwid = function(twid){
    return Meteor.users.findOne({"profile.twitterName": twid});
}
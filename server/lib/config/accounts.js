Meteor.startup(function () {

  ServiceConfiguration.configurations.update(
    {service: "twitter"},
    {
      $set: {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        secret: process.env.TWITTER_CONSUMER_SECRET
      }
    },
    {upsert: true}
  );
  // Add Facebook configuration entry
  /*
   ServiceConfiguration.configurations.update(
   { service: "facebook" },
   { $set: {
   appId: "XXXXXXXXXXXXXXX",
   secret: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
   }
   },
   { upsert: true }
   );
   */

  // Add GitHub configuration entry
  /*
   ServiceConfiguration.configurations.update(
   { service: "github" },
   { $set: {
   clientId: "XXXXXXXXXXXXXXXXXXXX",
   secret: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
   }
   },
   { upsert: true }
   );
   */

  // Add Google configuration entry
  // ServiceConfiguration.configurations.update(
  //   { service: "google" },
  //   { $set: {
  //       clientId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  //       client_email: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  //       secret: "XXXXXXXXXXXXXXXXXXXXXXXX"
  //     }
  //   },
  //   { upsert: true }
  // );

  // Add Linkedin configuration entry
  /*
   ServiceConfiguration.configurations.update(
   { service: "linkedin" },
   { $set: {
   clientId: "XXXXXXXXXXXXXX",
   secret: "XXXXXXXXXXXXXXXX"
   }
   },
   { upsert: true }
   );
   */
});
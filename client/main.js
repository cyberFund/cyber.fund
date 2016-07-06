/*import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import '../imports/startup/accounts-config'*/

// mdl's layout component does not work properly with react
// thats why material.css is used https://github.com/tleunen/react-mdl#requirements
// (currently commented out to test if problems are real or not)
//import '../node_modules/react-mdl/extra/material.min.css'
import '../node_modules/react-mdl/extra/material.js'

// Needed for onTouchTap (Material-UI dependency)
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// import keenIo charts before before components because some rely on it
import '../imports/startup/keenIo'
import '../imports/startup/routes'

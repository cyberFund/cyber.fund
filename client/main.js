/*import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import '../imports/startup/accounts-config'*/

// mdl's layout component does not work properly with react
// thats why material.css is used https://github.com/tleunen/react-mdl#requirements
// (currently commented out to test if problems are real or not)
//import '../node_modules/react-mdl/extra/material.min.css'
import '../node_modules/react-mdl/extra/material.js'

import '../imports/startup/routes'

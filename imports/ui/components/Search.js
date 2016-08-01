import { Meteor } from 'meteor/meteor'
import React, { PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { FlowRouter } from 'meteor/kadira:flow-router'
import AutoComplete from 'material-ui/AutoComplete'
import helpers from '../helpers'
// TODO add comments. Things are not obvious at all
class Search extends React.Component {

	handleSubmit(system) {
		if(!system) return // TODO implement autoselect on unfinished input (ie 'bitco' + enter)
		console.warn(system)
		if (this.props.callback) this.props.callback(system)
		else FlowRouter.go(`/system/${helpers._toUnderscores(system._id)}`)
	}

	render() {
		const 	{ state, props, handleSubmit } = this,
				colorWhite = { color: props.color || 'white' }

		return 	<AutoComplete
		          hintText="Search for coin"
		          dataSource={props.systems}
				  // 'text' tells which property to scan, 'value' tells what to send in callback
				  dataSourceConfig={{ text: '_id', value: '_id' }}
				  filter={AutoComplete.fuzzyFilter}
				  maxSearchResults={5}
				  onNewRequest={handleSubmit.bind(this)}
				  hintStyle={colorWhite}
				  inputStyle={colorWhite}
				  {...props}
		        />
	}
}

Search.propTypes = {
	// function to call on on system select
	callback: PropTypes.func,
	// hintText color
	color: PropTypes.string
}

export default createContainer(() => {
	Meteor.subscribe("currentDataRP")
	return { systems: CurrentData.find().fetch() }
}, Search)

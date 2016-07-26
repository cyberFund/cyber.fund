import { Meteor } from 'meteor/meteor'
import React, { PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { FlowRouter } from 'meteor/kadira:flow-router'
import AutoComplete from 'material-ui/AutoComplete'
import helpers from '../helpers'

class Search extends React.Component {

	constructor(props) {
		super(props);
		this.state = { inputValue: '' }
	}

	handleSubmit (system) {
		if(!system) return // TODO implement autoselect on unfinished input (ie 'bitco' + enter)
		console.warn(system)
		if (this.props.callback) this.props.callback(system)
		else {
			FlowRouter.go(`/system/${helpers._toUnderscores(system._id)}`)
			this.setState({ inputValue: '' })
		}
	}

	render() {
		return 	<AutoComplete
		          hintText="Search for coin"
				  value={this.state.inputValue}
		          dataSource={this.props.systems}
				  dataSourceConfig={{ text: '_id', value: '_id' }}
				  filter={AutoComplete.fuzzyFilter}
				  maxSearchResults={5}
				  onNewRequest={this.handleSubmit.bind(this)}
				  {...this.props}
		        />
	}
}

Search.propTypes = {
	callback: PropTypes.func
}

export default createContainer(() => {
	Meteor.subscribe("currentDataRP")
	return { systems: CurrentData.find().fetch() }
}, Search)

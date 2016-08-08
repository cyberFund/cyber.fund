import React, { PropTypes } from 'react'
import { _ } from 'meteor/underscore'

// check condition value
function check (props) {
	const 	data = props.condition || props.unless,
			conditionUsed = _.has(props, 'condition')
	// check for empty object or array
	if (_.isObject(data)) {
		// revert boolean if 'unless' prop is used
		return conditionUsed ? !_.isEmpty(data) : _.isEmpty(data)
	}
	// revert boolean if 'unless' prop is used
    return conditionUsed ? Boolean(data) : !Boolean(data)
}

/* 	check() and render() not merged because in future check
	might have more checks and/or will be used elsewhere 	*/
function render(props) {
	// if component specified create custom element
	if (props.component) return <props.component {...props} />
	// if children are not wrapped in a single element react will throw an error
	return _.isArray(props.children) ? <div {...props} /> : props.children
}

// <Show condition={true}> {props.children} </Show> == show element
// <Show unless={true}> {props.children} </Show> == hide element
const Show 	= props => check(props) ? render(props) : null

// <Hide condition={true}> {props.children} </Hide> == hide element
// <Hide unless={true}> {props.children} </Hide> == show element
const Hide 	= props =>  !check(props) ? render(props) : null

// <If condition={true}> {props.children} </If> == show element
const If 	= props => check(props) ? render(props) : null
// this used in conjuction with <If />
// <If condition={true} /> == show element
// <Else condition={true} />  == hide element
const Else 	= props => !check(props) ? render(props) : null

// <Unless condition={true}> {props.children} </Unless> == hide element
const Unless = props => !check(props) ? render(props) : null

function toggleState(selector) {
	this.setState({ [selector]: !this.state[selector] })
}

function handleChange(selector, event) {
	this.setState({ [selector]: event.target.value })
}

export { Show, Hide, If, Unless, Else, toggleState, handleChange }

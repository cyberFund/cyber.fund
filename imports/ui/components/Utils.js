import React, { PropTypes } from 'react'
import { _ } from 'meteor/underscore'
// check condition value
function check (props) {
	const data = props.condition || props.unless
	// check for empty object or array
	if (_.isObject(data)) return !_.isEmpty(data)
	// if 'condition' not specified means 'unless' is used
    return _.has(props, 'condition') ? Boolean(data) : !Boolean(data)
}
/* 	check() and render() not merged because in future check
	might have more checks and/or will be used elsewhere */
function render(props) {
	// if component specified create custom element
	if (props.component) return <props.component {...props} />
	else return props.children
}
// <Show condition={true}> {props.children} </Show> == show element
// <Show unless={true}> {props.children} </Show> == hide element
const Show = props => {
    return check(props) ? render(props) : null
}
// <Hide condition={true}> {props.children} </Hide> == hide element
// <Hide unless={true}> {props.children} </Hide> == show element
const Hide = props => {
	return !check(props) ? render(props) : null
}
// <If condition={true}> {props.children} </If> == show element
const If = props => {
    return check(props) ? render(props) : null
}
// <Unless condition={true}> {props.children} </Unless> == hide element
const Unless = props => {
    return !check(props) ? render(props) : null
}
// this used in conjuction with <IF />
// <If condition={true} /> == show element
// <Else condition={true} />  == hide element
const Else = props => {
    return !check(props) ? render(props) : null
}

export { Show, Hide, If, Unless, Else }

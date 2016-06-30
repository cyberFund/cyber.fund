import React, { PropTypes } from 'react'
// check condition value
function check (value) {
    return Boolean(value)
}
/* 	check() and render() not merged because in future check
	might have more checks and/or will be used elsewhere */
function render(props) {
	// if component specified create custom element
	if (props.component) return <props.component {...props} />
	// else return children
	else return props.children
}
// <Show condition={true}> {props.children} </Show> == show element
const Show = props => {
    return check(props.condition) ? render(props) : null
}
// <Hide condition={true}> {props.children} </Hide> == hide element
const Hide = props => {
	return !check(props.condition) ? render(props) : null
}
// <If condition={true}> {props.children} </If> == show element
const If = props => {
    return check(props.condition) ? render(props) : null
}
// <Unless condition={true}> {props.children} </Unless> == hide element
const Unless = props => {
    return !check(props.condition) ? render(props) : null
}

export { Show, Hide, If, Unless }

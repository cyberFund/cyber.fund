import React, { PropTypes } from 'react'
// check condition value
function checkValue (value) {
    return Boolean(value)
}
/* 	checkValue() and render() not merged because in future checkValue
	might have more checks and/or will be used elsewhere */
function render(condition, props) {
	// if component specified create custom element
	if (condition && props.component) return <props.component {...props} />
	// else return children or nothing
	else return condition ? props.children : null
}
// <Show condition={true}> {props.children} </Show> == show element
const Show = props => {
    return render(checkValue(props.condition), props)
}
// <Hide condition={true}> {props.children} </Hide> == hide element
const Hide = props => {
	return render(!checkValue(props.condition), props)
}
// <If condition={true}> {props.children} </If> == show element
const If = props => {
    return render(checkValue(props.condition), props)
}
// <Unless condition={true}> {props.children} </Unless> == hide element
const Unless = props => {
    return render(
			!checkValue(props.condition),
			createElement(props.element, props.children)
		)
}

export { Show, Hide, If, Unless }

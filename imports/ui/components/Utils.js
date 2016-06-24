import React, { PropTypes } from 'react'
// check condition value
function checkValue (value) {
    return Boolean(value)
}
/* 	checkValue and showOrHide not merged because in future checkValue
	might have more checks and/or will be used elsewhere */
function showOrHide(condition, children) {
	    if (condition) return children
	    else return null
}
// <Show condition={true}> {props.chilcredn} </Show> == show element
const Show = props => {
    return showOrHide(checkValue(props.condition), props.children)
}
// <Hide condition={true}> {props.chilcredn} </Hide> == hide element
const Hide = props => {
	return showOrHide(!checkValue(props.condition), props.children)
}
// <If condition={true}> {props.chilcredn} </If> == show element
const If = props => {
    return showOrHide(checkValue(props.condition), props.children)
}
export { Show, Hide, If }

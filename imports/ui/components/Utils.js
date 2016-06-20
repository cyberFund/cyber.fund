import React, { PropTypes } from 'react'
// check condition value
function checkValue (value) {
    return Boolean(value)
}
// <Show condition={true}> {props.chilcredn} </Show> == shown element
const Show = props => {
    if (checkValue(props.condition)) return props.children
    else return null
}
// <Hide condition={true}> {props.chilcredn} </Hide> == hidden element
const Hide = props => {
    if (!checkValue(props.condition)) return props.children
    else return null
}
export { Show, Hide }

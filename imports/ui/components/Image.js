import React, { PropTypes } from 'react'
import {$} from 'meteor/jquery'
import classNames from 'classnames'

class Image extends React.Component {
    handleError() {
        $(this.refs.img).attr('src', 'https://www.gravatar.com/avatar?d=mm&s=48')
    }
    render() {
        const {props, handleError} = this,
        // add extra classes based of attributes
        classes = classNames( props.className, {
            'mdl-list__item-avatar': props.avatar
        })
        return <img {...props} className={classes} onError={handleError.bind(this)} ref='img'  />
    }
}

Image.propTypes = {
  src: PropTypes.string.isRequired
}

export default Image

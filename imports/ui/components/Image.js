import React, { PropTypes } from 'react'
import {$} from 'meteor/jquery'
import classNames from 'classnames'

class Image extends React.Component {
	// if image cannot be loaded use default image
    handleError() {
        $(this.refs.img).attr('src', 'https://www.gravatar.com/avatar?d=mm&s=48')
    }
    render() {
        const {props, handleError} = this
	    // add extra classes based of attributes
	    const classes = classNames( props.className, {
	            'mdl-list__item-avatar': props.avatar
	        })
		let src = props.src
		let style = props.style || {}
		/* add custom styles to image */
		// for avatar auto height, for normal images limited (to avoid images being bigger than parent element)
		_.extend(style, {maxHeight: props.avatar ? 'auto' : '100%'})
		// if props.src is object means system image is requested
		if(typeof props.src == 'object') {
			// get system logo url
			src = CF.Chaingear.helpers.cgSystemLogoUrl(props.src)
			// extend style object with system specific css
			style = _.extend(style, {backgroundColor: 'transparent', borderRadius: 0})
		}
        return <img
					{...props}
					src={src}
					className={classes}
					style={style}
					onError={handleError.bind(this)}
					ref='img' />
    }
}

Image.propTypes = {
	// url string or system object
	src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}

export default Image

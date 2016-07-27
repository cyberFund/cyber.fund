import React, { PropTypes } from 'react'
import { $ } from 'meteor/jquery'
import classNames from 'classnames'
import helpers from '../helpers'

class Image extends React.Component {

    render() {
        let { src, small, avatar, className, style = {} } = this.props

	    // add extra classes based of attributes
	    const classes = classNames( className, { 'mdl-list__item-avatar': avatar || small })

		/* add custom styles to image */
		// if src is object means system image is requested
		// for system and small images reset backgroundColor and borderRadius
		if (small || typeof src == 'object') {
			style = _.extend(style, {backgroundColor: 'transparent', borderRadius: 0})
		}
		// for avatar set auto height, for normal images limited (to avoid images being bigger than parent element)
		_.extend(style, {maxHeight: avatar ? 'auto' : '100%'})

		// do not forget: {...this.props} must be first because we overide it's properties
        return 	<img
					{...this.props}
					src={typeof src == 'object' ? helpers.cgSystemLogoUrl(src) : src}
					className={classes}
					style={style}
					onError={this.handleError}
					ref='img'
				/>
    }

	// if image cannot be loaded use default image
	handleError = () => $(this.refs.img).attr('src', 'https://www.gravatar.com/avatar?d=mm&s=48')

}

Image.propTypes = {
	// url string or system object
	src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	avatar: PropTypes.bool,
	// if small prop is used, styles will be similar with avatar, except no border radius and background color
	small: PropTypes.bool
}

export default Image

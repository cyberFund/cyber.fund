import React, { PropTypes } from 'react'

const Brand = props => {
    return <span {...props}>cyber <span style={{color: '#F44336'}}>•</span> Fund</span>
}
/*Brand.defaultProps = {
    component: 'span'
}*/
export default Brand

/*return React.createElement(component || (href ? 'a' : 'button'), {
    className: buttonClasses,
    href,
    ...otherProps
}, children);*/

import React, { PropTypes } from 'react'

const Brand = props => {
    return  <props.component {...props}>
                cyber <span style={{color: '#F44336'}}>•</span> Fund
            </props.component>
}
Brand.defaultProps = {
    component: 'span'
}
Brand.propTypes = {
    component: PropTypes.string
}
export default Brand

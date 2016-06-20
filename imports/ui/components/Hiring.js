import React from 'react'
import Brand from '../components/Brand'

const Hiring = props => {
    return   <p className="text-center" {...props}>
                We are hiring CTO
                <a
                    style={{textDecoration: 'none', color: '#039be5'}}
                    href="https://github.com/cyberFund/cyber.fund/issues/425"
                    >https://github.com/cyberFund/cyber.fund/issues/454</a>.
                Join <Brand />!
              </p>
}

export default Hiring

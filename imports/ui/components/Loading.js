import React from 'react'
import { Spinner } from 'react-mdl'

const Loading = props => {
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
    return <div style={style}>
                <Spinner />
           </div>
}

export default Loading

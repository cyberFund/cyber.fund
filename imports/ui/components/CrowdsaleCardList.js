import React, { PropTypes } from 'react'
import CrowdsaleCard from './CrowdsaleCard'
import { Grid, Cell } from 'react-mdl'

class CrowdsaleCardList extends React.Component {
  render () {
    return (
      <div>
        <Grid>
          <Cell col={12} className="text-center">
            <h4>{this.props.title}</h4>
          </Cell>
        </Grid>
        <Grid>
        {// if there are any items render them
          this.props.items.length ?
          this.props.items.map(item => {
          return <CrowdsaleCard
                    key={item._id}
                    item={item}
                    type={this.props.type} />
                })
          : null
        }
        </Grid>
      </div>
  )}
}

CrowdsaleCardList.propTypes = {
 title: PropTypes.string.isRequired,
 items: PropTypes.array.isRequired,
 //type is optional because there is default rule
 type: PropTypes.string
}

export default CrowdsaleCardList

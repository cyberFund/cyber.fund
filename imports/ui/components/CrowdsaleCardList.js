import React, { PropTypes } from 'react'
import CrowdsaleCard from './CrowdsaleCard'
import { Grid, Cell } from 'react-mdl'

class CrowdsaleCardList extends React.Component {
  render () {
    return (
      <div>
        <Grid>
          <Cell col={12} className="text-center">
            <h5>{this.props.title}</h5>
          </Cell>
        </Grid>
        <Grid>
        {// if there are any items render them
          this.props.items.length ?
          this.props.items.map(item => {
          return <CrowdsaleCard
                    key={item._id}
                    item={item}
                    {...this.props} />
                })
          : null
        }
        </Grid>
      </div>
  )}
}
CrowdsaleCardList.defaultProps = {
    itemComponent: 'h4'
}
CrowdsaleCardList.propTypes = {
 title: PropTypes.string.isRequired,
 //itemComponent: PropTypes.oneOf(['active', 'upcoming', 'past', 'projects']),
 items: PropTypes.array.isRequired,
 size: PropTypes.oneOf(['big', 'small', '']),
 //type is optional because there is default rule
 type: PropTypes.string
}

export default CrowdsaleCardList

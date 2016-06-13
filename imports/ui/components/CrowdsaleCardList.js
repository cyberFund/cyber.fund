import React, { PropTypes } from 'react'
import CrowdsaleCard from './CrowdsaleCard'
import { Grid, Cell } from 'react-mdl'

const CrowdsaleCardList = props => {
    // title tag is h5 or titleComponent
    const renderTitle = React.createElement(
                  props.titleComponent,
                  {className: "text-center"},
                  props.title
                )
    const renderCards = props.items.map(item => {
                    return <CrowdsaleCard
                              key={item._id}
                              item={item}
                              {...props} />
    })
    return  <div>
                <Grid>
                  <Cell col={12}>{renderTitle}</Cell>
                </Grid>
                <Grid>
                    { props.items.length ? renderCards : null }
                </Grid>
            </div>
}
CrowdsaleCardList.defaultProps = {
    titleComponent: 'h5'
}
CrowdsaleCardList.propTypes = {
 title: PropTypes.string.isRequired,
 titleComponent: PropTypes.string,
 items: PropTypes.array.isRequired,
 size: PropTypes.oneOf(['big', 'small', '']),
 //type is optional because there is default rule
 type: PropTypes.oneOf(['active', 'upcoming', 'past', 'projects'])
}

export default CrowdsaleCardList

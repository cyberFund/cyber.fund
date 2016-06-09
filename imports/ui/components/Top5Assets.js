import React, { PropTypes }from 'react'
import { Grid, Cell, DataTable, TableHeader } from 'react-mdl'
import helpers from '../helpers'

const Top5Assets = (props) => {
    let data
    try {
      data = props.systems.map( i => {
          return {
            system: helpers.displaySystemName(i),
            cmgr: helpers.readableN1(i.calculatable.RATING.vector.GR.monthlyGrowthD),
            months: helpers.readableN0(i.calculatable.RATING.vector.GR.months),
            rating: helpers.readableN1(i.calculatable.RATING.sum)
          }
      })
    } catch (e) { data = [] }
    // tooltips
    // tooltips currently not work properly. Because mdl's tooltips are too small
    // TODO: implement proper tooltips
    const cmgrTP = `Key indicator that shows long term profitability of investment. We use monthly calculation in opposite to annual in traditional finance as blockchain markets are faster than tradational thus should be evaulated more frequently.`,
    monthsTP = `This is time passed since time of sampling 'first price' metric.`
    ratingTP = `Compound evaluation of a given crypto property. Methodology depend on a stage, type and class of a given cryptoproperty. More than 50 indicators are evaluated in a realtime.`

    const tableStyle = {marginLeft: 'auto', marginRight: 'auto'}

    return (// style={{width: '100%'}}
      <div>
        <Grid>
          <Cell col={12}>
            <h5 className="center"> Top 5 Rated Assets </h5>
          </Cell>
        </Grid>
        <Grid>
          <Cell col={12}>
            <DataTable rows={data} style={tableStyle} shadow={0}>
                <TableHeader name="system">
                  System
                </TableHeader>
                <TableHeader numeric name="cmgr" tooltip="Profitability of investment">
                  CMGR[$]
                </TableHeader>
                <TableHeader numeric name="months" tooltip="This passed since time of sampling">
                  Months
                </TableHeader>
                <TableHeader numeric name="rating" tooltip="Compound evaluation of a crypto property">
                  Rating
                </TableHeader>
            </DataTable>
          </Cell>
          {/* you can add components after table */}
          {props.children}
        </Grid>
      </div>
  )
}
Top5Assets.defaultProps = {
  systems: []
}
Top5Assets.propTypes = {
  systems: PropTypes.array.isRequired
}
export default Top5Assets

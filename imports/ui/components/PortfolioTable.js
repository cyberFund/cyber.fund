import React, { PropTypes } from 'react'
import {DataTable, TableHeader} from 'react-mdl'

const PortfolioTable = props => {
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
    return (
        <DataTable rows={data} style={tableStyle} shadow={0}>
            <TableHeader name="system">
              System
            </TableHeader>
            <TableHeader numeric name="amount">
              Amount
            </TableHeader>
            <TableHeader numeric name="equity">
              Equity
            </TableHeader>
            <TableHeader numeric name="share">
              Portfolio Share
            </TableHeader>
            <TableHeader numeric name="btc">
              Value in BTC
            </TableHeader>
            <TableHeader numeric name="usd">
              Value in USD
            </TableHeader>
            <TableHeader numeric name="usdPrice">
              USD Price
            </TableHeader>
            <TableHeader numeric name="usdCap">
              USD Cap
            </TableHeader>
        </DataTable>
    )
}
/*PortfolioTable.defaultProps = {
    component: 'span'
}*/
export default PortfolioTable

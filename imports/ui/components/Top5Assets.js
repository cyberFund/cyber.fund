import React from 'react'
import { Grid, Cell, DataTable, TableHeader } from 'react-mdl' //
//import { Grid, Cell } from './Grid'

class Top5Assets extends React.Component {
  constructor(params){
    super(params)
    this.state = {
      lastAddress: undefined,
      lastStatus: undefined
    }
  }// offset={6} offsetTablet={1}
  render () {
    return (
      <div>
        <Grid>
          <Cell col={12}>
            <h5 className="center"> Top 5 Rated Assets </h5>
          </Cell>
        </Grid>
        <Grid>
          <Cell col={4} tablet={6} phone={12} className="mdl-cell--4-offset-desktop mdl-cell--1-offset-tablet">
            <DataTable
                style={{width: '100%'}}
                shadow={0}
                rows={[
                    {material: 'Acrylic (Transparent)', quantity: 25, price: 2.90},
                    {material: 'Plywood (Birch)', quantity: 50, price: 1.25},
                    {material: 'Laminate (Gold on Blue)', quantity: 10, price: 2.35}
                ]}
              >
                <TableHeader name="material" tooltip="The amazing material name">Material</TableHeader>
                <TableHeader numeric name="quantity" tooltip="Number of materials">Quantity</TableHeader>
                <TableHeader numeric name="price" cellFormatter={(price) => `\$${price.toFixed(2)}`} tooltip="Price pet unit">Price</TableHeader>
            </DataTable>
          </Cell>
          {/* you can add components after table */}
          {this.props.children}
        </Grid>
      </div>
  )}
}
export default Top5Assets

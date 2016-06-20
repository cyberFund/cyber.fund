import React, { PropTypes } from 'react'
import { Grid, Cell, DataTable, TableHeader } from 'react-mdl'
import { Show, Hide } from '../components/Utils'
import Loading from '../components/Loading'

const FundsPage = props => {
    const table =   <DataTable
                            style={{margin: '0 auto'}}
                            shadow={0}
                            rows={[
                                {fund: 'Acrylic (Transparent)', bitcoins: 25, dollars: 2.90, followed: 40},
                                {fund: 'Plywood (Birch)', bitcoins: 50, dollars: 1.25, followed: 40},
                                {fund: 'Laminate (Gold on Blue)', bitcoins: 10, dollars: 2.35, followed: 40}
                            ]}
                        >
                            <TableHeader name="fund">Fund</TableHeader>
                            <TableHeader numeric name="bitcoins">Valuation in Ƀ</TableHeader>
                            <TableHeader numeric name="dollars">Valuation in $</TableHeader>
                            <TableHeader numeric name="followed">Followed By</TableHeader>
                    </DataTable>
    return props.loaded ? (
        <Grid id="FundsPage" className="text-center">
            <Show condition={Meteor.userId()}>
                <Cell col={12}>
                    <h4>Top Funds You Follow</h4>
                    {table}
                </Cell>
            </Show>
            {/* TODO make a "join us" component? */}
            <Hide condition={Meteor.userId()}> atNavButton</Hide>
            <Cell col={12}>
                <h4>Top Funds You Don't Follow</h4>
                <p>We currently only list here people with 3+ followers</p>
                {table}
            </Cell>
        </Grid>
  ) : <Loading />
}

/*<h4 class="center">Top Funds You Follow</h4>
{{#if currentUser}}
<table class="center" style="max-width: 36em; margin: 0 auto" id="funds-table">
  <thead>
    <th class="center">Fund</th>
    <th class="center">Valuation in Ƀ</th>
    <th class="center">Valuation in $</th>
    <th class="center">Followed By</th>
  </thead>
  <tbody>
    {{#each rowsIFollow}}
      {{> fundsRow this}}
    {{/each}}
  </tbody>
</table>
{{else}}

{{> atNavButton}}
{{/if}}

<h4 class="center">Top Funds You Don't Follow</h4>
<p class="center">
  We currently only list here people with 3+ followers
</p>
<table class="center" style="max-width: 36em; margin: 0 auto" id="funds-table">
  <thead>
    <th class="center">Fund</th>
    <th class="center">Valuation in Ƀ</th>
    <th class="center">Valuation in $</th>
    <th class="center">Followed By</th>
  </thead>
  <tbody>
    {{#each rowsIDontFollow}}
      {{> fundsRow this}}
    {{/each}}
  </tbody>
</table>
*/



FundsPage.propTypes = {
 //skills: PropTypes.array.isRequired,
 //numberOfSkills: PropTypes.number.isRequired
}

export default FundsPage

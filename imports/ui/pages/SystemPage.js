import React, { PropTypes } from 'react'
import Loading from '../components/Loading'
import CrowdsaleCardList from '../components/CrowdsaleCardList'
import { Card, CardTitle, CardText, CardActions, Button, CardMenu, IconButton, Grid, Cell } from 'react-mdl'


const RadarPage = props => {

    return props.loaded ? (
      <div id="SystemPage">
          <section>
              system.image system.name system.rating
          </section>
          <section>
              starred by % people
              system.infoLinks
          </section>
          <section>
              system.stats:
              price cap trade supply
          </section>
          <section>
              info graph
          </section>
          <section>
              News:
              CardLinks
          </section>
          <section>
              Apps:
              tabs*4> LinkCards
          </section>
          <section>
              Internal Economy:
              LinkCards
          </section>
          <section>
              Scientific Roots:
              links list
          </section>
          <section>
              Developers Dimension:
              links list
          </section>
          <section>
              Specification:
              table
          </section>
          <section>
              page visits graph
          </section>
      </div>
    ) : <Loading />
}

RadarPage.propTypes = {
 projects: PropTypes.array.isRequired,
 past: PropTypes.array.isRequired,
 upcoming: PropTypes.array.isRequired,
 active: PropTypes.array.isRequired,
 loaded: PropTypes.bool.isRequired
}

export default RadarPage

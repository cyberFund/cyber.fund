import React from 'react'
import { Layout, Header, Navigation, Drawer, Content, Textfield } from 'react-mdl'

class NavBar extends React.Component {
  render () {
    const brandLink = (
      <a
        style={{color: 'white'}}
        className="mdl-button mdl-js-button mdl-js-ripple-effect"
        href="/">
        Cyber.Fund
      </a>
    ) // style={{color: 'white'}}
    return (
      <div>
            <Header scroll title={brandLink}>
                <Navigation>
                    <a href="/radar">Crowdsales</a>
                    <a href="/rating">Assets</a>
                    <a href="/funds">Funds</a>
                    <Textfield
                        value=""
                        onChange={() => {}}
                        label="Search for coin"
                        expandable
                        expandableIcon="search"
                    />
                </Navigation>
            </Header>
            <Drawer title={brandLink}>
                <Navigation>
                    <a href="/radar">Crowdsales</a>
                    <a href="/rating">Assets</a>
                    <a href="/funds">Funds</a>
                    <Textfield
                        value=""
                        onChange={() => {}}
                        label="Search for coin"
                        expandable
                        expandableIcon="search"
                    />
                </Navigation>
            </Drawer>
            {/*<Content />*/}
    </div>
  )}
}

export default NavBar

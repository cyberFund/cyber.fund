import React from 'react'
import { Meteor } from 'meteor/meteor'
import { $ } from 'meteor/jquery'
import { Layout, Content,
  Header, Navigation, Drawer, Textfield,
  Footer, FooterSection, FooterDropDownSection, FooterLinkList } from 'react-mdl'


class MainLayout extends React.Component {
    componentDidMount() {
        // after link or button click close sidebar
        // but not if it's expandable search button
        $('.mdl-layout__drawer .mdl-navigation__link:not(.mdl-textfield--expandable), .mdl-layout__drawer .mdl-button:not([for="textfield-Searchforcoin"])').click(function(){
            Meteor.setTimeout(function triggerClick(){
              $('.mdl-layout__obfuscator').trigger('click');
            }, 280)
        })
    }
 render() {
   const brandLink = <a
                      style={{color: 'white'}}
                      className="mdl-button mdl-js-button mdl-js-ripple-effect"
                      href="/">
                      Cyber.Fund
                     </a>
   return (
     <Layout>

       {/* HEADER NAV */}
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

       {/* MOBILE SIDEBAR */}
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

       {/* MAIN CONTENT */}
        <Content component="main">
          {this.props.main}
        </Content>

        {/* FOOTER */}
        <Footer size="mega">
          <FooterSection type="middle">
                  <h5>About
                    cyber<span style={{color: 'yellow', fontSize: '0.85em'}}>
                      <strong>•</strong>
                    </span>Fund
                  </h5>
                  <p>Our mission to make digital investments comprehensible, accessible, easy and safe.</p>
          </FooterSection>
          <FooterSection type="middle">
              <FooterDropDownSection title="Build">
                  <FooterLinkList>
                      <a
                        href="http://cybertalks.org/t/radar-listing-of-cryptocurrencies-and-cryptoassets/354"
                        target="_blank">
                        Listing
                      </a>
                      <a
                        href="https://github.com/cyberFund/chaingear"
                        target="_blank">
                        Chaingear
                      </a>
                      <a
                        href="https://github.com/cyberFund"
                        target="_blank">
                        Github
                      </a>
                  </FooterLinkList>
              </FooterDropDownSection>
              <FooterDropDownSection title="About">
                  <FooterLinkList>
                    <a href="/decisions">
                      Decisions
                    </a>
                    <a
                      href="https://www.coinprism.info/asset/AbhBFwWFpZzFMsBakZbDzUTYv67t9rThaK"
                      target="_blank">
                      Cryptoasset
                    </a>
                    <a
                      href="https://www.coinprism.info/asset/AbhBFwWFpZzFMsBakZbDzUTYv67t9rThaK/owners"
                      target="_blank">
                      Holders
                    </a>
                  </FooterLinkList>
              </FooterDropDownSection>
              <FooterDropDownSection title="Connect">
                  <FooterLinkList>
                      <a
                        href="https://blog.cyber.fund/"
                        target="_blank">
                        Medium
                      </a>
                      <a
                        href="https://twitter.com/cyberfundio"
                        target="_blank">
                        Twitter
                      </a>
                      <a
                        href="https://gitter.im/orgs/cyberFund/rooms"
                        target="_blank">
                        Gitter
                      </a>
                  </FooterLinkList>
              </FooterDropDownSection>
              <FooterDropDownSection title="Projects">
                  <FooterLinkList>
                      <a href="/system/SatoshiFund">Satoshi•Fund</a>
                      <a href="/system/SatoshiPie">Satoshi•Pie</a>
                      <a href="http://daobase.org" target="_blank">Daobase</a>
                  </FooterLinkList>
              </FooterDropDownSection>
            </FooterSection>
            <FooterSection type="bottom" logo="">
                <FooterLinkList>
                  <a href="https://mixpanel.com/f/partner">
                    <img src="//cdn.mxpnl.com/site_media/images/partner/badge_light.png" alt="Mobile Analytics" />
                  </a>
                </FooterLinkList>
            </FooterSection>
        </Footer>
      </Layout>
  )}
}

export default MainLayout

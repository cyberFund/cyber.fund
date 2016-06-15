import React from 'react'
import { Meteor } from 'meteor/meteor'
import { $ } from 'meteor/jquery'
import Blaze from 'meteor/gadicc:blaze-react-component'
import { If, Then, Else } from 'react-if'
import { Layout, Content,
  Header, Navigation, Drawer, Textfield,
  Footer, FooterSection, FooterDropDownSection, FooterLinkList, Button } from 'react-mdl'
import BitcoinPrice from '../components/BitcoinPrice'

class MainLayout extends React.Component {
    constructor(props){
        super(props)
        this.state = {user: {}, username: ''}
    }
    componentDidMount() {
        // get data
        const user = Meteor.user()
        const username = user && user.username ? user.username : ''
        this.setState({ user, username })
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
     /* show login button or profile link */
     const loginOrProfileLink =  <If condition={Boolean(this.state.user)}>
                                    <Then>
                                          {/* show username or just "profile"*/}
                                          <If condition={Boolean(this.state.username)}>
                                            <Then>{/* TODO: if avatar package changes this class myight not be needed className="mdl-navigation__link" */}
                                              <a href={`/@${this.state.username}`} className="mdl-navigation__link">
                                                  <Blaze template="avatar" shape="circle" />
                                                  {this.state.username}
                                              </a>
                                            </Then>
                                            <Else>
                                                <a href={`/@${this.state.username}`} className="mdl-navigation__link">Profile</a>
                                            </Else>
                                          </If>
                                    </Then>
                                    <Else>
                                        <Button href="/welcome" raised accent ripple>Join Us</Button>
                                    </Else>
                                </If>
    const navLinks = <Navigation>
                       <a href="/radar">Crowdsales</a>
                       <a href="/rating">Assets</a>
                       <a href="/funds">Funds</a>
                       <a href="https://www.academia.edu/22691395/cyber_Rating_Crypto_Property_Evaluation" target="_blank">Whitepaper</a>
                       <a href="https://blog.cyber.fund" target="_blank">Blog</a>
                       <Textfield
                           value=""
                           onChange={() => {}}
                           label="Search for coin"
                           expandable
                           expandableIcon="search"
                       />
                       <a href="" style={{lineHeight: 'inherit'}}>
                           <BitcoinPrice />
                       </a>
                       {loginOrProfileLink}
                   </Navigation>
   return (
     <Layout>
       {/* HEADER NAV */}
       <Header scroll title={brandLink}>{navLinks}</Header>
       {/* MOBILE SIDEBAR */}
       <Drawer title={brandLink} className="text-center">{navLinks}</Drawer>
       {/* MAIN CONTENT */}
       <Content component="main">{this.props.main}</Content>
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

import React from 'react'
import { Footer, FooterSection, FooterDropDownSection, FooterLinkList } from 'react-mdl'

export default FooterNav = props => {

   return	<Footer size="mega">

				<FooterSection type="middle">
					<h5>
						About cyber
						<span style={{color: 'yellow', fontSize: '0.85em'}}>
							<strong>•</strong>
						</span>
						Fund
					</h5>
					<p>Our mission to make digital investments comprehensible, accessible, easy and safe.</p>
				</FooterSection>

				<FooterSection type="middle">

					<FooterDropDownSection title="Build">
						<FooterLinkList>
						<a href="http://cybertalks.org/t/radar-listing-of-cryptocurrencies-and-cryptoassets/354" target="_blank">
							Listing
						</a>
						<a href="https://github.com/cyberFund/chaingear" target="_blank">
							Chaingear
						</a>
						<a href="https://github.com/cyberFund" target="_blank">
							Github
						</a>
						</FooterLinkList>
					</FooterDropDownSection>

					<FooterDropDownSection title="About">
						<FooterLinkList>
							<a href="/decisions">
								Decisions
							</a>
							<a href="https://www.coinprism.info/asset/AbhBFwWFpZzFMsBakZbDzUTYv67t9rThaK" target="_blank">
								Cryptoasset
							</a>
							<a href="https://www.coinprism.info/asset/AbhBFwWFpZzFMsBakZbDzUTYv67t9rThaK/owners" target="_blank">
								Holders
							</a>
						</FooterLinkList>
					</FooterDropDownSection>

					<FooterDropDownSection title="Connect">
						<FooterLinkList>
							<a href="https://blog.cyber.fund/" target="_blank"> Medium </a>
							<a href="https://twitter.com/cyberfundio" target="_blank"> Twitter </a>
							<a href="https://gitter.im/orgs/cyberFund/rooms" target="_blank"> Gitter </a>
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

}

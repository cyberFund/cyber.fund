import React from 'react'
import { Meteor } from 'meteor/meteor'
import { $ } from 'meteor/jquery'
import { Navigation, Drawer, Button } from 'react-mdl'
import BitcoinPrice from '../../components/BitcoinPrice'
import Search from '../../components/Search'
import ProfileLink from '../../components/ProfileLink'

class HeaderNav extends React.Component {

	// attach event listeners
    componentDidMount() {
        // after link or button click close sidebar
        // but not if it's a search component
        $('.mdl-layout__drawer .mdl-navigation__link:not(.search)').click(
			function() {
	            Meteor.setTimeout(
					() =>  $('.mdl-layout__obfuscator').trigger('click'),
					280
				)
        })
    }

	render() {

		// data
		const 	user = Meteor.user()

		// styles
		const	buttonStyle = {
					height: 'auto',
					color: 'white'
				}

		return	<Drawer
					title={
						<Button href="/" ripple> Cyber.Fund </Button>
					}
					className="text-center"
				>
					<Navigation>
						<a href="/radar">Crowdsales</a>
						<a href="/rating">Assets</a>
						<a href="/funds">Funds</a>
						<a href="https://www.academia.edu/22691395/cyber_Rating_Crypto_Property_Evaluation" target="_blank">Whitepaper</a>
						<a href="https://blog.cyber.fund" target="_blank">Blog</a>
						<a
							href=""
							className="search"
							style={{ padding: '0 50px' }}
						>
							<Search color="inherit" fullWidth />
						</a>
						<a href="" style={{lineHeight: 'inherit', cursor: 'none'}}>
							<BitcoinPrice />
						</a>
						{/* show login button or profile link */}
						{
							user
							? <ProfileLink user={user} style={{ padding: 10 }} />
							: <Button href="/welcome" style={buttonStyle} raised accent ripple>Join Us</Button>
						}
					</Navigation>
				</Drawer>

  }
}

export default HeaderNav

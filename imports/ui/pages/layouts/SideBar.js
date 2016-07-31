import React from 'react'
import { Meteor } from 'meteor/meteor'
import { $ } from 'meteor/jquery'
import { Navigation, Drawer, Button } from 'react-mdl'
import BitcoinPrice from '../../components/BitcoinPrice'
import Search from '../../components/Search'
import ProfileLink from '../../components/ProfileLink'

class HeaderNav extends React.Component {

    componentDidMount() {
        // after link or button click close sidebar
        // but not if it's search component
        $('.mdl-layout__drawer .mdl-navigation__link:not(input)').click(function(){ // , .mdl-layout__drawer .mdl-button:not([for="textfield-Searchforcoin"])
            Meteor.setTimeout(function triggerClick(){
              $('.mdl-layout__obfuscator').trigger('click');
            }, 280)
        })
    }

	render() {

		// data is defined not in state on purpose, because otherwise it is not reactive
		const 	user = Meteor.user(),
				brandLink = <Button href="/" style={{color: 'white'}} ripple> Cyber.Fund </Button>

	    /* show login button or profile link */
	    const loginOrProfileLink =	user
									? <ProfileLink user={user} />
									: <Button href="/welcome" raised accent ripple>Join Us</Button>

	    const navLinks = 	<Navigation>
								<a href="/radar">Crowdsales</a>
								<a href="/rating">Assets</a>
								<a href="/funds">Funds</a>
								<a href="https://www.academia.edu/22691395/cyber_Rating_Crypto_Property_Evaluation" target="_blank">Whitepaper</a>
								<a href="https://blog.cyber.fund" target="_blank">Blog</a>
								<a href=""> <Search /> </a>
								<a href="" style={{lineHeight: 'inherit', cursore: 'none'}}>
									<BitcoinPrice />
								</a>
								{loginOrProfileLink}
							</Navigation>

		return	<Drawer title={brandLink} className="text-center">{navLinks}</Drawer>

  }
}

export default HeaderNav

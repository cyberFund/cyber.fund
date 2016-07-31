import React from 'react'
import ThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Layout, Content } from 'react-mdl'
import Header from './Header'
import SideBar from './SideBar'
import Footer from './Footer'


const MainLayout = props => {
{/* material-ui dependency */}
{/* mdl's content wrapper */}
	return 	<ThemeProvider>
				<Layout>

					<Header />
					<SideBar />
					<Content component="main"> {props.main} </Content>
					<Footer />

				</Layout>
			</ThemeProvider>

}

export default MainLayout

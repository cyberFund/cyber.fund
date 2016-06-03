import React from 'react'
import { Layout, Content } from 'react-mdl'
import Header from '../components/Header'
import Footer from '../components/Footer'

class MainLayout extends React.Component {
 render() { return (
   // render specified nav or footer or default one
   <Layout>
      {this.props.nav || <Header />}
      {/* do we need to place <main> outside of
       <Content /> for SEO purposes? */}
      <Content>
        {this.props.main}
      </Content>
      {this.props.footer || <Footer />}
    </Layout>
  )}
}

export default MainLayout

import React from 'react'
import Loading from '../components/Loading'

// this is a wrapper for page components which shows a loading indicator on load

function PageLoading(PageComponent) {

	return class Enhance extends React.Component {

		render() {
			const { props, state } = this
			return props.loaded ? <PageComponent {...state} {...props} /> : <Loading />
		}

	}

}

export default PageLoading

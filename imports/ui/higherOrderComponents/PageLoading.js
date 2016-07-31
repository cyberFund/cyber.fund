import React from 'react'
import Loading from '../components/Loading'

// this is a wrapper for page components which shows a loading indicator on load.
// to make page load faster this trick was used:
// both Loading and Page component are being rendered but Page is invisible untill data is ready.
// this is important because usually we wait for data => and only afterwards we render component
// the difference between two methods can be up to 2000 miliseconds(!) of longer loading time

function PageLoading(PageComponent) {

	class Enhance extends React.Component {

		render() {

			const { props, state } = this
			return  <div>
						{ props.loaded ? null : <Loading /> }
						<div className={ props.loaded ? 'visible' : 'hidden' }>
							<PageComponent {...state} {...props} />
						</div>
					</div>

		}

	}

	return Enhance
}

export default PageLoading

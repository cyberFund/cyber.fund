import React from 'react'

class SystemLogo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            img_url: CF.Chaingear.helpers.cgSystemLogoUrl(props.system)
        }
    }
    componentDidMount() {
        const t = this
        const $image = $(this.refs.img)

        $image.on('error', function (){
          if (t.data.fallback == 'av')
          $image.attr('src', "https://www.gravatar.com/avatar?d=mm&s=48")
        })

        $image.on('load', function () {
          $image.removeClass('hidden')
        })

        if ($image[0].complete) {
          $image.load()
        }
    }
    componentWillUnmount() {
        $(this.refs.img).remove()
    }
    render() {
        return <img ref='img' className="hidden" src={this.state.img_url} {...this.props} />
    }
}

export default SystemLogo

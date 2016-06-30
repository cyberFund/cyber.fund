import React, { PropTypes } from 'react'
import CrowdsaleCard from './CrowdsaleCard'
import { Grid, Cell } from 'react-mdl'

const LinkCard = props => {
    return <a {...props} href={props.href} className="mdl-card mdl-shadow--4dp hover-shadow link-card">
                <img src={props.img} alt="" className="link-card__image" />
                <span className="link-card__text">{props.text}</span>
                {props.children}
            </a>

}
LinkCard.defaultProps = {
    titleComponent: 'h5'
}
LinkCard.propTypes = {
 text: PropTypes.string.isRequired,
 img: PropTypes.string
}

export default LinkCard
/*        <a href="{{pathFor '/system/:name_' name_=(_toUnderscores _id)}}">
            <div class="mdl-card hover-shadow">
                <div clasNames="cglinkcard">
                    {{> cgSystemLogo system=this className="cglinkcard-icon"}}

                    <div className="enlarge text-center cglinkcard-text">
                          {{_id}}
                    </div>
                </div>
            </div>
        </a>*/

import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
/*import { Counts } from 'meteor/tmeasday:publish-counts'
import { ReactiveVar } from 'meteor/reactive-var'
import { Revisions } from '../../api/revisions.js'
import { Threads } from '../../api/threads.js'
import { Skills } from '../../api/skills.js'
import ThreadsInsert from '../components/ThreadsInsert'
import Form from '../components/Form'
import List from '../components/List'
import Loading from '../components/Loading'*/


class RatingPage extends Component {
  _someMethod(type, e) {
  }
  render() {
    const p = this.props
    return (// p.loaded ?
      <div id="RatingPage">
        <h1>HELLO WORLD! <br/> THIS IS RATINGS PAGE</h1>
      </div>
    ) // : <Loading />
  }
}

/*RatingPage.propTypes = {
 parent: PropTypes.string.isRequired,
 loaded: PropTypes.bool.isRequired,
 revisions: PropTypes.array.isRequired,
 threads: PropTypes.array.isRequired,
 numberOfThreads: PropTypes.number.isRequired,
 numberOfRevisions: PropTypes.number.isRequired
}*/

export default createContainer(() => {
/*  Meteor.subscribe('skills', {slug: FlowRouter.getParam('skillSlug') })
  const skill = Skills.findOne(),
  parent = skill ? skill._id : '',
  revisionsReady = Meteor.subscribe('revisions',
        { parent },
        {
        sort: { createdAt: -1 },
        limit: perPage,
        skip: skipRevisions.get()
  }),
  threadsReady =  Meteor.subscribe('threads', {
        parent,
        type: "dev"
    }, {
        sort: { createdAt: -1 },
        limit: perPage,
        skip: skipThreads.get()
  })//.ready()
console.log(parent);
  return {
    revisions: Revisions.find({}).fetch(),
    threads: Threads.find({}).fetch(),
    numberOfThreads: Counts.get('numberOfThreads'),
    numberOfRevisions: Counts.get('numberOfRevisions'),
    loaded: true, //revisionsReady && threadsReady,
    parent
  }*/
  return {}
}, RatingPage)

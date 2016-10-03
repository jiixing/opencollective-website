import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import fetch from 'isomorphic-fetch';

import LoginTopBar from '../containers/LoginTopBar';
import Notification from '../containers/Notification';

import Input from '../components/CustomTextArea';
import PublicFooter from '../components/PublicFooter';
import Confirmation from '../components/Confirmation';

import appendGroupForm from '../actions/form/append_group';
import createGroup from '../actions/groups/create';
import notify from '../actions/notification/notify';
import validateSchema from '../actions/form/validate_schema';

import newGroupSchema from '../joi_schemas/newGroup';

export class NewGroup extends Component {

  constructor(props) {
    super(props);
    this.createRef = this.create.bind(this);
    this.state = {
      slugAvailable: true,
      showConfirmation: false
    };
  }

  render() {
    const {
      appendGroupForm,
      newGroupForm,
      pushState
    } = this.props;

    const {
      slugAvailable,
      showConfirmation
    } = this.state;

    const {
      tags, // we should store this in a new `type` column
      name,
      slug,
      mission,
      description,
      whyJoin, // we should rename that column to `needs`
      users
    } = newGroupForm.attributes;

    const groupTypes = new Map();
    groupTypes.set('meetup',{
      label: 'Meetup Group',
      placeholders: {
        name: 'Consciousness Hacking SF',
        slug: 'chsf',
        mission: 'We are on a mission to explore and develop new technologies for psychological, emotional and spiritual flourishing.',
        description: "Consciousness Hacking is an inside-out perspective on how technology can serve us by changing our relationship to the world, rather than the world itself. Meetings will feature insightful talks, community building, and support for new ideas and concepts. Consciousness Hacking​ is an ​open exploration of how science and technology can support radically modern approaches to spirituality and human flourishing.​ We do this through a global network of communities, events, digital media and projects.​",
        whyJoin: 'We need more people to join the community and attend our events. We are also looking for volunteers to help us organize our meetups.'
      }
    });
    groupTypes.set('opensource', {
      label: 'OpenSource Project',
      placeholders: {
        name: 'MochaJS',
        slug: 'mochajs',
        mission: 'We are on a mission to make asynchronous testing simple and fun.',
        description: 'Mocha is a feature-rich JavaScript test framework running on Node.js and the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases.',
        whyJoin: 'We are looking for maintainers to help us deal with the large number of issues and pull requests. We also welcome financial contributions.'
      }
    });
    groupTypes.set('pta', {
      label: 'Parent Teacher Association'
    });
    groupTypes.set('studentclub', {
      label: 'Student Club'
    });
    groupTypes.set('movement', {
      label: 'Movement'
    });
    groupTypes.set('association', {
      label: 'Association'
    });
    groupTypes.set('default', {
      label: 'Other',
      placeholders: {
        name: 'The Mindful Collective',
        slug: 'mindfulcollective',
        mission: 'We are on a mission to bring mindfulness to our city',
        description: 'Every week, we organize a public sitting in silence. We invite everyone to come meditate with us. We are also giving a meditation class to the public school in our city.',
        whyJoin: 'We are looking for public school teachers who could open the door of their classroom. We are also looking for financial help to cover our expenses (printing posters, transportation, ...)',
        email: 'sn.goenka@dharma.org'
      }
    });

    const getPlaceholder = (attr) => {
      const placeholders = groupTypes.get(tags || 'default').placeholders || {};
      return placeholders[attr] || groupTypes.get('default').placeholders[attr];
    };

    const groupTypeBtns = [];
    groupTypes.forEach((value, key) => {
      const selected = (key === tags) ? 'selected' : '';
      groupTypeBtns.push(<button className={`GroupTypeBtn ${selected}`} onClick={() => appendGroupForm({tags:key})}>{value.label}</button>);
    });

    if (tags === 'opensource')
      return pushState(null, '/opensource/apply');

    const showGroupTypes = (!showConfirmation);
    const showFormDetails = (tags && !showConfirmation);

    const validateSlug = (slug) => {
      fetch(`/api/profile/${slug}`)
        .then(response => {
          this.setState( { slugAvailable: !(response.status === 200) })
        })
        .catch();
    }

    return (
      <div>
        <Notification {...this.props} />
        <LoginTopBar />
        <div className='NewGroup'>
          <h1>Create a new collective</h1>
          {showGroupTypes &&
            <div className='NewGroup-PickType NewGroup-question'>
              <label>What is your collective for?</label>
              <div className='GroupTypeBtns'>
                { groupTypeBtns }
              </div>
            </div>
          }

          {showFormDetails &&
            <div className="NewGroup-details">
              <div className='NewGroup-question NewGroup-name'>
                <label>What is your collective name?</label>
                <Input
                  name='name'
                  value={name}
                  onChange={(value) => appendGroupForm({name: value})}
                  maxLength={128}
                  rows={1}
                  placeholder={getPlaceholder('name')}/>
              </div>

              <div className='NewGroup-question NewGroup-slug'>
                <label>What URL would you like to have?</label>
                <Input
                  name='slug'
                  prepend='https://opencollective.com/'
                  value={slug}
                  onChange={(value) => appendGroupForm({slug: value})}
                  onBlur={validateSlug}
                  maxLength={32}
                  rows={1}
                  placeholder={getPlaceholder('slug')}/>
                { !slugAvailable && <span className='validationError'>This URL is not available :-(</span>}
              </div>

              <div className='NewGroup-question NewGroup-mission'>
                <label>What is your collective's mission?</label>
                <Input
                  name='mission'
                  value={mission}
                  onChange={(value) => appendGroupForm({mission: value})}
                  maxLength={100}
                  rows={2}
                  placeholder={getPlaceholder('mission')}/>
              </div>

              <div className='NewGroup-question NewGroup-description'>
                <label>How are you going to do that? Why should people join?<br />
                Tell us more (you can always edit later)</label>
                <Input
                  name='description'
                  value={description}
                  onChange={(value) => appendGroupForm({description: value})}
                  maxLength={512}
                  rows={5}
                  placeholder={getPlaceholder('description')} />
              </div>

              <div className='NewGroup-question NewGroup-whyJoin'>
                <label>What do you need help with? How can people contribute to your mission?</label>
                <Input
                  name='whyJoin'
                  value={whyJoin}
                  onChange={(value) => appendGroupForm({whyJoin: value})}
                  maxLength={256}
                  rows={4}
                  placeholder={getPlaceholder('whyJoin')} />
              </div>

              <div className='NewGroup-question NewGroup-email'>
                <label>What is your personal email?</label>
                <Input
                  email='email'
                  value={users[0].email}
                  onChange={(value) => appendGroupForm({users: [{email: value, role: 'MEMBER'}]})}
                  maxLength={128}
                  rows={1}
                  placeholder={getPlaceholder('email')}/>
              </div>

            <center>
              <div className={`center AddGroup-Button ${slugAvailable ? '' : 'disabled'}`} onClick={ this.createRef }>create your collective</div>
            </center>
            </div>
          }

          {showConfirmation &&
            <Confirmation>
              <h1>Almost done!</h1>
              <p>To continue, click on the link that we sent you ({users[0].email}).</p>
            </Confirmation>
          }

        </div>
        <PublicFooter/>
      </div>
    );
  }

  create() {
    const { newGroupForm, validateSchema, createGroup, utmSource, notify } = this.props;
    const attr = newGroupForm.attributes;
    const group = {
      name: attr.name,
      slug: attr.slug,
      mission: attr.mission,
      description: attr.description,
      website: attr.website,
      whyJoin: attr.needs,
      data: {
        utmSource
      },
      tags: attr.tags && attr.tags.split(',').map(x => x.trim()),
      users: attr.users,
      isPublic: true
    };

    return validateSchema(group, newGroupSchema)
      .then(() => createGroup(group))
      .then(() => this.setState({showConfirmation: true}))
      .catch(({message}) => notify('error', message));
  }

}

export default connect(mapStateToProps, {
  appendGroupForm,
  pushState,
  notify,
  createGroup,
  validateSchema
})(NewGroup);

export function mapStateToProps({router, form}) {

  const query = router.location.query;
  const utmSource = query.utm_source;

  return {
    newGroupForm: form.addgroup,
    utmSource
  };
}
import React from 'react';

// Redux connect() to connect() to the redux store
import { connect } from 'react-redux';

// import actions to connect() to this component as an action creator
import { addPost } from '../actions/addPersonActions';

import FormAddPersonFields from './FormAddPersonFields';

class FormAddPerson extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.textarea = React.createRef();
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const date        = formData.get('post-date');
    const name        = (formData.get('person-name')) ? formData.get('person-name') : formData.get('person-name-existing');
    const looks       = formData.get('person-looks');
    const personality = formData.get('person-personality');
    const notes       = this.textarea.current.value;
    const gender      = formData.get('person-gender');
    const nonce       = formData.get('nonce');

    // dispatch addPost action
    this.props.addPost({
      'action'             : '_s_person_add_event',
      'post_date'          : date,
      'person_name'        : name,
      'person_looks'       : looks,
      'person_personality' : personality,
      'person_notes'       : notes,
      'person_gender'      : gender,
      'nonce'              : nonce
    });
  }

  render() {
    return (
      <form id="form-person-react" onSubmit={this.handleSubmit} method="POST">
        <FormAddPersonFields textarea={this.textarea} matrixType={this.props.matrixType} />
      </form>
    );
  }
}

const mapDispatchToProps = {
  addPost: addPost
};

export default connect(null, mapDispatchToProps)(FormAddPerson);

import React, { Component } from 'react';
import EditListButton from './edit_list';
import fetchAPI from '../lib/fetch';

/**
 * Editlistpage Button Component
 * @prop {string} listId
 * @prop {string} apiToken
 */

export default class EditlistpageButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: {},
    };
    this.listAPI = new fetchAPI('/v1/lists', props.apiToken);
  };

  async componentWillMount() {
    const list = await this.listAPI.get('/' + this.props.listId);
    this.setState({ list: list });
  }

  render() {
    const editButton = (<EditListButton list={this.state.list} apiToken={this.props.apiToken} />);

    return (
      <div style={{ textAlign: "right" }} >
        {editButton}
      </div>
    );
  }
};
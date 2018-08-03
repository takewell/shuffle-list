import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import fetchAPI from '../lib/fetch';

/**
 * Good Button Component
 * @prop {string} listId
 * @prop {number} goodCount
 * @prop {string} apiToken
 */

export default class GoodButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAlreadyGood: false,
      goodCount: 0,
    };
    this.goodAPI = new fetchAPI('/v1/my/goods', props.apiToken);
  };

  async componentWillMount() {
    const isGood = await this.goodAPI.get(`/${this.props.listId}`);
    if (isGood) {
      this.setState({ isAlreadyGood: true });
    }
    if (typeof this.props.goodCount === 'string') {
      this.setState({ goodCount: Number(this.props.goodCount) });
    } else {
      this.setState({ goodCount: this.props.goodCount });
    }
  }

  async handleClick() {
    if (this.state.isAlreadyGood) {
      await this.goodAPI.delete({ listId: this.props.listId });
      this.setState({ goodCount: this.state.goodCount - 1 });
    } else {
      await this.goodAPI.post({ listId: this.props.listId });
      this.setState({ goodCount: this.state.goodCount + 1 });
    }
    this.setState({ isAlreadyGood: !this.state.isAlreadyGood });
  }

  render() {
    const style = this.state.isAlreadyGood ? { color: "#ff2466" } : {};
    return (
      <a onClick={e => this.handleClick()}>
        <Icon name='thumbs up' style={style} />
        {this.state.goodCount === 0 ? 'いいね！' : this.state.goodCount}
      </a>
    );
  }
};

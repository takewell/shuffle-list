import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import fetchAPI from '../lib/fetch';

/**
 * Bookmark Button Component
 * @prop {string} listId
 * @prop {string} bookmarkCount
 * @prop {string} apiToken
 */

export default class BookmarkButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAlreadyBookmark: false,
      bookmarkCount: 0
    };
    this.bookmarkAPI = new fetchAPI('/v1/my/bookmarks', props.apiToken);
  }

  async componentWillMount() {
    const isBookmark = await this.bookmarkAPI.get(`/${this.props.listId}`);
    if (isBookmark) {
      this.setState({ isAlreadyBookmark: true });
    }
    if (typeof this.props.bookmarkCount === 'string') {
      this.setState({ bookmarkCount: Number(this.props.bookmarkCount) });
    } else {
      this.setState({ bookmarkCount: this.props.bookmarkCount });
    }
  }

  async handleClick() {
    if (this.state.isAlreadyBookmark) {
      await this.bookmarkAPI.delete({ listId: this.props.listId });
      this.setState({ bookmarkCount: this.state.bookmarkCount - 1 });
    } else {
      await this.bookmarkAPI.post({ listId: this.props.listId });
      this.setState({ bookmarkCount: this.state.bookmarkCount + 1 });
    }
    this.setState({ isAlreadyBookmark: !this.state.isAlreadyBookmark });
  }

  render() {
    const style = this.state.isAlreadyBookmark ? { color: '#ff2466' } : {};
    return (
      <a onClick={(e) => this.handleClick()}>
        <Icon name="bookmark" style={style} />
        {this.state.bookmarkCount === 0 ? 'ブックマーク' : this.state.bookmarkCount}
      </a>
    );
  }
}

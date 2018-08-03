import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import fetchAPI from '../lib/fetch';
/**
 * Home List Table Component
 * @prop {string} apiToken
 */

export default class HomeBookmarkTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
    };
    this.listAPI = new fetchAPI('/v1/my/bookmarks', props.apiToken);
  };

  async componentWillMount() {
    const bookmarkLists = await this.listAPI.get('/lists');
    this.setState({ lists: bookmarkLists });
  }

  render() {
    const items = this.state.lists.map((list, i) => {
      const icon = list.pictureSrc ?
        (<Image src={list.pictureSrc} />)
        :
        (<Image src='./images/maincolor.png' />);

      return (
        <Card href={'/' + list.user.userName + '/' + list.listId}>
          {icon}
          <Card.Content >
            <Card.Header style={{ fontSize: "80%" }}>{list.listName}</Card.Header>
          </Card.Content>
        </Card >
      );
    });

    if (this.state.lists.length === 0) {
      return (
        <div>
          <br />
          <h3>ブックマークしたリストはありません。</h3>
          <br />
        </div>
      );
    } else {
      return (
        <Card.Group itemsPerRow={3}>
          {items}
        </Card.Group >
      );
    }
  }
};
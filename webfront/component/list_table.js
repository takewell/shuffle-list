import React, { Component } from 'react';
import { Card, Image, Icon, List } from 'semantic-ui-react';
import moment from 'moment';
import GoodButton from './good_button';
import BookmarkButton from './bookmark_button';

/**
 * List Table Component
 * @prop {string} apiToken
 * @prop {string} lists
 */

export default class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
    };
  };

  async componentWillMount() {
    if (typeof this.props.lists === 'string') {
      this.setState({ lists: JSON.parse(this.props.lists) });
    }
  }

  render() {
    const items = this.state.lists.map((list, i) => {
      const formattedCreatedAt = moment(list.createdAt).format('YYYY/MM/DD HH:mm');
      const icon = list.pictureSrc ?
        (<Image src={list.pictureSrc} href={'/' + list.user.userName + '/' + list.listId} />)
        :
        (<Image src='./images/maincolor.png' href={'/' + list.user.userName + '/' + list.listId} />);

      const reactionMenu = (
        <Card.Content extra>
          <List horizontal>
            <List.Item>
              <GoodButton listId={list.listId} goodCount={list.liststatistic.goodCount} apiToken={this.props.apiToken} />
            </List.Item>
            <List.Item>
              <BookmarkButton listId={list.listId} bookmarkCount={list.liststatistic.bookmarkCount} apiToken={this.props.apiToken} />
            </List.Item>
            <List.Item >
              <a href={`https://twitter.com/intent/tweet?button_hashtag=shuffle_list&url=https://shuffle_list.com/${list.user.userName}/${list.listId}/&text=${list.listName} on @shufle_list&ref_src=twsrc%5Etfw`}>
                <Icon name='share' />
                共有
              </a>
            </List.Item>
          </List>
        </Card.Content >
      );
      return (
        <Card>
          <div className='ui content' >
            <div className='content'>
              <img className='ui avatar image' size='mini' src={`${list.user.photoSrc}`} />
              <a className='header' href={`/${list.user.userName}`} style={{ color: "black" }}>&nbsp;{list.user.displayName}</a>
            </div>
          </div>
          {icon}
          <Card.Content href={'/' + list.user.userName + '/' + list.listId}>
            <Card.Header>{list.listName}</Card.Header>
            <Card.Meta>
              <span className='date'>{formattedCreatedAt}</span>
            </Card.Meta>
            <Card.Description className="hiddenOverText">
              {list.description}
            </Card.Description>
          </Card.Content>
          {reactionMenu}
        </Card>
      );
    });

    return (
      <Card.Group centered>
        {items}
      </Card.Group >
    );
  }
};
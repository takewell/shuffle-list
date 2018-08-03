import React, { Component } from 'react';
import { Card, Image, List, Icon, } from 'semantic-ui-react';
import moment from 'moment';
import fetchAPI from '../lib/fetch';
import EditListButton from './edit_list';
import GoodButton from './good_button';
import BookmarkButton from './bookmark_button';

/**
 * List Table Component
 * @prop {string} reqUserId
 * @prop {string} apiToken
 * @prop {array} listListennerContainer
 */

export default class MyListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
    };
    this.listAPI = new fetchAPI('/v1/my/lists', props.apiToken);
    this.listListener = (list, eventName) => {
      if (eventName === 'listpost') {
        this.setState((preState, props) => {
          const newLists = preState.lists.map(e => e);
          newLists.push(list);
          return { lists: newLists };
        });
      } else if (eventName === 'listdelete') {
        this.setState((preState, props) => {
          const newLists = preState.lists.filter(e => e.listId !== list.listId);
          return { lists: newLists };
        });
      } else if (eventName === 'listedit') {
        this.setState((preState, props) => {
          // sort のことも考えないといけない。まあとりあえずはどいう順番でボードをソートするかは決めてないのであとで実装する、おそらく更新順にするかな
          const newLists = preState.lists.filter(e => e.listId !== list.listId);
          newLists.push(list);
          return { lists: newLists };
        });
      }
    };
    this.props.listListennerContainer.listeners.push(this.listListener);
  };

  async componentWillMount() {
    const lists = await this.listAPI.get();
    this.setState({ lists: lists });
  }

  render() {
    const items = this.state.lists.map((list, i) => {
      const formattedCreatedAt = moment(list.createdAt).format('YYYY/MM/DD HH:mm');
      const icon = list.pictureSrc ?
        (<Image src={list.pictureSrc} href={'/' + list.user.userName + '/' + list.listId} />)
        :
        (<Image src='./images/maincolor.png' href={'/' + list.user.userName + '/' + list.listId} />);

      const editButton = this.props.reqUserId == list.user.userId ? (
        <Card.Content extra>
          <EditListButton
            list={list}
            apiToken={this.props.apiToken}
            listListennerContainer={this.props.listListennerContainer}
          >編集
          </EditListButton>
        </Card.Content>
      )
        :
        (<div></div>);

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
          {editButton}
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
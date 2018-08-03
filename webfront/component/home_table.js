import React, { Component } from 'react';
import { Item, Image } from 'semantic-ui-react';
import fetchAPI from '../lib/fetch';
/**
 * Home List Table Component
 * @prop {string} apiToken
 * @prop {array} listListennerContainer
 */

export default class HomeTable extends Component {
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
    const items = this.state.lists.map((list) => {
      const icon = list.pictureSrc ?
        (<Item.Image size="tiny" src={list.pictureSrc} />)
        :
        (<Item.Image size="tiny" src='./images/maincolor.png' />);

      return (
        <Item href={'/' + list.user.userName + '/' + list.listId}>
          {icon}
          <Item.Content verticalAlign="middle">
            <h3 style={{ wordWrap: 'break-word' }}>{list.listName}</h3>
          </Item.Content>
        </Item>
      );
    });

    if (this.state.lists.length === 0) {
      return (
        <div>
          <br />
          <h3>作成したリストはありません。</h3>
          <br />
        </div>
      );
    } else {
      return (
        <Item.Group divided unstackable>
          {items}
        </Item.Group>
      );
    }
  }
};
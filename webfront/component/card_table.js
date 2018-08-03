import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import fetchAPI from '../lib/fetch';
import EditCardButton from './edit_card_button';
import ShuffleButton from './shuffle_button';

/**
 * Card Table Component
 * @prop {string} listId
 * @prop {string} apiToken
 * @prop {string} cardListennerContainer
 */

export default class CardTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
    this.fetchCards = new fetchAPI('/v1/my/cards', props.apiToken);
    this.cardListener = (element, eventName) => {
      if (eventName === 'cardsAdd') {
        this.setState((preState, props) => {
          const newCards = preState.cards.concat(element);
          return { cards: newCards };
        });
      } else if (eventName === 'cardDelete') {
        this.setState((preState, props) => {
          const newCards = preState.cards.filter((e) => e.cardId !== element.cardId);
          return { cards: newCards };
        });
      } else if (eventName === 'cardEdit') {
        this.setState((preState, props) => {
          // sort のことも考えないといけない。まあとりあえずはどいう順番でボードをソートするかは決めてないのであとで実装する、おそらく更新順にするかな
          const newCards = preState.cards.filter((e) => e.cardId !== element.cardId);
          newCards.push(element);
          return { cards: newCards };
        });
      }
    };
    this.props.cardListennerContainer.listeners.push(this.cardListener);
  }

  async componentWillMount() {
    const cards = await this.fetchCards.get('/' + this.props.listId);
    this.setState({ cards: cards });
  }

  render() {
    const items = this.state.cards.map((card) => {
      const header = card.href ? (
        <a href={card.href} target="_blank">
          <h3 style={{ wordWrap: 'break-word' }}>{card.content}</h3>
        </a>)
        :
        (<h3 style={{ wordWrap: 'break-word' }}>{card.content}</h3>
        );
      const icon = card.pictureSrc ?
        (<Item.Image size="tiny" src={card.pictureSrc} />)
        :
        (<Item.Image size="tiny" src="/images/card.png" />);

      return (
        <Item>
          {icon}
          <Item.Content verticalAlign="middle">
            {header}
          </Item.Content>
          <EditCardButton
            floated="right"
            cardId={card.cardId}
            content={card.content}
            href={card.href}
            listId={this.props.listId}
            apiToken={this.props.apiToken}
            cardListennerContainer={this.props.cardListennerContainer}
          />
        </Item>
      );
    });

    return (
      <div>
        <div className="ui center aligned segment basic">
          <ShuffleButton cards={this.state.cards} />
        </div>
        <Item.Group divided unstackable>
          {items}
        </Item.Group>
      </div >
    );
  }
}

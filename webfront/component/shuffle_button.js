import React, { Component } from 'react';
import { Button, Modal, Item, Icon } from 'semantic-ui-react';
import Slider from "react-slick";

/**
 * Shuffle Button Component
 * @prop {array} cards 
 */

export default class ShuffleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shuffledCards: [],
      modalOpen: false,
    };

  };

  componentWillMount() {
    if (typeof this.props.cards === 'string') {
      this.setState({ shuffledCards: JSON.parse(this.props.cards) });
    } else {
      // おそらく、こんなことにはならないエラーにしてもいいくらい
      this.setState({ shuffledCards: this.props.cards });
    }
  }

  componentDidMount() {
    const button = document.getElementById('shuffle-button');
    button.addEventListener('click', () => {
      this.openModal();
      this.shuffle();
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ shuffledCards: nextProps.cards });
  }

  shuffle() {
    const shuffled = this.fisher(this.state.shuffledCards.map(e => e));
    this.setState({ shuffledCards: shuffled });
  }

  fisher(arr) {
    var result = [];
    for (var len = arr.length; len > 0; len = 0 | len - 1) {
      var i = 0 | Math.random() * len;
      result.push(arr[i]);
      arr.splice(i, 1);
    }
    return result;
  }

  openModal() {
    this.setState({ modalOpen: true });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  render() {

    const item = this.state.shuffledCards.map(card => {
      const header = card.href ? (
        <a href={card.href} target="_blank">
          <h3 style={{ wordWrap: 'break-word' }}>{card.content}</h3>
        </a>)
        :
        (<h3 style={{ wordWrap: 'break-word' }}>{card.content}</h3>
        );
      const icon = card.pictureSrc ? (<Item.Image size='tiny' src={card.pictureSrc} />) : (<Item.Image size='tiny' src='/images/card.png' />);

      return (
        <Item.Group divided unstackable>
          <Item>
            {icon}
            <Item.Content verticalAlign='middle'>
              {header}
            </Item.Content>
          </Item>
        </Item.Group>
      );
    });


    function Arrow(props) {
      const { className, style, onClick } = props;
      return (
        <div
          className={className}
          style={{ ...style, display: "block", background: "#ff2466", borderRadius: "20%" }}
          onClick={onClick}
        >
        </div>
      );
    }

    const settings = {
      dots: false,
      infinite: true,
      speed: 250,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <Arrow />,
      prevArrow: <Arrow />
    };

    return (
      <Modal trigger={
        <Button id="shuffle-button" icon='shuffle' content='シャッフルする' size='huge' color='red' />
      } size='tiny' open={this.state.modalOpen} onClose={() => this.closeModal()}>
        <Modal.Content>
          <Slider {...settings}>
            {item}
          </Slider >
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={e => this.closeModal()} inverted >
            <Icon name='checkmark' /> これにする
          </Button>
        </Modal.Actions>
      </Modal >
    );
  }
};
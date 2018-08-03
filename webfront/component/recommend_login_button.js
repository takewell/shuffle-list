import React, { Component } from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';

/**
 * Recommend Login Button Component
 */

export default class RecommendLoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
  };

  openModal() {
    this.setState({ modalOpen: true });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  render() {

    const elem = (elementName) => {
      if (elementName === 'bellIcon') {
        return (<Icon name="bell outline" size="big" />);
      } else if (elementName === 'userIcon') {
        return (<Icon name="user outline" size="big" />);
      } else if (elementName === 'timelinePageLink') {
        return (<div>フォロー中</div>);
      }
    };

    return (
      <Modal
        trigger={
          <div onClick={() => this.openModal()}>
            {elem(this.props.elementName)}
          </div>
        } size='tiny' open={this.state.modalOpen} onClose={() => this.closeModal()}>
        <Modal.Content>
          <p style={{ margin: "1em" }}>
            この機能を利用するためにはログインが必要です。
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.closeModal()}>
            閉じる
          </Button>
          <Button inverted color='red' onClick={() => { window.location.href = '/auth/twitter'; }}>
            ログイン
          </Button>
        </Modal.Actions>
      </ Modal>
    );
  }
};
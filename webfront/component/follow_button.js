import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import fetchAPI from '../lib/fetch';

/**
 * Follow Button Component
 * @prop {string} targetUserId 
 * @prop {string} apiToken
 */

export default class FollowButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAlreadyFollow: false,
      buttonText: 'フォローする',
      modalOpen: false,
    };
    this.followAPI = new fetchAPI('/v1/my/follows', props.apiToken);
  };

  async componentWillMount() {
    const followUsers = await this.followAPI.get();
    followUsers.forEach(e => {
      if (e.followUserId === this.props.targetUserId) {
        this.setState({ isAlreadyFollow: true, buttonText: 'フォロー中' });
      }
    });
  }

  async handleClick() {
    if (this.state.isAlreadyFollow) {
      await this.followAPI.delete({ followUserId: this.props.targetUserId });
      this.setState({ buttonText: 'フォローする' });
    } else {
      await this.followAPI.post({ followUserId: this.props.targetUserId });
      this.setState({ buttonText: 'フォロー中' });
    }
    this.setState({ isAlreadyFollow: !this.state.isAlreadyFollow });
  }

  openModal() {
    this.setState({ modalOpen: true });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  render() {
    if (this.props.apiToken) {
      return (
        <Button toggle active={!this.state.isAlreadyFollow} onClick={() => this.handleClick()}>
          {this.state.buttonText}
        </Button>
      );
    } else {
      return (
        <Modal
          trigger={
            <Button primary onClick={e => this.openModal()}>
              {this.state.buttonText}
            </Button>
          } size='tiny' open={this.state.modalOpen} onClose={() => this.closeModal()}>
          <Modal.Content>
            <p>
              フォロー機能を利用するためにはログインが必要です。
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={e => this.closeModal()}>
              閉じる
            </Button>
            <Button color='green' onClick={() => { window.location.href = '/'; }}>
              ログインする
            </Button>
          </Modal.Actions>
        </ Modal>
      );
    }
  }
};
import React, { Component } from 'react';
import { Button, Modal, Form, Divider } from 'semantic-ui-react';
import fetchAPI from '../lib/fetch';

/**
 * Add Cards Button Component
 * @prop {string} listId
 * @prop {string} apiToken
 * @prop {array}  cardListennerContainer
 */

export default class AddCardsButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentType: 'text',
      content: '',
      modalOpen: false,
      loading: false,
    };
    this.fetchCards = new fetchAPI('/v1/my/cards', props.apiToken);
  };

  async addCards() {
    this.setLoading();
    const json = await this.fetchCards.post({
      listId: this.props.listId,
      contentType: this.state.contentType,
      content: this.state.content,
    });

    this.props.cardListennerContainer.listeners.forEach(listener => {
      listener(json.cards, 'cardsAdd');
    });

    this.closeModal();
    this.resetForm();
    this.clearLoading();
  }

  resetForm() {
    this.setState({
      content: '',
    });
  }

  changeContenet(e) {
    this.setState({ content: e.target.value });
  }

  openModal() {
    this.setState({ modalOpen: true });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  setLoading() {
    this.setState({ loading: true });
  }

  clearLoading() {
    this.setState({ loading: false });
  }

  render() {
    return (
      <Modal trigger={
        <Button icon='plus square outline' content='カードを追加する' size='big' onClick={() => this.openModal()} />
      } size='tiny' open={this.state.modalOpen} onClose={() => this.closeModal()}>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>カードリスト</label>
              <p>改行ごとにカードが分かれます。<br />
                [タイトル](URL) でリンク付きカードにすることが可能です。 </p>
              <Form.TextArea name='content' style={{ height: "15em" }} value={this.state.content} onChange={e => this.changeContenet(e)} />
            </Form.Field>
            <Divider />
            <Form.Group style={{ float: "right" }}>
              <Form.Field style={{ marginBottom: "15px" }}>
                <Button primary onClick={async () => await this.addCards()}>
                  追加
                </Button>
                <Button onClick={() => this.closeModal()}>
                  キャンセル
                </Button>
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content >
      </Modal>
    );
  }
};
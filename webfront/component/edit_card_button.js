import React, { Component } from 'react';
import { Button, Modal, Icon, Form, Radio, Divider } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import fetchAPI from '../lib/fetch';

/**
 * Edit Card Button Component
 * @prop {string} cardId
 * @prop {string} content
 * @prop {string} href
 * @prop {string} listId
 * @prop {string} apiToken
 * @prop {array}  cardListennerContainer
 */

export default class EditCardButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardId: this.props.cardId,
      content: this.props.content,
      picture: null,
      href: this.props.href,
      modalOpen: false,
      loading: false,
      blobPictureUrl: null,
    };
    this.fetchCards = new fetchAPI('/v1/my/cards', props.apiToken);
  };

  async editCard() {
    this.setLoading();
    let form = new FormData();
    form.append('listId', this.props.listId);
    form.append('cardId', this.state.cardId);
    form.append('content', this.state.content);
    form.append('picture', this.state.picture);
    form.append('href', this.state.href);

    const json = await this.fetchCards.putForm(form);

    this.props.cardListennerContainer.listeners.forEach(listener => {
      listener(json.card, 'cardEdit');
    });

    this.closeModal();
    this.clearLoading();
  }

  async deleteCard() {
    const json = await this.fetchCards.delete({
      listId: this.props.listId,
      cardId: this.props.cardId
    });

    this.props.cardListennerContainer.listeners.forEach(listener => {
      listener(json.card, 'cardDelete');
    });

    this.setState({ modalOpen: false });
  }

  changeContent(e) {
    this.setState({ content: e.target.value });
  }

  changeHref(e) {
    this.setState({ href: e.target.value });
  }

  changePicture(e) {
    this.setState({ picture: e.target.files[0] });
    const blobUrl = window.URL.createObjectURL(e.target.files[0]);
    this.setState({ blobPictureUrl: blobUrl });
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
    const Image = this.state.blobPictureUrl ? <img src={this.state.blobPictureUrl} alt="" style={{ height: "33px", paddingRight: "5px" }} /> : <Icon name="file image outline" size='big' ></Icon>;
    return (
      <Modal trigger={
        <Icon name='ellipsis horizontal' link onClick={e => this.openModal()} />
      } size='tiny' open={this.state.modalOpen} onClose={e => this.closeModal()}>
        <Modal.Content>
          <Form loading={this.state.loading}>
            <Form.TextArea value={this.state.content} onChange={e => this.changeContent(e)} />
            <Form.Input name='href' label="リンク" value={this.state.href} onChange={e => this.changeHref(e)} />
            <Dropzone type="file" name='picture' accept="image/*" style={{ width: "100%", height: "100px", borderWidth: "2px", borderColor: "rgb(102, 102, 102)", borderStyle: "dashed", borderRadius: "5px" }} onChange={e => this.changePicture(e)} >
              <div style={{ margin: "0 auto", textAlign: "center", marginTop: "2em" }}>
                {Image}
                <br />
                画像をアップロード
                </div>
            </Dropzone>
            <Divider />
            <Form.Group >
              <Form.Field>
                <Button onClick={() => this.deleteCard()}>
                  削除
                </Button>
              </Form.Field>
              <Form.Field>
                <Button onClick={() => this.editCard()}>
                  決定
                </Button>
                <Button onClick={() => this.closeModal()}>
                  キャンセル
                </Button>
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
      </ Modal>
    );
  }
};
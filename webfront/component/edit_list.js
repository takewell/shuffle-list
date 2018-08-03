import React, { Component } from 'react';
import { Button, Modal, Icon, Form, Radio, Divider } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import fetchAPI from '../lib/fetch';

/**
 * Edit List Button Component
 * @prop {json} list
 * @prop {string} apiToken
 * allownull
 * @prop {array}  listListennerContainer 
 */

export default class EditListButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listId: this.props.list.listId,
      listName: this.props.list.listName,
      description: this.props.list.description,
      isSecret: this.props.list.isSecret,
      picture: null,
      modalOpen: false,
      loading: false,
      blobPictureUrl: null,
    };
    this.fetchLists = new fetchAPI('/v1/my/lists', props.apiToken);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      listId: nextProps.list.listId,
      listName: nextProps.list.listName,
      description: nextProps.list.description,
      isSecret: nextProps.list.isSecret,
    });
  }

  async editList() {
    this.setState({ loading: true });

    let form = new FormData();
    form.append('listId', this.state.listId);
    form.append('listName', this.state.listName);
    form.append('description', this.state.description);
    form.append('picture', this.state.picture);
    form.append('isSecret', this.state.isSecret);

    const json = await this.fetchLists.putForm(form);

    if (this.props.listListennerContainer) {
      this.props.listListennerContainer.listeners.forEach(listener => {
        listener(json.list, 'listedit');
      });
      this.closeModal();
    } else {
      this.closeModal();
      // 愚かなことをしているのは自分でもわかっている。
      setTimeout(() => {
        location.reload();
      }, 15 * 1 / 10 * 1000);
    }
  }

  async deleteList() {
    const json = await this.fetchLists.delete({ listId: this.state.listId });

    if (this.props.listListennerContainer) {
      this.props.listListennerContainer.listeners.forEach(listener => {
        listener(json.list, 'listdelete');
      });
    } else {
      // ドメイン直下にしたい。
      location.href = '/';
    }

    this.closeModal();
  }

  changeListName(e) {
    this.setState({ listName: e.target.value });
  }

  changeDescription(e) {
    this.setState({ description: e.target.value });
  }

  changePicture(e) {
    this.setState({ picture: e.target.files[0] });
    const blobUrl = window.URL.createObjectURL(e.target.files[0]);
    this.setState({ blobPictureUrl: blobUrl });
  }

  handleSecret() {
    this.setState({ isSecret: !this.state.isSecret, isChecked: !this.state.isChecked });
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
        <Icon name='pencil alternate' link onClick={e => this.openModal()} />
      } size='large' open={this.state.modalOpen} onClose={e => this.closeModal()}>
        <Modal.Content>
          <Form loading={this.state.loading}>
            <Form.Input name='listName' label="リスト名" value={this.state.listName} onChange={e => this.changeListName(e)} />
            <Form.TextArea name='description' label="説明" value={this.state.description} onChange={e => this.changeDescription(e)} style={{ height: "10em" }} />
            <Form.Field>
              <label>非公開にする</label>
              <Radio toggle name="isSecret" value={this.state.isSecret} checked={this.state.isSecret} onClick={() => this.handleSecret()} />
            </Form.Field>
            <Form.Field>
              <label>画像</label>
              <Dropzone type="file" name='picture' accept="image/*" style={{ width: "100%", height: "100px", borderWidth: "2px", borderColor: "rgb(102, 102, 102)", borderStyle: "dashed", borderRadius: "5px" }} onChange={e => this.changePicture(e)} >
                <div style={{ margin: "0 auto", textAlign: "center", marginTop: "2em" }}>
                  {Image}
                  <br />
                  画像をアップロード
                </div>
              </Dropzone>
            </Form.Field>
            <Divider />
            <Form.Group style={{ float: "left" }} >
              <Form.Field >
                <Button onClick={() => this.deleteList()}>
                  削除
                </Button>
              </Form.Field>
            </Form.Group>
            <Form.Group style={{ float: "right" }}>
              <Form.Field>
              </Form.Field>
              <Form.Field>
                <Button primary onClick={() => this.editList()} style={{ marginBottom: "15px" }}>
                  決定
                </Button>
                <Button onClick={() => this.closeModal()}>
                  キャンセル
                </Button>
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
      </ Modal >
    );
  }
};


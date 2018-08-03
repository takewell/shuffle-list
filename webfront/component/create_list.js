import React, { Component } from 'react';
import { Button, Modal, Form, Radio, Divider, Icon } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import fetchAPI from '../lib/fetch';

/**
 * Create List Component
 * @prop {string} apiToken
 * @prop {array} listListennerContainer
 */

export default class CreateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listName: '',
      description: '',
      picture: null,
      isSecret: false,
      modalOpen: false,
      loading: false,
      blobPictureUrl: null,
    };
    this.fetchLists = new fetchAPI('v1/my/lists', props.apiToken);
  };

  async createList() {
    this.setLoading();
    let form = new FormData();
    form.append('listName', this.state.listName);
    form.append('description', this.state.description);
    form.append('picture', this.state.picture);
    form.append('isSecret', this.state.isSecret);

    const json = await this.fetchLists.postForm(form);

    this.props.listListennerContainer.listeners.forEach(listener => {
      listener(json.list, 'listpost');
    });
    this.closeModal();
    this.resetForm();
    this.clearLoading();
  }

  resetForm() {
    this.setState({
      listName: '',
      description: '',
      picture: null,
      isSecret: false,
      blobPictureUrl: null,
    });
  }

  changeListName(e) {
    this.setState({ listName: e.target.value });
  }

  handleSecret() {
    this.setState({ isSecret: !this.state.isSecret });
  }

  changeDescription(e) {
    this.setState({ description: e.target.value });
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
        <Button icon='plus square outline' content='シャッフルリストを作成' size='big' onClick={() => this.openModal()}>
        </Button>
      } size='tiny' open={this.state.modalOpen} onClose={() => this.closeModal()} >
        <Modal.Content>
          <Form loading={this.state.loading}>
            <Form.Field>
              <label>ボード名</label>
              <input id="listname-input" type="text" name='listName' value={this.state.listName} onChange={e => this.changeListName(e)} />
            </Form.Field>
            <Form.TextArea name='description' label="説明" style={{ height: "10em" }} value={this.state.description} onChange={e => this.changeDescription(e)} />
            <Form.Field>
              <label>非公開にする</label>
              <Radio toggle name="isSecret" value={this.state.isSecret} onClick={() => this.handleSecret()} />
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
            <Form.Group style={{ float: "right" }}>
              <Form.Field style={{ marginBottom: "15px" }}>
                <Button id="create-list-button" primary onClick={() => this.createList()}>
                  作成
                </Button>
                <Button onClick={() => this.closeModal()}>
                  キャンセル
                </Button>
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
};
import React from 'react';
import { render } from 'react-dom';
import FollowButton from './component/follow_button';
import CreateListButton from './component/create_list';
import MyListTable from './component/my_list_table';
import AddCardsButton from './component/add_cards_button';
import CardTable from './component/card_table';
import HomeTable from './component/home_table';
import HomeBookmarkTable from './component/home_bookmark_table';
import ListTable from './component/list_table';
import EditlistpageButton from './component/editlistpage_button';
import ShuffleButton from './component/shuffle_button';
import GoodButton from './component/good_button';
import BookmarkButton from './component/bookmark_button';
import RecommendLoginButton from './component/recommend_login_button';

// /:username
const followButtonDivided = document.getElementById('follow-button-container');
if (followButtonDivided) {
  render(
    <FollowButton
      targetUserId={followButtonDivided.dataset.userId}
      apiToken={followButtonDivided.dataset.apiToken}
    />,
    followButtonDivided
  );
}

const followButtonDividedClass = document.getElementsByClassName('follow-button-container');
if (followButtonDividedClass) {
  for (let i = 0; i < followButtonDividedClass.length; i++) {
    const e = followButtonDividedClass[i];
    render(
      <FollowButton
        targetUserId={e.dataset.userId}
        apiToken={e.dataset.apiToken}
      />,
      e
    );
  }
}

/**
* リストに変更された際に通知するリスナーリスト @type {object}
* @param {array} lists
* @param {event} eventName
*/
let listListennerContainer = {
  listeners: []
};

// /root
const homeTableDivided = document.getElementById('home-table-container');
if (homeTableDivided) {
  render(
    <HomeTable
      apiToken={homeTableDivided.dataset.apiToken}
      listListennerContainer={listListennerContainer}
    />,
    homeTableDivided
  );
}

const homeBookmarkTableDivided = document.getElementById('home-bookmark-table-container');
if (homeBookmarkTableDivided) {
  render(
    <HomeBookmarkTable
      apiToken={homeBookmarkTableDivided.dataset.apiToken}
    />,
    homeBookmarkTableDivided
  );
}

const listTableDivided = document.getElementById('list-table-container');
if (listTableDivided) {
  render(
    <ListTable
      apiToken={listTableDivided.dataset.apiToken}
      lists={listTableDivided.dataset.lists}
    />,
    listTableDivided
  );
}

const myListTableDivided = document.getElementById('my-list-table-container');
if (myListTableDivided) {
  render(
    <MyListTable
      reqUserId={myListTableDivided.dataset.reqUserId}
      apiToken={myListTableDivided.dataset.apiToken}
      listListennerContainer={listListennerContainer}
    />,
    myListTableDivided
  );
}

const createListButtonDivided = document.getElementById('createlist-button-container');
if (createListButtonDivided) {
  render(
    <CreateListButton
      apiToken={createListButtonDivided.dataset.apiToken}
      listListennerContainer={listListennerContainer}
    />,
    createListButtonDivided
  );
}

/**
* カードに変更があった際に通知するリスナーリスト @type {object}
* @param {array} element
* @param {event} eventName
*/
let cardListennerContainer = {
  listeners: []
};

const cardTableDivided = document.getElementById('card-table-container');
if (cardTableDivided) {
  render(
    <CardTable
      cardListennerContainer={cardListennerContainer}
      apiToken={cardTableDivided.dataset.apiToken}
      listId={cardTableDivided.dataset.listId}
    />,
    cardTableDivided
  );
}

const addCardsButtonDivided = document.getElementById('addcard-button-container');
if (addCardsButtonDivided) {
  render(
    <AddCardsButton
      listId={addCardsButtonDivided.dataset.listId}
      apiToken={addCardsButtonDivided.dataset.apiToken}
      cardListennerContainer={cardListennerContainer}
    />,
    addCardsButtonDivided
  );
}


const editlistpageButtonDivided = document.getElementById('editlistpage-button-container');
if (editlistpageButtonDivided) {
  render(
    <EditlistpageButton
      listId={editlistpageButtonDivided.dataset.listId}
      apiToken={editlistpageButtonDivided.dataset.apiToken}
    />,
    editlistpageButtonDivided
  );
}

const goodlistpageButtonDivided = document.getElementById('goodlistpage-button-container');
if (goodlistpageButtonDivided) {
  render(
    <GoodButton
      listId={goodlistpageButtonDivided.dataset.listId}
      goodCount={goodlistpageButtonDivided.dataset.goodCount}
      apiToken={goodlistpageButtonDivided.dataset.apiToken}
    />,
    goodlistpageButtonDivided
  );
}

const bookmarklistpageButtonDivided = document.getElementById('bookmarklistpage-button-container');
if (bookmarklistpageButtonDivided) {
  render(
    <BookmarkButton
      listId={bookmarklistpageButtonDivided.dataset.listId}
      bookmarkCount={bookmarklistpageButtonDivided.dataset.bookmarkCount}
      apiToken={bookmarklistpageButtonDivided.dataset.apiToken}
    />,
    bookmarklistpageButtonDivided
  );
}

const shuffleButtonContainerDivied = document.getElementById('shuffle-button-container');
if (shuffleButtonContainerDivied) {
  render(
    <ShuffleButton
      cards={shuffleButtonContainerDivied.dataset.cards}
    />,
    shuffleButtonContainerDivied
  );
}

const recommendLoginButtonContainerDivied = document.getElementsByClassName('recommend-login-button-container');
if (recommendLoginButtonContainerDivied) {
  for (let i = 0; i < recommendLoginButtonContainerDivied.length; i++) {
    const e = recommendLoginButtonContainerDivied[i];
    render(
      <RecommendLoginButton
        elementName={e.dataset.elementName}
      />,
      e
    );
  }
}
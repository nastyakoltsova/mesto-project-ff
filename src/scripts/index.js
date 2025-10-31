import '../pages/index.css';
import { createCard, deleteCard, likeCard } from './card';
import { openModal, closeModal, setupOverlayClose } from './modal';
import { initialCards } from './cards.js';

import logo from '../images/logo.svg';
import avatar from '../images/avatar.jpg';

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const editModal = document.querySelector('.popup_type_edit');
const addCardModal = document.querySelector('.popup_type_new-card');
const imageModal = document.querySelector('.popup_type_image');
const closeButtons = document.querySelectorAll('.popup__close');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const placesList = document.querySelector('.places__list');
const popupImage = imageModal.querySelector('.popup__image');
const popupCaption = imageModal.querySelector('.popup__caption');

const editForm = editModal.querySelector('.popup__form');
const addCardForm = addCardModal.querySelector('.popup__form');
const nameInput = editModal.querySelector('.popup__input_type_name');
const jobInput = editModal.querySelector('.popup__input_type_description');
const cardNameInput = addCardModal.querySelector('.popup__input_type_card-name');
const cardLinkInput = addCardModal.querySelector('.popup__input_type_url');

function setImages() {
  const logoElement = document.querySelector('.header__logo');
  const avatarElement = document.querySelector('.profile__image');

  if (logoElement) logoElement.src = logo;
  if (avatarElement) avatarElement.style.backgroundImage = `url(${avatar})`;
}

function handleImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imageModal);
}

function handleEditProfileClick() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editModal);
}

function handleAddCardClick() {
  addCardForm.reset();
  openModal(addCardModal);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editModal);
}

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };

  const newCard = createCard(newCardData, handleImageClick, deleteCard, likeCard);
  placesList.prepend(newCard);

  addCardForm.reset();
  closeModal(addCardModal);
}

function setupCloseButtons() {
  closeButtons.forEach(button => {
    const modal = button.closest('.popup');
    button.addEventListener('click', () => closeModal(modal));
  });
}

function init() {
  setImages();
  setupCloseButtons();

  setupOverlayClose(editModal);
  setupOverlayClose(addCardModal);
  setupOverlayClose(imageModal);

  profileEditButton.addEventListener('click', handleEditProfileClick);
  profileAddButton.addEventListener('click', handleAddCardClick);

  editForm.addEventListener('submit', handleEditFormSubmit);
  addCardForm.addEventListener('submit', handleAddCardFormSubmit);

  initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, handleImageClick, deleteCard, likeCard);
    placesList.append(cardElement);
  });
}

document.addEventListener('DOMContentLoaded', init);
import '../pages/index.css';
import { createCard, deleteCardElement, toggleLike } from './card.js';
import { openModal, closeModal, setupOverlayClose } from './modal.js';
import {
  getUserInfo,
  getInitialCards,
  editProfile,
  addNewCard,
  deleteCard,
  addLike,
  removeLike,
  updateAvatar
} from './api.js';
import {clearValidation, enableValidation} from "./validation.js";

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileAvatarEdit = document.querySelector('.profile__edit-avatar');
const editModal = document.querySelector('.popup_type_edit');
const addCardModal = document.querySelector('.popup_type_new-card');
const imageModal = document.querySelector('.popup_type_image');
const avatarModal = document.querySelector('.popup_type_avatar');
const closeButtons = document.querySelectorAll('.popup__close');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const placesList = document.querySelector('.places__list');
const popupImage = imageModal.querySelector('.popup__image');
const popupCaption = imageModal.querySelector('.popup__caption');

const editForm = editModal.querySelector('.popup__form');
const addCardForm = addCardModal.querySelector('.popup__form');
const avatarForm = avatarModal.querySelector('.popup__form');
const nameInput = editModal.querySelector('.popup__input_type_name');
const jobInput = editModal.querySelector('.popup__input_type_description');
const cardNameInput = addCardModal.querySelector('.popup__input_type_card-name');
const cardLinkInput = addCardModal.querySelector('.popup__input_type_url');
const avatarUrlInput = avatarModal.querySelector('.popup__input_type_avatar-url');

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

let currentUserId = '';

function handleImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imageModal);
}

function handleEditProfileClick() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editForm, validationConfig);
  openModal(editModal);
}

function handleAvatarEditClick() {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarModal);
}

function handleAddCardClick() {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(addCardModal);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  if (!editForm.checkValidity()) {
    return;
  }

  const submitButton = editForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  submitButton.textContent = 'Сохранение...';

  editProfile(nameInput.value, jobInput.value)
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(editModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  if (!avatarForm.checkValidity()) {
    return;
  }

  const submitButton = avatarForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  submitButton.textContent = 'Сохранение...';

  updateAvatar(avatarUrlInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();

  if (!addCardForm.checkValidity()) {
    return;
  }

  const submitButton = addCardForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  submitButton.textContent = 'Создание...';

  addNewCard(cardNameInput.value, cardLinkInput.value)
    .then((newCard) => {
      const cardElement = createCard(newCard, currentUserId, handleImageClick, handleDeleteCard, handleLikeCard);
      placesList.prepend(cardElement);
      addCardForm.reset();
      closeModal(addCardModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleDeleteCard(cardId, cardElement) {
  deleteCard(cardId)
    .then(() => {
      deleteCardElement(cardElement);
    })
    .catch((err) => {
      console.log(err);
    });
}

function handleLikeCard(cardId, likeButton, likeCount) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  const likePromise = isLiked ? removeLike(cardId) : addLike(cardId);

  likePromise
    .then((updatedCard) => {
      toggleLike(likeButton, likeCount, updatedCard);
    })
    .catch((err) => {
      console.log(err);
    });
}

function setupCloseButtons() {
  closeButtons.forEach(button => {
    const modal = button.closest('.popup');
    button.addEventListener('click', () => closeModal(modal));
  });
}

function loadInitialData() {
  Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      currentUserId = userData._id;
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

      cards.forEach(cardData => {
        const cardElement = createCard(cardData, currentUserId, handleImageClick, handleDeleteCard, handleLikeCard);
        placesList.append(cardElement);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function init() {
  enableValidation(validationConfig);

  setupCloseButtons();

  setupOverlayClose(editModal);
  setupOverlayClose(addCardModal);
  setupOverlayClose(imageModal);
  setupOverlayClose(avatarModal);

  profileEditButton.addEventListener('click', handleEditProfileClick);
  profileAddButton.addEventListener('click', handleAddCardClick);
  profileAvatarEdit.addEventListener('click', handleAvatarEditClick);

  editForm.addEventListener('submit', handleEditFormSubmit);
  addCardForm.addEventListener('submit', handleAddCardFormSubmit);
  avatarForm.addEventListener('submit', handleAvatarFormSubmit);

  loadInitialData();
}

document.addEventListener('DOMContentLoaded', init);
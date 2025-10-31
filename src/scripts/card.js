export function createCard(cardData, handleImageClick, handleDeleteCard, handleLikeCard) {
  const cardTemplate = document.querySelector("#card-template").content.querySelector(".places__item");
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardImage.addEventListener('click', () => handleImageClick(cardData));
  deleteButton.addEventListener('click', handleDeleteCard);
  likeButton.addEventListener('click', handleLikeCard);

  return cardElement;
}

export function deleteCard(evt) {
  evt.target.closest('.card').remove();
}

export function likeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}
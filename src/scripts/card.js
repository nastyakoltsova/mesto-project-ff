export function createCard(cardData, currentUserId, handleImageClick, handleDeleteCard, handleLikeCard) {
  const cardTemplate = document.querySelector("#card-template").content.querySelector(".places__item");
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  if (cardData.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  }

  const isLiked = cardData.likes.some(like => like === currentUserId || like._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  cardImage.addEventListener('click', () => handleImageClick(cardData));
  deleteButton.addEventListener('click', () => handleDeleteCard(cardData._id, cardElement));
  likeButton.addEventListener('click', () => handleLikeCard(cardData._id, likeButton, likeCount));

  return cardElement;
}

export function deleteCardElement(cardElement) {
  cardElement.remove();
}

export function toggleLike(likeButton, likeCount, updatedCard) {
  likeButton.classList.toggle('card__like-button_is-active');
  likeCount.textContent = updatedCard.likes.length;
}
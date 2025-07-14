import React from "react";

const ReviewCard = ({ review }) => {
  const { user, review: text, rating } = review;
  const { photo, name } = user || {};

  return (
    <div className="reviews__card">
      <div className="reviews__avatar">
        <img
          className="reviews__avatar-img"
          src={`/img/users/${photo || "default.jpg"}`}
          alt={name || "User"}
        />
        <h6 className="reviews__user">{name}</h6>
      </div>

      <p className="reviews__text">{text}</p>

      <div className="reviews__rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= rating;
          return (
            <svg
              key={star}
              className={`reviews__star reviews__star--${
                isActive ? "active" : "inactive"
              }`}
            >
              <use xlinkHref="/img/icons.svg#icon-star" />
            </svg>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewCard;

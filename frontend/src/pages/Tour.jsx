import { Link, useParams } from "react-router-dom";
import { useNatours } from "../context/ToursContext";
import OverviewBox from "../components/OverviewBox";
import Map from "../components/Map";
import { useEffect, useState } from "react";
import { handleBookTour } from "../utils/stripeBookTour";

function Tour() {
  const { slug } = useParams();
  const { tours, user, reviews } = useNatours();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    if (!slug || !tours.length || !reviews.length) return;

    const foundTour = tours.find((t) => t.slug === slug);
    if (!foundTour) return;

    const relatedReviews = reviews.filter((r) => r.tour === foundTour.id);
    setTour({ ...foundTour, reviews: relatedReviews });
  }, [tours, reviews, slug]);

  if (!tour) return <p>Loading tour data...</p>;

  const date = new Date(tour.startDates[0]).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const paragraphs = tour.description.split("\n");

  const ReviewCard = ({ review }) => {
    return (
      <div className="reviews__card" key={review.id || review._id}>
        <div className="reviews__avatar">
          <img
            className="reviews__avatar-img"
            src={`/img/users/${review.user.photo}`}
            alt={review.user.name}
          />
          <h6 className="reviews__user">{review.user.name}</h6>
        </div>
        <p className="reviews__text">{review.review}</p>
        <div className="reviews__rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`reviews__star reviews__star--${
                star <= review.rating ? "active" : "inactive"
              }`}
            >
              <use xlinkHref="/img/icons.svg#icon-star" />
            </svg>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            className="header__hero-img"
            src={`/img/tours/${tour.imageCover}`}
            alt={tour.name}
          />
        </div>
        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{`${tour.name} tour`}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-clock" />
              </svg>
              <span className="heading-box__text">{`${tour.duration} days`}</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-map-pin" />
              </svg>
              <span className="heading-box__text">
                {tour.startLocation.description}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <OverviewBox label="Next date" text={date} icon="calendar" />
              <OverviewBox
                label="Difficulty"
                text={tour.difficulty}
                icon="trending-up"
              />
              <OverviewBox
                label="Participants"
                text={`${tour.maxGroupSize} people`}
                icon="user"
              />
              <OverviewBox
                label="Rating"
                text={`${tour.ratingsAverage} / 5`}
                icon="star"
              />
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {tour.guides.map((guide) => (
                <div
                  className="overview-box__detail"
                  key={guide.id || guide.name}
                >
                  <img
                    className="overview-box__img"
                    src={`/img/users/${guide.photo}`}
                    alt={`${guide.name} photo`}
                  />
                  <span className="overview-box__label">
                    {guide.role.includes("lead") ? "Lead guide" : "Tour guide"}
                  </span>
                  <span className="overview-box__text">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">{`About ${tour.name.toLowerCase()} tour`}</h2>
          {paragraphs.map((text, i) => (
            <p className="description__text" key={i}>
              {text}
            </p>
          ))}
        </div>
      </section>

      <section className="section-pictures">
        {tour.images.map((img, idx) => (
          <div className="picture-box" key={idx}>
            <img
              className={`picture-box__img picture-box__img--${idx + 1}`}
              src={`/img/tours/${img}`}
              alt={`${tour.name} ${idx + 1}`}
            />
          </div>
        ))}
      </section>

      <section className="section-map">
        {Array.isArray(tour.locations) && tour.locations.length > 0 && (
          <Map locations={tour.locations} />
        )}
      </section>

      <section className="section-reviews">
        <div className="reviews">
          {tour.reviews.map((review) => (
            <ReviewCard key={review._id || review.id} review={review} />
          ))}
        </div>
      </section>

      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src="/img/logo-white.png" alt="Natours logo" />
          </div>
          <img
            className="cta__img cta__img--1"
            src={`/img/tours/${tour.images[1]}`}
            alt="Tour"
          />
          <img
            className="cta__img cta__img--2"
            src={`/img/tours/${tour.images[2]}`}
            alt="Tour"
          />
          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">{`${tour.duration} days. 1 adventure. Infinite memories.`}</p>
            {user ? (
              <button
                className="btn btn--green span-all-rows"
                onClick={() => handleBookTour(tour._id)}
              >
                Book tour now!
              </button>
            ) : (
              <Link className="btn btn--green span-all-rows" to="/login">
                Log in to book tour!
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Tour;

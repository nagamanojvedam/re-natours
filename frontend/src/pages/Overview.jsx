import { Link } from "react-router-dom";
import { useNatours } from "../context/ToursContext";

function Overview() {
  const { tours } = useNatours();

  if (tours?.length === 0 || !tours) return <p>No tours at this moment.</p>;

  return (
    <main className="main">
      <div className="card-container">
        {tours.map((tour) => (
          <div className="card" key={tour.id || tour._id}>
            <div className="card__header">
              <div className="card__picture">
                <div className="card__picture-overlay">&nbsp;</div>
                <img
                  className="card__picture-img"
                  src={`img/tours/${tour.imageCover}`}
                  alt={tour.name || "Tour"}
                />
              </div>
              <h3 className="heading-tertirary">
                <span>{tour.name}</span>
              </h3>
            </div>

            <div className="card__details">
              <h4 className="card__sub-heading">
                {`${tour.difficulty} ${tour.duration}-day tour`}
              </h4>
              <p className="card__text">{tour.summary}</p>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-map-pin" />
                </svg>
                <span>{tour.startLocation.description}</span>
              </div>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-calendar" />
                </svg>
                <span>
                  {new Date(tour.startDates?.[0] || "").toLocaleString(
                    "en-US",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-flag" />
                </svg>
                <span>{`${tour.locations.length} stops`}</span>
              </div>

              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-user" />
                </svg>
                <span>{tour.maxGroupSize}</span>
              </div>
            </div>

            <div className="card__footer">
              <p>
                <span className="card__footer-value">${tour.price}</span>{" "}
                <span className="card__footer-text">per person</span>
              </p>
              <p className="card__ratingsz">
                <span className="card__footer-value">
                  {tour.ratingsAverage}
                </span>{" "}
                <span className="card__footer-text">
                  rating ({tour.ratingsQuantity})
                </span>
              </p>
              <Link
                to={`/tour/${tour.slug}`}
                className="btn btn--green btn--small"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Overview;

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useNatours } from "../context/ToursContext";
import { useEffect } from "react";
import { toast } from "react-toastify";

function Overview() {
  const { tours } = useNatours();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success("Booking successful!");
      navigate("/", { replace: true });
    }
    if (status === "cancelled") {
      toast.error("Booking cancelled!");
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  if (!tours || tours.length === 0) return <p>No tours at this moment.</p>;

  return (
    <main className="main">
      <div className="card-container">
        {tours.map((tour) => {
          const {
            id,
            _id,
            name,
            slug,
            imageCover,
            duration,
            difficulty,
            summary,
            startLocation,
            startDates,
            locations,
            maxGroupSize,
            price,
            ratingsAverage,
            ratingsQuantity,
          } = tour;

          const startDate = startDates?.[0]
            ? new Date(startDates[0]).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })
            : "TBA";

          return (
            <div className="card" key={id || _id}>
              <div className="card__header">
                <div className="card__picture">
                  <div className="card__picture-overlay">&nbsp;</div>
                  <img
                    className="card__picture-img"
                    src={`/img/tours/${imageCover}`}
                    alt={name}
                  />
                </div>
                <h3 className="heading-tertirary">
                  <span>{name}</span>
                </h3>
              </div>

              <div className="card__details">
                <h4 className="card__sub-heading">
                  {`${difficulty} ${duration}-day tour`}
                </h4>
                <p className="card__text">{summary}</p>

                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-map-pin" />
                  </svg>
                  <span>
                    {startLocation?.description || "Unknown location"}
                  </span>
                </div>

                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-calendar" />
                  </svg>
                  <span>{startDate}</span>
                </div>

                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-flag" />
                  </svg>
                  <span>{`${locations?.length || 0} stops`}</span>
                </div>

                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-user" />
                  </svg>
                  <span>{`Group Size: ${maxGroupSize}`}</span>
                </div>
              </div>

              <div className="card__footer">
                <p>
                  <span className="card__footer-value">${price}</span>{" "}
                  <span className="card__footer-text">per person</span>
                </p>
                <p className="card__ratings">
                  <span className="card__footer-value">
                    {ratingsAverage?.toFixed(1) || 0}
                  </span>{" "}
                  <span className="card__footer-text">
                    rating ({ratingsQuantity || 0})
                  </span>
                </p>
                <Link
                  to={`/tour/${slug}`}
                  className="btn btn--green btn--small"
                >
                  Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Overview;

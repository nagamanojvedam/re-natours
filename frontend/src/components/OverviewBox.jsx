function OverviewBox({ icon, label, text }) {
  return (
    <div className="overview-box__detail" role="group" aria-label={label}>
      <svg className="overview-box__icon" aria-hidden="true">
        <use xlinkHref={`/img/icons.svg#icon-${icon}`} />
      </svg>
      <span className="overview-box__label">{label}</span>
      <span className="overview-box__text">{text}</span>
    </div>
  );
}

export default OverviewBox;

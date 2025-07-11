import AccountSettingsForm from "../components/AccountSettingsForm";
import NavItem from "../components/NavItem";
import PasswordChangeForm from "../components/PasswordChangeForm";
import { useNatours } from "../context/ToursContext";

function Account() {
  const { user } = useNatours();
  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <NavItem link="#" text="Settings" icon="settings" active />
            <NavItem link="/bookings" text="My Bookings" icon="briefcase" />
            <NavItem link="#" text="My Reviews" icon="star" />
            <NavItem link="#" text="Billing" icon="credit-card" />
          </ul>

          {user?.role === "admin" && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                <NavItem link="#" text="Manage tours" icon="map" />
                <NavItem link="#" text="Manage users" icon="users" />
                <NavItem link="#" text="Manage reviews" icon="star" />
                <NavItem link="#" text="Manage bookings" icon="briefcase" />
              </ul>
            </div>
          )}
        </nav>

        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
              Your account settings
            </h2>
            <AccountSettingsForm user={user} />
          </div>

          <div className="line">&nbsp;</div>

          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <PasswordChangeForm />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Account;

import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const NatoursContext = createContext();

function NatoursProvider({ children }) {
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(undefined);

  const fetchUser = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await axios.get("/api/v2/users/check", { withCredentials: true });
      setUser(user);
    } catch (err) {
      console.error("Error fetching user", err);
      setUser(null);
    }
  }, []);

  const fetchTours = useCallback(async () => {
    try {
      const {
        data: {
          data: { data: tours },
        },
      } = await axios.get("/api/v2/tours");
      setTours(tours);
    } catch (err) {
      console.error("Error fetching tours", err);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const {
        data: {
          data: { data: reviews },
        },
      } = await axios.get("/api/v2/reviews");
      setReviews(reviews);
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchTours();
    fetchReviews();
  }, [fetchTours, fetchReviews]);

  return (
    <NatoursContext.Provider value={{ tours, reviews, user, setUser }}>
      {children}
    </NatoursContext.Provider>
  );
}

function useNatours() {
  const context = useContext(NatoursContext);
  if (!context) {
    throw new Error("useNatours must be used within a NatoursProvider");
  }
  return context;
}

export { NatoursProvider, useNatours };

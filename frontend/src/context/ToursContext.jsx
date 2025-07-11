import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const NatoursContext = createContext();

function NatoursProvider({ children }) {
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await axios.get("http://localhost:5000/api/v2/users/check", {
          withCredentials: true,
        });
        setUser(user);
      } catch (err) {
        console.error("Error fetching user", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      const {
        data: {
          data: { data: tours },
        },
      } = await axios.get(`http://localhost:5000/api/v2/tours`);
      setTours(tours);
    };
    const fetchReviews = async () => {
      try {
        const {
          data: {
            data: { data: reviews },
          },
        } = await axios.get("http://localhost:5000/api/v2/reviews");
        setReviews(reviews);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };
    fetchTours();
    fetchReviews();
  }, []);

  return (
    <NatoursContext.Provider
      value={{ tours, reviews, user, isLoading, setUser, setIsLoading }}
    >
      {children}
    </NatoursContext.Provider>
  );
}

function useNatours() {
  const context = useContext(NatoursContext);
  if (!context)
    throw new Error("Natours context cannot be used outside its provider");

  return context;
}

export { NatoursProvider, useNatours };

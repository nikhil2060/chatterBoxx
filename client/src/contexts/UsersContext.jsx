import React, { useCallback } from "react";
import { useReducer } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { allUserRoute } from "../utils/AuthRoutes";

const UsersContext = createContext();

function useContacts() {
  // custom hook
  const context = useContext(UsersContext);
  if (context === undefined) throw new Error("Users Context incorrectly used");
  return context;
}

const initialState = {
  allContacts: [],
  isLoading: false,
  currentContact: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "contacts/loaded":
      if (state.allContacts !== action.payload) {
        return { ...state, isLoading: false, allContacts: action.payload };
      }
      break;
    case "contact/loaded": {
      const contactId = action.payload;
      const selectedContact = state.allContacts.find(
        (contact) => contact._id === contactId
      );

      return {
        ...state,
        isLoading: false,
        currentContact: selectedContact || null, // Default to null if contact is not found
      };
    }

    default:
      throw new Error("Unknown action type");
  }
}

function UsersProvider({ children }) {
  const [{ allContacts, isLoading, currentContact }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const fetchAllContacts = useCallback(async function fetchAllContacts(userId) {
    if (!userId) return;
    // console.log(userId);
    dispatch({ type: "loading" });
    try {
      if (userId) {
        const response = await fetch(`${allUserRoute}/${userId}`);
        const data = await response.json();

        if (data.status === false) return;

        if (data.status === true) {
          dispatch({ type: "contacts/loaded", payload: data.users });
        }

        //   console.log(data.users);
      }
    } catch (error) {
      // toast(error);
    }
  }, []);

  const setCurrentContact = (contactId) => {
    dispatch({ type: "loading" });

    if (!contactId) return;

    dispatch({ type: "contact/loaded", payload: contactId });
  };

  return (
    <UsersContext.Provider
      value={{
        allContacts,
        isLoading,
        currentContact,
        fetchAllContacts,
        setCurrentContact,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export { UsersProvider, useContacts };

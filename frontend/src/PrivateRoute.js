import React from "react";
import { Navigate } from "react-router-dom";

/**
 * PrivateRoute משמש להגן על דפים כך שרק משתמשים מחוברים יוכלו לגשת אליהם.
 * @param {Object} children - הרכיב המוגן שנטען אם המשתמש מחובר.
 * @returns {JSX.Element} - רכיב המוגן או ניווט לדף ההתחברות.
 */
const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn"); // בדיקת סטטוס התחברות מ-localStorage
  return isLoggedIn ? children : <Navigate to="/login" />; // אם לא מחובר, נווט לדף התחברות
};

export default PrivateRoute;

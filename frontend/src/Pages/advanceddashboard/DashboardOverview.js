import React from "react";
import styles from "../cssfiles/Advanceddashboard.module.css";

const DashboardOverview = ({ stats, notifications, onStatClick, onNotificationClick }) => {
  return (
    <>
      <section className={styles.notificationsSection}>
        <h3>🔔 התראות אחרונות</h3>
        <ul>
          {notifications.map((note, idx) => (
            <li key={idx} onClick={() => onNotificationClick(note.type)}>
              {note.message}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.statsSection}>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={styles.statCard}
            onClick={() => onStatClick(stat.key)}
          >
            <h3>{stat.title}</h3>
            <p>{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </section>
    </>
  );
};

export default DashboardOverview;

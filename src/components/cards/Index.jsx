import React from "react";
import styles from "./styles.module.css";

const Cards = ({ data }) => {
  const isPositive = Number(data.numb) > 0;
  const isNegative = Number(data.numb) < 0;

  const getColor = () => {
    if (isPositive) return "green";
    if (isNegative) return "red";
    return "inherit";
  };

  return (
    <div className={styles.Cards}>
      <div className={styles.cardsTopSection}>
        <p>{data.title}</p>
        <div className={styles.icon}>{data.icon}</div>
      </div>
      <div className={styles.cardsMidSection}>
        <h3>
          {data.money || ""}{data.numb} {data.unit}
        </h3>
        <p>
          {data.description}{" "}
          <span style={{ color: getColor() }}>{data.numb}</span>
        </p>
      </div>
    </div>
  );
};

export default Cards;

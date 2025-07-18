import React from "react";
import styles from "./styles.module.css";
import { TbSettings2 } from "react-icons/tb";
const Cards = ({data}) => {
  const isPositive = data.numb > 0;
  const isNegative = data.numb < 0;

  const getColor = () => {
    if (isPositive) return "green";
    if (isNegative) return "red";
    return "inherit";
  };
  return (
    <>
      <div className={styles.Cards}>
        <div className={styles.cardsTopSection}>
          <p>Top Section</p>
          <div className={styles.icon}>
            {data.icon}
          </div>
        </div>
        <div className={styles.cardsMidSection}>
          <h3>{data.money}24 {data.unit}</h3>
          <p>
            Live power consumptions{" "}
            <span style={{ color: getColor() }}>{data.numb}%</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Cards;

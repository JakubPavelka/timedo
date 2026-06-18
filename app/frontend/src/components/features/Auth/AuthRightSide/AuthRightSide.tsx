import styles from "./AuthRightSide.module.scss";
import TimerCard from "@/assets/images/timerCard.png";
import { Trans } from "react-i18next";

export const AuthRightSide = () => (
  <>
    <img src={TimerCard} />
    <div className={styles.AuthRightSide__content}>
      <p>
        <Trans
          i18nKey={"AuthRightSide.title"}
          components={{
            colored: <span className={styles["--colored"]} />,
            break: <br />,
          }}
        />
      </p>
    </div>
  </>
);

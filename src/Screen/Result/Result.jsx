import React from "react";
import { useLocation } from "react-router-dom";
import "./styles.css";
import ResultCard from "../../components/ResultCard/ResultCard";

const Result = () => {
  const location = useLocation();
  const requestBody = location.state;

  return (
    <div className="wrapper">
      <h2>Данные формы:</h2>

      {requestBody && (
        <>
          <ResultCard
            title="Имя:"
            text={requestBody.custom_data.initiator_name}
          />
          <ResultCard
            title="Номер карты:"
            text={requestBody.payment_info.card_number}
          />
          <ResultCard
            title="Срок действия:"
            text={requestBody.payment_info.expiry_date}
          />
          <ResultCard title="CVC:" text={requestBody.payment_info.cvc} />
          <ResultCard title="Сумма:" text={requestBody.amount + " ₽"} />
         {!!requestBody.custom_data.message && <ResultCard
            title="Сообщение:"
            text={requestBody.custom_data.message}
          />}
        </>
      )}
    </div>
  );
};

export default Result;

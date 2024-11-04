import React, { useState } from "react";
import "./styles.css";
import InputField from "../../components/InputField/InputField";
import sha256 from "crypto-js/sha256";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Transfers() {
  const navigate = useNavigate();

  const api_key = "316b2be8-3475-4462-bd57-c7794d4bdb53";
  const secret = "1234567890";
  const transactionId = Date.now().toString();

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [amount, setAmount] = useState("");
  const [yourName, setYourName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Алгоритм Луна для валидации номера карты
  const validateCardNumber = (number) => {
    let sum = 0;
    let shouldDouble = false;

    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  // Проверка корректности срока действия карты
  const validateExpiryDate = (date) => {
    const [month, year] = date.split("/").map((val) => parseInt(val, 10));
    if (!month || !year || month < 1 || month > 12) return false;

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    return (
      year > currentYear || (year === currentYear && month >= currentMonth)
    );
  };

  // Проверка корректности CVC
  const validateCVC = (code) => /^\d{3}$/.test(code);

  // Валидация всей формы
  const validateForm = () => {
    const newErrors = {};

    // Валидация номера карты
    if (!cardNumber) {
      newErrors.cardNumber = "Введите номер карты";
    } else if (!validateCardNumber(cardNumber.replace(/\s+/g, ""))) {
      newErrors.cardNumber = "Некорректный номер карты";
    }

    // Валидация срока действия
    if (!expiryDate) {
      newErrors.expiryDate = "Введите срок действия";
    } else if (!validateExpiryDate(expiryDate)) {
      newErrors.expiryDate = "Некорректный срок действия";
    }

    // Валидация CVC
    if (!cvc) {
      newErrors.cvc = "Введите CVC";
    } else if (!validateCVC(cvc)) {
      newErrors.cvc = "Некорректный CVC";
    }

    // Валидация суммы
    if (!amount) {
      newErrors.amount = "Введите сумму.";
    } else if (+amount < 10) {
      newErrors.amount = "Введите сумму не менее 10 руб.";
    }

    // Валидация имени
    if (!yourName) {
      newErrors.yourName = "Введите имя";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSendData();
    }
  };

  // Функция для создания hash_sum
  const createHashSum = (transaction, amount) => {
    const data = `${api_key}${transaction}${parseInt(amount * 100)}${secret}`;
    return sha256(data).toString();
  };

  // Функция для очистки данных в инпутах
  const resetInputValue = () => {
    setCardNumber("");
    setExpiryDate("");
    setCvc("");
    setAmount("");
    setYourName("");
    setMessage("");
    setErrors({});
  };

  // Функция для отправки данных
  const handleSendData = async () => {
    setIsLoading(true);

    const hash_sum = createHashSum(transactionId, amount);

    const requestBody = {
      api_key: api_key,
      transaction: transactionId,
      description: "Перевод на экскурсию",
      amount: parseInt(amount),
      hash_sum: hash_sum,
      custom_data: {
        initiator_name: yourName,
        message: message,
        collection_name: "Экскурсия",
      },
      payment_info: {
        card_number: cardNumber,
        expiry_date: expiryDate,
        cvc: cvc,
      },
    };

    try {
      // Отправка данных с помощью axios
      const response = await axios.post("https://test.com/api", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 1200,

      });

      /*Логика будет работать, когда запрос будет успешным. 
      Поскольку адрес неправильный, это условие не сработает.*/
      if (response.data) {
        // Переход на новый экран с передачей данных формы
        navigate("/result", { state: requestBody });

        // Очистка формы после отправки
        resetInputValue();
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
    } finally {
      /* Поскольку адрес неправильный и сработает catch,
       вот логика очистки полей после успешной отправки и
        перехода на следующую страницу для тестирования.*/

      // Переход на новый экран с передачей данных формы
      navigate("/result", { state: requestBody });

      // Очистка формы после отправки
      resetInputValue();

      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <h3>Иван К. собирает на «Экскурсия»</h3>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Номер карты"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          error={errors.cardNumber}
          mask="9999 9999 9999 9999"
        />

        <div className="flexRow">
          <InputField
            label="Срок действия (MM/YY)"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
            error={errors.expiryDate}
            mask="99/99"
            style={{
              marginRight: "16px",
            }}
          />

          <InputField
            label="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            error={errors.cvc}
            mask="999"
            type="password"
            style={{
              marginLeft: "16px",
            }}
          />
        </div>

        <InputField
          label="Сумма перевода (не менее 10 руб.)"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          placeholder="₽"
          error={errors.amount}
          type="text"
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />

        <InputField
          label="Ваше имя"
          value={yourName}
          onChange={(e) => setYourName(e.target.value)}
          error={errors.yourName}
          type="text"
        />

        <InputField
          label="Сообщение получателю"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={errors.message}
        />
        <div className="flexRow">
          <button type="submit" className="btn">
            {isLoading ? "Отправка..." : "Перевести"}
          </button>
          <button
            type="button"
            className="btn return"
            onClick={resetInputValue}
          >
            Вернуться
          </button>
        </div>
      </form>
    </div>
  );
}

export default Transfers;

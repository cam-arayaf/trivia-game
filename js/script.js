document.addEventListener("DOMContentLoaded", () => {
  let selectedTrivia, interval, count;

  const initialCount = 5;

  const userAnswersTrivias = [[], []];

  const rightAnswersTrivias = [
    [0, 1, 2],
    [2, 1, 0],
  ];

  const fractionQuestions = ["Question 1/3", "Question 2/3", "Question 3/3"];

  const countdownMessages = ["Countdown:", "Timeout!"];

  const selectTriviaMessages = [
    "Hi",
    "Please, select the trivia you want to play:",
    "You can try to solve both trivias again:",
  ];

  const triviaResultMessages = [
    "Your score is 0/3. Very bad!",
    "Your score is 1/3. Bad!",
    "Your score is 2/3. Good!",
    "Your score is 3/3. Very good!",
  ];

  const trivias = [
    [
      {
        question: "Question 1 Trivia 1",
        alternatives: [
          "Alternative 1 Question 1 Trivia 1",
          "Alternative 2 Question 1 Trivia 1",
          "Alternative 3 Question 1 Trivia 1",
        ],
      },
      {
        question: "Question 2 Trivia 1",
        alternatives: [
          "Alternative 1 Question 2 Trivia 1",
          "Alternative 2 Question 2 Trivia 1",
          "Alternative 3 Question 2 Trivia 1",
        ],
      },
      {
        question: "Question 3 Trivia 1",
        alternatives: [
          "Alternative 1 Question 3 Trivia 1",
          "Alternative 2 Question 3 Trivia 1",
          "Alternative 3 Question 3 Trivia 1",
        ],
      },
    ],
    [
      {
        question: "Question 1 Trivia 2",
        alternatives: [
          "Alternative 1 Question 1 Trivia 2",
          "Alternative 2 Question 1 Trivia 2",
          "Alternative 3 Question 1 Trivia 2",
        ],
      },
      {
        question: "Question 2 Trivia 2",
        alternatives: [
          "Alternative 1 Question 2 Trivia 2",
          "Alternative 2 Question 2 Trivia 2",
          "Alternative 3 Question 2 Trivia 2",
        ],
      },
      {
        question: "Question 3 Trivia 2",
        alternatives: [
          "Alternative 1 Question 3 Trivia 2",
          "Alternative 2 Question 3 Trivia 2",
          "Alternative 3 Question 3 Trivia 2",
        ],
      },
    ],
  ];

  const greeting = document.getElementById("greeting");
  const name = document.getElementById("name");
  const next = document.getElementById("next");
  const triviasResults = document.getElementById("trivias-results");
  const firstPTriviasResults = triviasResults.querySelector("p:first-of-type");
  const lastPTriviasResults = triviasResults.querySelector("p:last-of-type");
  const triviaOne = document.getElementById("trivia-one");
  const triviaTwo = document.getElementById("trivia-two");
  const question = document.getElementById("question");
  const firstPQuestion = question.querySelector("p:first-of-type");
  const secondPQuestion = question.querySelector("p:nth-of-type(2)");
  const lastPQuestion = question.querySelector("p:last-of-type");
  const labelsQuestion = question.querySelectorAll("label");
  const alternatives = document.getElementsByName("alternatives");
  const sendAnswer = document.getElementById("send-answer");

  const setInputName = (event) => {
    const { target } = event;
    target.value = target.value.trim().length
      ? target.value.replace(/[^a-zA-Z ]/, "")
      : "";
    target.value =
      target.value.substring(target.value.length, target.value.length - 2) ===
      "  "
        ? target.value.slice(0, -1)
        : target.value;
    target.value = target.value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    target.value.trim().length
      ? next.removeAttribute("disabled")
      : next.setAttribute("disabled", true);
  };

  const setBlurName = (event) => {
    const { target } = event;
    target.value = target.value.trim();
  };

  const goToSelectTrivia = () => {
    document.body.removeChild(greeting);
    firstPTriviasResults.textContent = `${selectTriviaMessages[0]} ${name.value},`;
    lastPTriviasResults.textContent = selectTriviaMessages[1];
    greeting.classList.add("hide");
    triviasResults.removeAttribute("class");
  };

  const startCountdown = () => {
    count--;
    lastPQuestion.textContent =
      count > 0 ? `${countdownMessages[0]} ${count}` : countdownMessages[1];
    count === 0 &&
      alternatives.forEach((alternative) =>
        alternative.setAttribute("disabled", true)
      );
    count === 0 && sendAnswer.setAttribute("disabled", true);
    count < 0 && clearInterval(interval);
    count < 0 && sendAnswerClick();
  };

  const goToQuestion = (length) => {
    firstPQuestion.textContent = fractionQuestions[length];
    secondPQuestion.textContent = trivias[selectedTrivia][length].question;
    labelsQuestion.forEach(
      (label, index) =>
        (label.textContent =
          trivias[selectedTrivia][length].alternatives[index])
    );
    lastPQuestion.textContent = `${countdownMessages[0]} ${initialCount}`;
    count = initialCount;
    interval = setInterval(startCountdown, 1000);
  };

  const goToResults = () => {
    const { length } = userAnswersTrivias[selectedTrivia].filter(
      (answer, index) => answer === rightAnswersTrivias[selectedTrivia][index]
    );
    userAnswersTrivias[selectedTrivia] = [];
    firstPTriviasResults.textContent = `${name.value}. ${triviaResultMessages[length]}`;
    lastPTriviasResults.textContent = selectTriviaMessages[2];
    question.classList.add("hide");
    triviasResults.removeAttribute("class");
  };

  const goToFirstQuestion = (event) => {
    const { id } = event.target;
    selectedTrivia = id === "trivia-one" ? 0 : 1;
    const { length } = userAnswersTrivias[selectedTrivia];
    goToQuestion(length);
    triviasResults.classList.add("hide");
    question.removeAttribute("class");
  };

  const sendAnswerClick = () => {
    const checkedAlternative = Object.values(alternatives).find(
      (alternative) => alternative.checked
    );
    userAnswersTrivias[selectedTrivia].push(
      checkedAlternative ? Number(checkedAlternative.value) : -1
    );
    alternatives.forEach((alternative) => (alternative.checked = false));
    alternatives.forEach((alternative) =>
      alternative.removeAttribute("disabled")
    );
    sendAnswer.setAttribute("disabled", true);
    clearInterval(interval);
    const { length } = userAnswersTrivias[selectedTrivia];
    length < 3 ? goToQuestion(length) : goToResults();
  };

  name.oninput = setInputName;
  name.onblur = setBlurName;
  next.onclick = goToSelectTrivia;
  triviaOne.onclick = goToFirstQuestion;
  triviaTwo.onclick = goToFirstQuestion;
  sendAnswer.onclick = sendAnswerClick;
  alternatives.forEach(
    (alternative) =>
      (alternative.oninput = () => sendAnswer.removeAttribute("disabled"))
  );
});
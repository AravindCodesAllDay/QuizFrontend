import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./quiz.css";
import next from "../assets/next.svg";
import previous from "../assets/previous.svg";

const initialQuestions = [
  {
    question:
      "Which of the following is a principle of OOP that promotes code reuse?",
    options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
    correctAnswer: "Inheritance",
  },
  {
    question:
      "Identify the language which is mainly used for Artificial Intelligence",
    options: ["Java", "J2EE", "Prolog", "python"],
    correctAnswer: "Prolog",
  },
  {
    question:
      "Which sorting algorithm is known for its simplicity but is inefficient for large lists?",
    options: ["Bubble Sort", "Merge Sort", "Quick Sort", "Insertion Sort"],
    correctAnswer: "Bubble Sort",
  },
  {
    question: `class MyClass:
    def __init__(self, x):
        self.x = x

      obj1 = MyClass(5)
      obj2 = MyClass(5)

print(obj1 == obj2)
What is the output of the program?`,
    options: ["5", "5.5", "True", "False"],

    correctAnswer: "False",
  },
  {
    question: `Which sorting algorithm works by recursively dividing the array into smaller subarrays, sorting each subarray, 
and then merging them back together?`,
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Selection Sort"],
    correctAnswer: "Merge Sort",
  },
  {
    question:
      "Which of the following statements is true about object-oriented programming (OOP)?",
    options: [
      "Encapsulation is not a core principle of OOP ",
      "Inheritance allows a class to inherit properties and methods from another class",
      "OOP is only applicable in Python ",
      "Polymorphism refers to the ability of a class to inherit from multiple classes  ",
    ],
    correctAnswer:
      "Inheritance allows a class to inherit properties and methods from another class",
  },
  {
    question:
      "In Python, how would you access the last element of a list named my_list?",
    options: [
      "my_list[last] ",
      "my_list[-1]  ",
      "my_list.last()  ",
      "my_list.last ",
    ],
    correctAnswer: " my_list[-1]  ",
  },
  {
    question: ` #include <stdio.h>
    int main()
    {
        int i;
        i = printf("letsfindcourse");
        i = printf("%d ", i);
        printf("%d ", i);
        return 0;
    }
    `,
    options: [
      "letsfindcourse15 3",
      "letsfindcourse14 2",
      "letsfindcourse14 3 ",
      "Compilation Error",
    ],
    correctAnswer: "letsfindcourse14 3 ",
  },

  {
    question: `What is the output of the following code snippet ?
    x = 0
    while x < 5:
      x += 1
   print(x)
   `,
    options: ["0", "4", "5", "None of the above"],
    correctAnswer: "5",
  },
  {
    question: "In a class, encapsulating an object of another class is called",
    options: [
      "Encapsulation",
      "Inheritance",
      "Composition",
      "None of the above",
    ],
    correctAnswer: "Composition",
  },
  {
    question:
      "Which data structure uses the Last In, First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Linked list", "Binary tree"],
    correctAnswer: "Stack",
  },
  {
    question: `Which among the following is the HTML code to create a hyperlink that opens a new tab when clicked 
and navigates to "https://www.example.com"?`,
    options: [
      `<a href="https://www.example.com" target="_blank">Click Here</a>`,
      `<a href="https://www.example.com" target="_new">Click Here</a>`,
      `<a href="https://www.example.com" target="_tab">Click Here</a>`,
      `<a href="https://www.example.com" target="_window">Click Here</a>`,
    ],
    correctAnswer: `<a href="https://www.example.com" target="_blank">Click Here</a>`,
  },
  {
    question: `Consider the following snippet : 
    int main()
    {
      int i=5;
      printf( "%d %d %d " , i,i&&2,i||2);
      return 0;
    }
Output of the snippet  : 5 1 1 
What changes can be made so that the output will be 5 0 1?`,
    options: [
      `printf("%d %d %d ", i, (i && 0), (i || 2))`,
      `printf("%d %d %d ", i, (i && 2), (i || 0))`,
      `printf("%d %d %d ", i, (i && 1), (i || 2))`,
      `printf("%d %d %d ", i, (i && 0), (i || 0))`,
    ],
    correctAnswer: `printf("%d %d %d ", i, (i && 0), (i || 2))`,
  },
  {
    question:
      "Which data structure allows deleting data elements from front and inserting at rear?",
    options: ["Stacks", "Queues", "Deques", "Binary search tree"],
    correctAnswer: "Queues",
  },
  {
    question: `What will be the output of the code 
      i = 5
      if i>0 :
          print("Inside If")
      elif i>0 :
          print("Inside else if")
      print("End")
      ?`,
    options: [
      "Inside If",
      `Inside If 
   Inside Else If
   End`,
      `Inside If
   End`,
      "Error",
    ],
    correctAnswer: `Inside If
    End`,
  },
];

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [forceResult, setForceResult] = useState(false);
  const { teamName } = useParams();
  const [team, setTeam] = useState([]);
  const navigate = useNavigate();

  const MAX_TIME_LIMIT = 900; // 15 minutes in seconds

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && quizStarted && !endTime) {
        setEndTime(Date.now());
        setForceResult(true);
      }
    };

    const interval = setInterval(() => {
      if (
        quizStarted &&
        !endTime &&
        Date.now() - startTime >= MAX_TIME_LIMIT * 1000
      ) {
        setEndTime(Date.now());
        setForceResult(true);
      }
    }, 1000);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [quizStarted, endTime, startTime]);

  const calculateTotalTime = () => {
    const endTimeToUse = endTime || Date.now();
    return ((endTimeToUse - startTime) / 1000).toFixed(2); // in seconds
  };

  const shuffleQuestions = (questions) => {
    return [...questions].sort(() => Math.random() - 0.5);
  };

  const handleStartQuiz = () => {
    setQuestions(shuffleQuestions(initialQuestions));
    setStartTime(Date.now());
    setQuizStarted(true);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setSelectedOption("");
    setCurrentQuestion(currentQuestion + 1);

    if (currentQuestion === questions.length - 1) {
      setEndTime(Date.now());
    }
  };
  const handlePreviousQuestion = () => {
    // Check if it's not the first question, if yes, move to the previous question
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption("");
    }
  };

  const renderOptions = () => {
    return questions[currentQuestion].options.map((option, index) => (
      <div key={index}>
        <input
          type="radio"
          id={`option${index}`}
          name="option"
          value={option}
          checked={selectedOption === option}
          onChange={() => handleOptionSelect(option)}
        />
        <label id="optionslabel" htmlFor={`option${index}`}>
          {option}
        </label>
      </div>
    ));
  };

  const renderResult = () => {
    const totalTime = calculateTotalTime().toString();
    const updateTeam = async () => {
      const res = await fetch(`${import.meta.env.VITE_API}/team/${teamName}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ score, time: totalTime }),
      });
      if (res.ok) {
        console.log("Completed");
      }
    };
    updateTeam();
    return (
      <div id="quizcomplete">
        <h2>Thank you for participating!</h2>
        <h3 id="txt">Kindly wait for the results :)</h3>
        {/* <button  onClick={() => navigate("/")}>Quit</button> */}
      </div>
    );
  };

  return (
    <div>
      {!quizStarted ? (
        <>
          <h1 id="allthebesth1">ALL THE BEST!</h1>
          <button id="startquiz" onClick={handleStartQuiz}>
            Start Quiz
          </button>
          <ul>
            <pre class="Description">
              1.You'll be presented with a series of 15 questions.Read each
              question carefully before selecting your answer.
            </pre>
            <pre class="Description">
              2.Please note that there is a time limit of 15 minutes to complete
              the quiz. Make sure to answer all the questions within this
              timeframe.
            </pre>
            <pre class="Description">
              3.Avoid switching tabs or navigating away from the quiz page, as
              doing so will automatically end the quiz session.
            </pre>
            <pre class="Description">
              4.Your score will be calculated based on the number of correct
              answers. The more you get right, the higher your score!
            </pre>
            <pre class="Description">
              5.There are no negative marks for incorrect answers. Feel free to
              guess if you're unsure,Just do your best and enjoy the quiz!
            </pre>
          </ul>
        </>
      ) : (
        <div>
          {forceResult || currentQuestion >= questions.length ? (
            renderResult()
          ) : (
            <div id="quest">
              <img
                id="previousbutton"
                src={previous}
                alt="previousSvg"
                onClick={handlePreviousQuestion}
              />
              <img
                id="nxtbutton"
                src={next}
                alt="nextSvg"
                onClick={handleNextQuestion}
              />
              {/* <button id="nxtbutton" onClick={handleNextQuestion}>
                Next
              </button> */}
              {/* <label id="countdown"></label> */}
              <h2 id="qno">Question {currentQuestion + 1}</h2>
              <pre
                style={{
                  fontFamily: "cursive",
                  fontSize: "23px",
                  color: "rgb(92, 49, 49);",
                }}
              >
                {questions[currentQuestion].question}
              </pre>
              <pre
                style={{
                  fontFamily: "Verdana",
                  fontSize: "24px",
                  color: "rgb(92, 49, 49);",
                }}
              >
                {" "}
                {renderOptions()}{" "}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;

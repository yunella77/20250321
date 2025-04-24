let radio;
let inputBox; // 新增填空題的輸入框
let submitButton;
let resultText = "";
let table;
let usedQuestions = []; // 用來記錄已經出過的題目索引
let correctCount = 0;
let incorrectCount = 0;
let isQuizFinished = false;

function preload() {
  // 載入 CSV 檔案
  table = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 建立一個充滿視窗的畫布 

  // 建立 radio 選項
  radio = createRadio();
  radio.style('font-size', '20px');
  radio.style('color', '#000093');

  // 建立填空題輸入框
  inputBox = createInput('');
  inputBox.style('font-size', '20px');
  inputBox.style('display', 'none'); // 預設隱藏，僅在填空題時顯示

  // 建立按鈕
  submitButton = createButton('下一題');
  submitButton.style('font-size', '20px');
  submitButton.mousePressed(handleButtonClick); // 綁定按鈕事件

  // 顯示第一題
  loadRandomQuestion();
}

function draw() {
  background(220);

  // 設定填充顏色為 #FFC1E0
  fill('#FFC1E0');
  noStroke();

  // 計算矩形的位置與大小
  let rectWidth = width / 2;
  let rectHeight = height / 2;
  let rectX = (width - rectWidth) / 2;
  let rectY = (height - rectHeight) / 2;

  // 繪製矩形
  rect(rectX, rectY, rectWidth, rectHeight);

  // 顯示題目或結果
  fill(0);
  textSize(35);
  textAlign(CENTER, CENTER);

  if (isQuizFinished) {
    // 測驗結束後顯示結果
    text(`測驗結束！`, width / 2, rectY + 50);
    textSize(25);
    text(`答對題數：${correctCount}`, width / 2, rectY + 100);
    text(`答錯題數：${incorrectCount}`, width / 2, rectY + 150);
  } else {
    // 顯示當前題目
    let question = table.getString(usedQuestions[usedQuestions.length - 1], 'question');
    text(question, width / 2, rectY + 50);
  }

  // 設定 radio 選項的位置（框框內，置中，往下移 50）
  let radioX = rectX + rectWidth / 2 - radio.elt.offsetWidth / 2; // 水平置中
  let radioY = rectY + rectHeight / 2 - 50 + 50; // 往下移 50
  radio.position(radioX, radioY);

  // 設定輸入框的位置（框框內，置中，往下移 50）
  let inputX = rectX + rectWidth / 2 - inputBox.elt.offsetWidth / 2; // 水平置中
  let inputY = rectY + rectHeight / 2 - 50 + 50; // 往下移 50
  inputBox.position(inputX, inputY);

  // 設定按鈕的位置（框框內，往下移 50）
  let buttonX = rectX + rectWidth / 2 - submitButton.elt.offsetWidth / 2; // 水平置中
  let buttonY = rectY + rectHeight / 2 + 20 + 50; // 往下移 50
  submitButton.position(buttonX, buttonY);

  // 顯示結果文字
  textSize(20);
  text(resultText, width / 2, rectY + rectHeight - 30);
}

function loadRandomQuestion() {
  // 隨機選擇一個尚未出過的題目索引
  let totalQuestions = table.getRowCount();
  if (usedQuestions.length >= totalQuestions) {
    isQuizFinished = true;
    submitButton.html('再一次');
    return;
  }

  let randomIndex;
  do {
    randomIndex = floor(random(totalQuestions));
  } while (usedQuestions.includes(randomIndex));

  usedQuestions.push(randomIndex); // 記錄已出過的題目
  loadQuestion(randomIndex);
}

function loadQuestion(index) {
  // 清空 radio 選項
  radio.html('');
  inputBox.value('');
  inputBox.style('display', 'none'); // 預設隱藏輸入框

  // 從 CSV 中載入題目和選項
  let questionType = table.getString(index, 'type'); // 題目類型（選擇題或填空題）
  if (questionType === 'choice') {
    // 如果是選擇題，顯示選項
    let option1 = table.getString(index, 'option1');
    let option2 = table.getString(index, 'option2');
    let option3 = table.getString(index, 'option3');
    let option4 = table.getString(index, 'option4');

    radio.option(option1, option1);
    radio.option(option2, option2);
    radio.option(option3, option3);
    radio.option(option4, option4);
    radio.style('display', 'block'); // 顯示選擇題選項
  } else if (questionType === 'fill') {
    // 如果是填空題，顯示輸入框
    inputBox.style('display', 'block');
    radio.style('display', 'none'); // 隱藏選擇題選項
  }

  // 清空結果文字
  resultText = "";
}

function handleButtonClick() {
  if (isQuizFinished) {
    // 如果測驗結束，按下按鈕重新開始
    usedQuestions = [];
    correctCount = 0;
    incorrectCount = 0;
    isQuizFinished = false;
    submitButton.html('下一題');
    loadRandomQuestion();
  } else {
    // 檢查答案
    checkAnswer();

    // 前往下一題或結束測驗
    loadRandomQuestion();
  }
}

function checkAnswer() {
  let index = usedQuestions[usedQuestions.length - 1];
  let questionType = table.getString(index, 'type'); // 題目類型
  let correctAnswer = table.getString(index, 'correct');

  if (questionType === 'choice') {
    // 檢查選擇題答案
    let selected = radio.value();
    if (selected === correctAnswer) {
      resultText = "答對了";
      correctCount++;
    } else {
      resultText = "答錯了";
      incorrectCount++;
    }
  } else if (questionType === 'fill') {
    // 檢查填空題答案
    let userAnswer = inputBox.value().trim();
    if (userAnswer === correctAnswer) {
      resultText = "答對了";
      correctCount++;
    } else {
      resultText = "答錯了";
      incorrectCount++;
    }
  }
  function resetQuiz() {
    usedQuestions.clear();
    correctCount = 0;
    incorrectCount = 0;
    isQuizFinished = false;
    submitButton.html('下一題');
    loadRandomQuestion();
  }
  
}
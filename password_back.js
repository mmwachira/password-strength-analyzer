
let score = 0;
const minPasswordLength = 8;

const complexity = document.querySelector("#complexity");
const passwordInput = document.querySelector("#password");

passwordInput.addEventListener("keyup", checkVal);

let num = {
  excess: 0,
  upper: 0,
  numbers: 0,
  specialchars: 0
};

let bonus = {
  excess: 3,
  upper: 4,
  numbers: 5,
  specialchars: 5,
  combo: 0,
  onlyLower: 0,
  onlyNumber: 0,
  uniqueChars: 0,
  repetition: 0
};

function checkRepetition(strPassword) {
  return /([a-z0-9]{3,})\1/.test(strPassword);
}

function analyzeString(strPassword) {
  let charPassword = strPassword.split("");

  for (i = 0; i < charPassword.length; i++) {
    if (charPassword[i].match(/[A-Z]/g)) {
      num.upper++;
    }
    if (charPassword[i].match(/[0-9]/g)) {
      num.numbers++;
    }
    if (charPassword[i].match(/(.*[!,@,#,$,%,^,&,*,?,_,~])/g)) {
      num.specialchars++;
    }
  }

  num.excess = charPassword.length - minPasswordLength;

  if (num.upper && num.numbers && num.specialchars) {
    bonus.combo = 25;
  } else if (
    (num.upper && num.numbers) ||
    (num.upper && num.specialchars) ||
    (num.numbers && num.specialchars)
  ) {
    bonus.combo = 15;
  }

  if (strPassword.match(/^[\sa-z]+$/)) {
    bonus.onlyLower = -15;
  }

  if (strPassword.match(/^[\s0-9]+$/)) {
    bonus.onlyNumber = -35;
  }

  let lcPassword = strPassword.toLowerCase();

  let uniqueChars = new Set(lcPassword).size;

  if (uniqueChars <= 3) {
    bonus.uniqueChars = -Number.MAX_VALUE;
    document.querySelector("p.message").innerHTML =
      "Too Few Unique Characters.";
  } else if (uniqueChars >= 3 && uniqueChars < 6) {
    bonus.uniqueChars = -5 * (36 - uniqueChars * uniqueChars);
  } else {
    bonus.uniqueChars = 0;
    document.querySelector("p.message").innerHTML = "";
  }

  if (checkRepetition(strPassword)) {
    bonus.repetition = -50;
  } else {
    bonus.repetition = 0;
  }
}

function updateComplexity(message, removeClasses, addClass) {
  complexity.innerHTML = message;
  complexity.classList.remove(...removeClasses);
  complexity.classList.add(addClass);
}

function outputResult(strPassword) {
  let removeClasses = ["weak", "strong", "stronger", "strongest"];
  if (passwordInput.value == "") {
    updateComplexity("None", removeClasses, "default");
  } else if (strPassword.length < minPasswordLength) {
    updateComplexity(
      `Password must be at least ${minPasswordLength} characters long.`,
      removeClasses,
      "weak"
    );
  } else if (score < 50) {
    updateComplexity("Weak password", removeClasses, "weak");
  } else if (score >= 50 && score < 75) {
    updateComplexity("Average password", removeClasses, "strong");
  } else if (score >= 75 && score < 100) {
    updateComplexity("Strong password", removeClasses, "stronger");
  } else if (score >= 100) {
    updateComplexity("Your password is secure!", removeClasses, "strongest");
  }

  document.querySelector(
    "#details"
  ).innerHTML = `Base Score :<span class="value">${baseScore}</span><br />
     Length Bonus :<span class="value">${num.excess * bonus.excess} [${
    num.excess
  } x ${bonus.excess}]</span><br />
     Upper case bonus :<span class="value">${num.upper * bonus.upper} [${
    num.upper
  } x ${bonus.upper}]</span><br />
     Number Bonus :<span class="value">${num.numbers * bonus.numbers} [${
    num.numbers
  } x ${bonus.numbers}]</span><br />
     Special Character Bonus :<span class="value">${num.specialchars * bonus.specialchars} [${
    num.specialchars
  } x ${bonus.specialchars}]</span><br />
     Combination Bonus :<span class="value">${bonus.combo}</span><br />
     Lower case only penalty :<span class="value">${
       bonus.onlyLower
     }</span><br />
     Numbers only penalty :<span class="value">${bonus.onlyNumber}</span><br />
     Repeating pattern penalty :<span class="value">${
       bonus.repetition
     }</span><br />
     Total Score:<span class="value">${score}</span><br />`;
}

function calcComplexity() {
  score =
    baseScore +
    num.excess * bonus.excess +
    num.upper * bonus.upper +
    num.numbers * bonus.numbers +
    num.specialchars * bonus.specialchars +
    bonus.combo + 
    bonus.onlyLower +
    bonus.onlyNumber +
    bonus.uniqueChars + bonus.repetition;

  if (score < 0) {
    score = 0;
  }
}

function checkVal() {
  let strPassword = passwordInput.value;
  init();

  if (strPassword.length >= minPasswordLength) {
    baseScore = 50;
    analyzeString(strPassword);
    calcComplexity();
  } else {
    baseScore = 0;
  }

  outputResult(strPassword);
}

function init() {
  num.excess = 0;
  num.upper = 0;
  num.numbers = 0;
  num.specialchars = 0;
  bonus.combo = 0;
  bonus.onlyLower = 0;
  bonus.onlyNumber = 0;
  bonus.uniqueChars = 0;
  bonus.repetition = 0;
  baseScore = 0;
  score = 0;
  
  document.querySelector("p.message").innerHTML = "";
}

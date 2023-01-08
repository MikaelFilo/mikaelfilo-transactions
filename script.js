'use strict';
/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Mikael Filo',
  movements: [
    200, 455.23, 8306.5, 25000, -642.21, 18433.9, 100079.97, 18166.61,
  ],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-05-13T17:01:17.194Z',
    '2022-05-15T23:36:17.929Z',
    '2022-05-18T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-GB', // de-DE
};

const account2 = {
  owner: 'Marcus Rashford',
  movements: [50000, 3400, -150, -790, 83210, -200, 8500, 6030],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'en-GB',
};

const account3 = {
  owner: 'Jesse Lingard',
  movements: [5000, 3400, 48920, 8790, 43060, -1000, 8500, 83330],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Jadon Sancho',
  movements: [5000, 3400, -150, -790, 85070, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'en-GB',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Functions
// It will receive a date as an input and will return the formatted date
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  // new Date() - data ne momentin qe jemi, date - date ne array
  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, '0');
    // const month = `${date.getMonth() + 1}`.padStart(2, '0');
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// Reusable function
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Creating DOM Elements + Sorting arrays
// Second parameter is sort and by default is false, sepse fillimisht duam te shfaqim rradhen normale te veprimeve
const displayMovements = function (acc, sort = false) {
  // To delete the oldest movements
  containerMovements.innerHTML = '';

  // If sort is true: Do te kemi kushtin si me poshte, pra duam te sort the movements. Fillimisht krijojme nje shallow copy me slice method dhe me pas pordorim sort method. Nese jo, do te kemi rradhen normale te veprimeve.
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // Callback function with mov(current value) and index
  movs.forEach(function (mov, i) {
    // Ternary operator
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // Creating a string, called html, to insert to the method insertAdjacentHTML
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">               ${
      i + 1
    } ${type}</div>
      <div class="movements__date"> ${displayDate} </div>
      <div class="movements__value">${formattedMov}</div>
      </div>`;
    // Method to display movements to the web page. This method takes as arguments, two strings. The first is the position we want to attach the HTML. The second is the string containing the HTML that we want to insert.
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//displayMovements(account1.movements);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// The reduce method - The calculate the current balance
// Ne fillim kishim movements si argument, me pas e ndryshuam dhe e vendosem acc, sepse na duhet te shtojme balancen aktuale si nje property te re ne object, qe me pas te themi qe nese: amount (qe do te transferojme) < balanca aktuale, atehere mund te transferojme para.
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  //console.log(acc.balance);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

//calcDisplayBalance(account1.movements);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// The magic of chaining methods. Kishim ne fillim si argument movements, por me pas e ndryshuam qe te llogarisim interest rate sipas accountit perkates.

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  // Interest is paid in each deposit with 1.2%
  const interest = acc.movements
    .filter(mov => mov > 0)
    // mov po e quajme deposit per me shume qartesi
    .map(deposit => (deposit * acc.interestRate) / 100)
    // supozojme se do te marrim interesin vtm kur eshte 1€ e lart
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    // mov po e quajme int per me shume qartesi
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
//calcDisplaySummary(account1.movements);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Computing usernames

const createUsername = function (accs) {
  // We simply are looping over the account array, and in each iteration we are manipulating the current account object, and adding a username to it based on the account owner + all the transformations (toLowerCase() etc). We do not want to create a new array, we want to manipulate the array that we get as an input, so we will use forEach method.
  // Lexohet: For each account in the accounts array
  accs.forEach(function (acc) {
    // Creating a new property on each of the account objects, the property username
    acc.username = acc.owner // the result of this is an array
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        // map method creates a new simple array
        return name[0];
      })
      .join(''); // meqe eshte array therrasim metoden join
    console.log(acc.username);
  });
};

createUsername(accounts);
// console.log(accounts); // do te shikosh qe cdo objekt tani ka edhe username

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each (callback) call, print the remaining time to UI

    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1 second
    time = time - 1; // time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  // To call the padStart, we first should convert the variable to a string
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Implementing login - Event handlers
// Both variables needs to be in the parent scope of this function scope (btnLogin...)
// These are global variables
// We want the variable timer to persist throughout multiple logins
let currentAccount, timer;

// Fake always logged in - Just to test the code
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// So function() here, is a callback function
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  //console.log('LOGIN');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  // Optional chaining. If the current exists and the if...
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      //month: 'long',
      month: 'numeric',
      year: 'numeric',
      //weekday: 'long',
    };

    // It will display date & time in whatever language format you have in your browser
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // The time will stay static

    // Te shfaqet data me dy shifra dhe eshte nje shifrore, te filloje me 0
    // const day = `${now.getDate()}`.padStart(2, '0');
    // // + 1 because is zero based
    // const month = `${now.getMonth() + 1}`.padStart(2, '0');
    // const year = now.getFullYear();
    // //const hour = now.getHours();
    // const hour = `${now.getHours()}`.padStart(2, '0');
    // const min = `${now.getMinutes() + 1}`.padStart(2, '0');
    // abelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    // console.log(now);

    // day/month/year - how we want it

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //console.log(` Logged in with the PIN: ${currentAccount.pin}`);

    // Update UI
    updateUI(currentAccount);
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Implementing transfers
// We need an event because we need to do e.preventDefault, to prevent reloading the page. It is pretty common to do.
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc && // pra receiver account duhet te ekzistoje
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username // optional chaining per te pare nese receiver account ekziston apo jo
  ) {
    //console.log('Transfer valid!');
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Some and every method. The rule to request a loan is that at least you should have a deposit, with at least 10% of the requested loan amount.

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  // We want to round any value down, so we use Math.floor
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  } else {
    alert("Sorry! Right now we can't apply the loan at your account!");
    console.log("Sorry! Right now we can't apply the loan at your account!");
  }
  inputLoanAmount.value = '';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// The findIndex method
// Works almost the same as find method, but the findIndex returns the index of the found element and not the element itself. Both are ES6 methods.

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  //console.log('Delete!');

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    // Using findIndex method. The condition between the ( ), returns a boolean value, true or false. Acc is the current array element.
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(`The index account is: ${index}`);
    // 1 means that we will remove exactly 1 element. Splice method mutates the original array, so there is no need to save the result.
    // Delete
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  console.log('You just deleted your account 🔐');
  labelWelcome.textContent = 'Log in to get started';

  inputCloseUsername.value = inputClosePin.value = '';
  inputLoginPin.blur();
});

// We have to declare a state variable, that when we sort the movements, and then we want to turn back as they were, this variable can help us. This state variable will monitor if we are sorting the array or not.
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // The second parameter true. Sepse kur te klikohet butoni ne e duam true kete parameter, ne menyre qe te sort the movements.
  // The opposite of sorted is true = !sorted
  displayMovements(currentAccount, !sorted);
  // Flip the variable
  // With this, every time that we click, we change the sorted from false to true and from true to false.
  sorted = !sorted;
});

// Let's pretend that we only have these values (values of movements, but not the array with the elements) only stored in the user interface, we do not have them somewhere in our code. Don't have an array containing these values. But now we want to calculate theri sum.

// Vazhdimi nga: more_ways_of_creating_and_filling_arrays.js ...

// We can attach event listeners to every object, it doesn't have to  Kur te klikojme te balanca, do te na shfaqen te 8 movements.
// We are using Array.from to create an array from the result of querySelectorAll(), which is a node list, which is not really an array, but an array like structure, which can easily be converted to an array using Array.from(). As a second step we included a mapping function which transforms that initial array to an array exactly as we want it. (Te menyra e dyte e te paraqiturit).

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );
  console.log(movementsUI);

  // It works because movementsUI is a real array at this point. We created this array, using Array.from()
  console.log(movementsUI.map(el => el.textContent.replace('€', '$')));
});

// Menyra e dyte - E vendos el => el.textContent si parameter te dyte te Array.from(). Menyre tjeter e te paraqiturit.

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => el.textContent.replace('€', '£')
  );

  console.log(movementsUI);
});

///////////////////////////////////////////////////////////
// Set current year
const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;


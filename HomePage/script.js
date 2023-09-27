'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Omar Madjitov',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Jonas Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

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

/**DISPLAY MOVEMENTS & SORTING */
const displayMovements = function (movements, sort = false) {
  // CLear the existing container data
  containerMovements.innerHTML = '';

  // conditional parameter (if sort is true) --> sort in ASCENDING ORDER (but since the display starts from bottom up, the highest value will be on top)
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // Populating movements Container
  movs.forEach(function (mov, i) {
    // Check if the lements is a deposit of a withdrwal
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
        `;
    // Attaching the rows into the HTML | here "afterbegin" - means we want to insert the chold element, right after beggining of the parent element
    containerMovements.insertAdjacentHTML('afterbegin', html);
    // indertAdjacentHTML(where to insert, what to insert) --- here, we use 'afterbegin' and not 'beforeend', bcs we want to display the latest transaction (at the top of the transation list) i.e. append each new element, on top of previous ones
  });
};

/**DISPLAY MOVEMENTS & SORTING */

/**COMPUTING BALANCE --> ADD THE PROPERTY TO EACH ACCOUNT OBJECT */
const calcDisplayBalance = function (acc) {
  // Adding a new property of balance to an object
  acc.balance = acc.movements.reduce(
    (accumulator, mov) => accumulator + mov,
    0
  );

  labelBalance.textContent = `${acc.balance} EUR`;
};

/**COMPUTING BALANCE SUMMARY */
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}\€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out)}\€`;

  // 1.2% Interest on each acc deposit
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    // Assign interest only to those values that are higher than 1 EUR
    .filter((int, i, arr) => {
      // console.log(arr); //[2.4, 5.4, 36, 0.84, 15.6]
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}\€`;
};

/**COMPUTING BALANCE SUMMARY */

/**COMPUTING USERNAMES */
// Take in the array of objects =
const createUsernames = function (accs) {
  // For each account object --> take in the account
  accs.forEach(function (acc) {
    // Add username property that does the following transformations to the "Owner" property, which holds the Name of the owner
    // Convert to lower case --> convert into array of words, split by spaces --> transform/map each word by keeping the first char --> join
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(words => words.at(0))
      .join('');
  });
};
// console.log(createUsernames('Steven Thomas Williams'));; //stw

// Pass the array of objects
createUsernames(accounts);

/**COMPUTING USERNAMES */

/**UPDATE UI FUNCTION */
const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};
/**UPDATE UI FUNCTION */

/************* EVENT HANDLERS *************/
/**IMPLEMENTING LOGIN */

let currentAccount;
btnLogin.addEventListener('click', function (event) {
  // Prevent Form from continupusly submitting
  event.preventDefault();
  // console.log('LOGIN');

  // We retrieve the username that was submitted and assign it to currentAccount
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // Optional Chaining -- Implementing pin match checking
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Wecome Message
    labelWelcome.textContent = `Welcome back, ${
      // Split the String 'FirstName LastName' by the space into the array, and select the first element
      currentAccount.owner.split(' ')[0]
    }`;

    // Remove the Content Blocking nox, after logging in
    containerApp.style.opacity = 100;

    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    updateUI(currentAccount);

    console.log('LOGIN');
  }
});

/**IMPLEMENTING LOGIN */

/**IMPLEMENTING MONEY TRANSFERS */
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  // Find the account username from the list of objects that matches the username that has been inputed
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Clean the input fields regardles whether the transfer has been successful or not
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    // Check that ammount to be transfered is NOT negative
    amount > 0 &&
    // And reciver acc exists
    receiverAccount &&
    // And NOT greater that the balance
    currentAccount.balance >= amount &&
    // Receiver Account exists and the account is not sending money to itself
    receiverAccount?.username !== currentAccount.username
  ) {
    // console.log('Valid');
    // Implementing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Updating the User Interface
    updateUI(currentAccount);
  }

  // console.log(amount, receiverAccount);

  // inputTransferAmount
  // inputTransferTo
  // currentAccount.movements.
});

/**IMPLEMENTING MONEY TRANSFERS */

/**IMPLEMENTING LOAN REQUEST */
// loans are to be approved only if there's at least 1 deposit with at least 10% of the loan requested
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add the Movement
    currentAccount.movements.push(amount);

    // Update the UI
    updateUI(currentAccount);
  }
  // Clear the Input Field
  inputLoanAmount.value = '';
});

/**IMPLEMENTING LOAN REQUEST */

/**THE "FINDINDEX" METHOD -- IMPLEMENTING CLOSE ACCOUNT */
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  const userToClose = inputCloseUsername.value;
  const pinToClose = Number(inputClosePin.value);

  if (
    userToClose === currentAccount.username &&
    pinToClose === currentAccount.pin
  ) {
    // Find the index of a username that has been paased
    // findIndex(acc, index, aray)
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);

    // remove 1 element at a given index
    accounts.splice(index, 1);

    // LOGOUT THE USER -- HIDE UI
    containerApp.style.opacity = 0;
  }
  // Clear Cloase account Input fields
  inputCloseUsername.value = inputClosePin.value = '';
});

/**THE "FINDINDEX" METHOD -- IMPLEMENTING CLOS ACCOUNT */

/**SORTING */
// Add the State Variable
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // Pass "TRUE" as a 2nd parameter, if a user clicks 'sort' button
  displayMovements(currentAccount.movements, !sorted);

  //Return the initial state of sorted
  // LOGIC CHAIN: "sorted" is declared as false --> then passed/mutated as "!sorted"(true) --> Returned back to false
  sorted = !sorted;
});
/**SORTING */

/************* EVENT HANDLERS *************/

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(containerMovements.innerHTML);
// innerHTML returns everything includeing hetm text vs textContent -- returns only the text
{
  /* <div class="movements__row">
.....
<div class="movements__value">200</div>
</div> */
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// /////////////////////////////////////////////////
/**SIMPLE ARRAY METHODS *

let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE METHOD (begin parameter, end parameter - not included in the output)
console.log(arr.slice(2)); //['c', 'd', 'e']
console.log(arr.slice(2, 4)); //['c', 'd']

// Will start copying from the end
console.log(arr.slice(-2)); // ['d', 'e']
console.log(arr.slice(-1)); //['e']
console.log(arr.slice(1, -2)); // ['b', 'c']

// Create a Shallow copy
console.log(arr.slice()); //['a', 'b', 'c', 'd', 'e']
console.log([...arr]); //['a', 'b', 'c', 'd', 'e']


// SPLICE METHOD - MUTATES THE ORGINAL ARRAY
// console.log(arr); //Original array: ['a', 'b', 'c', 'd', 'e']
// console.log(arr.splice(2)); // ['c', 'd', 'e']
// console.log(arr); //Original array mutated ['a', 'b']

// Remove the last element = (-1)
arr.splice(-1)
console.log(arr);//['a', 'b', 'c', 'd']

//ARR.SPLICE(index at which we start changing the array, number of integers to remove)
console.log(arr); //['a', 'b', 'c', 'd']
arr.splice(1,2) // 'b', 'c' - are to be removed
console.log(arr); //['a', 'd'] - remain

// REVERSE - ALSO MUTATES THE ORGIGINAL
// Restore the array 
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f']

console.log(arr2.reverse()); //['f', 'g', 'h', 'i', 'j']
console.log(arr2);//ORGINAL MUTATED ['f', 'g', 'h', 'i', 'j']

// CONCAT
const letters = arr.concat(arr2)
console.log(letters); //['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
console.log([...arr,...arr2]); //['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']


// JOIN - each elemnt of the array, with a specified delimiter in between
console.log(letters.join('-')); //a-b-c-d-e-f-g-h-i-j


/**SIMPLE ARRAY METHODS */

/**THE NEW AT METHOD *
const arr = [23, 11, 64];
console.log(arr[0]);

// RETRIEVE THE ELEMENT AT --- AT METHOD 
console.log(arr.at[0]);


// RETRIEVE THE LAST ELEMENT OF THE ARRAY 
console.log(arr[arr.length-1]); // 64
console.log(arr.slice(-1)[0]); //Returns the list of elements starting from the last element until the end of the array = [64] --> we add " [0]" to retrieve the value of the el : 64
console.log(arr.at(-1));//64 -- returns the value of the last element, and not the element object
console.log(arr.at(-2));//11

// 'AT' WORKS FOR STRINGS
console.log('Omar'.at(0)); // O
console.log('Omar'.at(-1)); // r

/**THE NEW AT METHOD */

/**LOOPING ARRAYS  *

// BANK ACCOUNT DATA 

// loop over the array to print each movement of funds within the bank account
// for (const movement of movements){
for (const [i, movement] of movements.entries()){
  if(movement > 0){
    console.log(`Movement ${i+1}: You deposited ${movement}`);
  }else{
    console.log(`Movement ${i+1}: You withdrew ${Math.abs(movement)}`); //Get the absolute value
  }
}
// Movement 1: You deposited 200
// Movement 2: You deposited 450
// Movement 3: You withdrew 400
// Movement 4: You deposited 3000
// Movement 5: You withdrew 650
// Movement 6: You withdrew 130
// Movement 7: You deposited 70
// Movement 8: You deposited 1300


// DO THE SAME BY USING forEach() METHOD --- pareters passed by default --- can also specify manually => (element, index, array)
//forEch() --- higher order function
console.log('\n---- FOREACH ----');
movements.forEach(function(movement, index, array){
  if(movement > 0){
    console.log(`Movement ${index+1}: You deposited ${movement}`);
  }else{
    console.log(`Movement ${index+1}: You withdrew ${Math.abs(movement)}`); 
  }
})

// NOTE: CONTINUE AND BREAK DON'T WORK 'forEach()'

/**LOOPING ARRAYS  */

/**FOR EACH ON MAPS AND SETS*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(currValue, key, map ){
  console.log(`Key: ${key}, Value: ${currValue}, Map: ${map}`);
})
// Key: USD, Value: United States dollar, Map: [object Map]
// Key: EUR, Value: Euro, Map: [object Map]
// Key: GBP, Value: Pound sterling, Map: [object Map]

// ForEach Sets - key duplicates the value technically we pass(value, value, set)
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR'])
console.log(currenciesUnique);//{'USD', 'GBP', 'EUR'}

currenciesUnique.forEach(function(currValue, key, set){
  console.log(`Key: ${key}, Value: ${currValue}, Set: ${set}`);
})
// Key: USD, Value: USD, Set: [object Set]
// Key: GBP, Value: GBP, Set: [object Set]
// Key: EUR, Value: EUR, Set: [object Set]

/**FOR EACH ON MAPS AND SETS*/

/**DATA TRANSFORMATION: MAP, FILTER, REDUCE *
// MAP ARRAY METHOD - LOOPS OVER THE ARRAY, APPLIES SPECIFIED OPERATIONS AND CREATES A BRAND NEW ARRAY WITH NEW VALUES

// Convert EUR values into USD (1 EUR = 1.1 USD)

const eurToUsd = 1.1;
const movementsUsd = movements.map(function (mov) {
  return mov * eurToUsd;
  // return 23 //[23, 23, 23, 23, 23, 23, 23, 23]
});
// CONVERT INTO ARROW FUNCTION
const movementsUsdArrow = movements.map(mov => mov * eurToUsd);
console.log(movementsUsdArrow); //[220.00000000000003, 495.00000000000006, -440.00000000000006, 3300.0000000000005, -715.0000000000001, -143, 77, 1430.0000000000002]

console.log(movements); //[200, 450, -400, 3000, -650, -130, 70, 1300]
console.log(movementsUsd); //[220.00000000000003, 495.00000000000006, -440.00000000000006, 3300.0000000000005, -715.0000000000001, -143, 77, 1430.0000000000002]

const movementsUsdFor = [];
for (const mov of movements) movementsUsdFor.push(mov * eurToUsd);

const movementsDescription = movements.map(
  (mov, index) =>
    `Movement ${index + 1}: You ${
      mov > 0 ? 'deposited' : 'withdrew'
    } ${Math.abs(mov)}`
);
console.log(movementsDescription);
// ['Movement 1: You deposited 200', 'Movement 2: You deposited 450', 'Movement 3: You withdrew 400', 'Movement 4: You deposited 3000', 'Movement 5: You withdrew 650', 'Movement 6: You withdrew 130', 'Movement 7: You deposited 70', 'Movement 8: You deposited 1300']


/**DATA TRANSFORMATION: MAP, FILTER, REDUCE */

/**FILTER ARRAY METHOD *
// FILTER ARRAY METHOD - FILTERS FOR ELEMENTS IN THE ORIGINAL ARRAY FOR WHICH THE CONDITION IS TRUE AND PUTS THEM INTO A NEW ARRAY
// array.filter(eachElement, index, array)

// Deposits - movements above 0
const deposits = movements.filter(function (mov, i, array) {
  // Returns a bolean value, only the els, for which the condition is true, will make it into the "deposits" array
  return mov > 0;
});
console.log(movements); //[200, 450, -400, 3000, -650, -130, 70, 1300]
console.log(deposits); //[200, 450, 3000, 70, 1300]

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor); // [200, 450, 3000, 70, 1300]

// ARRAY OF THE WITHDRAWALS
// NOTE: ARROW FUNCTION ALWAYS RETURNS THE VALUE AUTOMATICALLY
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals); //[-400, -650, -130]
/**FILTER ARRAY METHOD */

/**REDUCE ARRAY METHOD *
// REDUCE ARRAY METHOD - BOILS DOWN ALL OF THE ELEMENTS INTO ONE SINGLE VALUE - RETURNS THE REDUCED VALUE
// array.reduce(function((accumulator, current, index, array){}, initalValueOfAccumulator)

console.log(movements); //[200, 450, -400, 3000, -650, -130, 70, 1300]

// Accumulator is like a snowball
const balance = movements.reduce(function (accumulator, current, index, array) {
  console.log(`Itteration number ${index}: ${accumulator}`);
  //  Itteration number 0: 0
  //  Itteration number 1: 200
  // ...
  //  Itteration number 7: 2540

  // Adding each value in the loop to an accumulator value
  return accumulator + current;
}, 0);

console.log(balance); // 3840

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2); //3840

// Maximum Value of the movements array | 
const max = movements.reduce((accumulator, mov) => {
  if(accumulator > mov){
    return accumulator
  }else {
    return mov
  }
  // set the initial value of the accumulator to be equal to the 1st value of the movements array 
}, movements[0])

console.log(max);

/**REDUCE ARRAY METHOD */

/**MAGIC OF CHAINING */

// console.log(movements);

/**MAGIC OF CHAINING *
const eurToUsd = 1.1;
console.log(movements);

// Chaining Pipeline
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUsd;
  })
  // .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD); //5522.000000000001

/**MAGIC OF CHAINING */

/**THE "FIND" METHOD */
// Retrieving one element of the array, based on a condition
// Returns only the first element that satisfies the condition
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal); //-400

console.log(accounts);
// Find the specific onject based on the property of that object
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account); //{owner: 'Jessica Davis', movements: Array(8), interestRate: 1.5, pin: 2222, username: 'jd'}

// Challenge: DO THE SAME AS ABOVE USING "FOR OF" LOOP
for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    console.log(acc.owner); //Jessica Davis
  }
}

/**THE "FIND" METHOD */

/**SOME AND EVERY METHOD */
// SOME

// INCLUDES CAN ONLY CHECK FOR EQUALITY OF VALUES
console.log(movements.includes(-130)); //True

// SOME CAN CHECK FOR ANY SPECIFIED CONDITION
// CHECK WHETHER THERE ARE ANY POSITIVE VALUE DESPOSITS DONE TO THE ACCOUNT
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits); //True

// EVERY - Returns true if every element in the array satisfies the conditions
// Check if all of the movements are deposits
console.log(movements.every(mov => mov > 0)); //false
console.log(account4.movements.every(mov => mov > 0)); //true

// SEPARATE CALLBACK function
const deposit = mov => mov > 0;
const deposit2 = function (mov) {
  return mov > 0;
};

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
console.log(movements.find(deposit));
console.log(movements.findIndex(deposit));

/**SOME AND EVERY METHOD */

/**FLAT AND FLATMAP METHODS *

// FLAT METHOD - GETS THE SUB ARRAYS FROM THE NESTED ARRAY, AND PUTS THEM IN PARENT ARRAY
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

console.log(arr.flat()); //[1, 2, 3, 4, 5, 6, 7, 8]

// Flat() - goes only one level deep by default
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat()); //[Array(2), 3, 4, Array(2), 7, 8]
console.log(arrDeep.flat(2)); // 2 LEVELS deep //[1, 2, 3, 4, 5, 6, 7, 8]

// CALCULATE THE BALANCE OF OVERALL MOVEMENTS FOR ALL THE ACCOUNTS
// Create an array that contains movements array of each Account object
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements); //(4) [Array(8), Array(8), Array(8), Array(5)]

const allMovements = accountMovements.flat();
console.log(allMovements); //[200, 450, -400, 3000, -650, -130, 70, 1300, 5000, 3400, -150, -790, -3210, -1000, 8500, -30, 200, -200, 340, -300, -20, 50, 400, -460, 430, 1000, 700, 50, 90]

// Add all movements together
// const overalBalance = allMovements.reduce((accum, mov) => accum + mov, 0)
// console.log(overalBalance);//17840

const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((accum, mov) => accum + mov, 0);
console.log(overalBalance); //17840

// FLAT MAP METHOD .map() and .flat() methods very often are used in conjunction therefore ".flatmap()" method has been introduced

// FLATMAP() - ONLY GOES 1 LEVEL DEEP -- ALWAYS
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((accum, mov) => accum + mov, 0);
console.log(overalBalance2); //17840

/**FLAT AND FLATMAP METHODS */

/**SORTING ARRAYS */
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];

// Mutates the Original array
console.log(owners.sort()); //['Adam', 'Jonas', 'Martha', 'Zach']

// NUMBERS SORT
console.log(movements); //[200, 450, -400, 3000, -650, -130, 70, 1300]
// console.log(movements.sort()); //[-130, -400, -650, 1300, 200, 3000, 450, 70] ---> Sorted Based on Strings

// --->Fix by addig a call back function
// A - current value, B - Next value
// movements.sort((a, b) => {
//   // How Sort() function works && SORT IN ASCENDING ORDER
//   // If we return < 0 then A, B (keep order)
//   // If we return < 0 then B, A (switch order)
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
// console.log(movements);//[-650, -400, -130, 70, 200, 450, 1300, 3000]
// REFACTOR ASCENDING
movements.sort((a, b) => a - b);
console.log(movements); //[-650, -400, -130, 70, 200, 450, 1300, 3000]

// DESCENDING ORDER
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });

// REFACTOR DESCENDING
movements.sort((a, b) => b - a); // If b > a, then the return will be a positive number --> the order will be preserved
// If b < a, then the return will be a negative number --> the order will be SWAPPED
console.log(movements); //[3000, 1300, 450, 200, 70, -130, -400, -650]

/**SORTING ARRAYS */

/**CREATING AND FILLING ARRAYS *

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7); //Array of size 7
// console.log(x.map(()=>5));

// FILL THE ARRAY --> Param: (value to fill with, where to start filling, where to stop the filling)
x.fill(1, 3, 5); // Fill the array with '1', from index 3, until index 5
console.log(x); //[empty × 3, 1, 1, empty × 2]

arr.fill(23, 2, 6); // Fill the array with 23, from i=2 until i<6
console.log(arr); //[1, 2, 23, 23, 23, 23, 7]

//Array.from -- USING ARRAY OBJECT METHOD TO FILL THE ARRAY
// 1 Param: Object with length ptoperty,
// 2 Param: Callback Arrow Function which returns the value(here, 1) that we want our arrya to be filled with
const y = Array.from({ length: 7 }, () => 1);
console.log(y); //[1, 1, 1, 1, 1, 1, 1]

// THE CALLBACK FUNTION TO FILL THE ARRAY IN THE ".from" method is exactly like the one in "map" method
const z = Array.from({ length: 7 }, (curr, index, array) => index + 1);

console.log(z); //[1, 2, 3, 4, 5, 6, 7]

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => el.textContent.replace('€', '') //Retrieving a list of movements from the UI
  );

  console.log(movementsUI);
  // ['1300', '70', '-130', '-650', '3000', '-400', '450', '200']

  movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
});
/**CREATING AND FILLING ARRAYS */

/**ARRAY METHODS PRACTICE */

//1. How Much has been deposited in total in the bank?
const bankDepositSum = accounts
  .flatMap(acc => acc.movements) //[200, 450, -400, 3000, -650, -130, 70, 1300, 5000, 3400, -150, -790, -3210, -1000, 8500, -30, 200, -200, 340, -300, -20, 50, 400, -460, 430, 1000, 700, 50, 90]
  .filter(mov => mov > 0) //[200, 450, 3000, 70, 1300, 5000, 3400, 8500, 200, 340, 50, 400, 430, 1000, 700, 50, 90]
  .reduce((accum, mov) => accum + mov, 0); //25180

console.log(bankDepositSum); //25180

// 2. How many deposits there have been with at least $1000
// OPTION 1
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 1000)
//   .length;

// console.log(numDeposits1000); //5

// OPTION --- 2 (num of deps that are EQUAL OR GREATER)
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  // When the current value >= 1000 --> Retrun count+1, otherwise just count
  // .reduce((accum, curr) => (curr >= 1000 ? accum + 1 : accum), 0); //6
  .reduce((accum, curr) => (curr >= 1000 ? ++accum : accum), 0); //6

console.log(numDeposits1000); //6

let a = 10;
console.log(a++); //10 === RETURN THEN INCREMENT
console.log(a); //11
console.log(++a); //12 === INCREMENT THEN RETURN (PREFIXED OPERATOR)

// 3. Create an Object which contains the sum of the deposits and withdrwaals
// Destructure Object
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      // curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
      // Refactor
      sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
      // sums[deposits] += curr - object property selection based on brackets notation

      return sums;

      // Since our goal is to return an object --> we initialize an empty object
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals); //25180 -7340

// 4. A FUNCTION TO CONVERT SNY STRING INTO TITLE CASE
// this is a nice title --> This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      // If the current word is included in the "Exceptions" --> return the word as it is, otherwise --> Capitalize
      exceptions.includes(word) ? word : capitalize(word)
    )
    .join(' ');

  // Capitalize the first word, regardless whether it's an exception
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

/**ARRAY METHODS PRACTICE */

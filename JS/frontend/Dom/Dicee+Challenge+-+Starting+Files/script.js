console.log('Hello World!');

let activeNum = 0;

function getRandomNumber() {
  let randomNum = Math.floor(Math.random() * 6) + 1;
  console.log('Rolled:', randomNum);

  if (randomNum === 6) {
    console.log("It's a 6! No points added.");
    return;
  }

  activeNum += randomNum;
  console.log('Active Number:', activeNum);
}

// Call getRandomNumber every second (1000 milliseconds)

/* setInterval(getRandomNumber, 1000); */

//////////////////////////////////////////////////////////////
/* let count = 0;
function theFirst() {
  console.log('the first function');

  count++;
  console.log(count);
  theSecond(); // Call the second function
}

function theSecond() {
  console.log('the second function');
  theFirst(); // Call the first function (creates infinite loop!)
} 


theFirst(); // This will create infinite recursion! 

setInterval(theFirst, 1000);
 */

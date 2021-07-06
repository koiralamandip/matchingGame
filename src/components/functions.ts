import { User } from "../state/reducers/userReducer";

// Fisher Yates Shuffling Algorithm (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
// Function to shuffle card values stored in an array. 
export const shuffleCards = (arrayOfSize: number[]) => {
    for (let i = arrayOfSize.length; i > 0; i--){
      const randomIndex = Math.floor(Math.random() * i);
      const currentIndex = i - 1;
      const temp = arrayOfSize[currentIndex];
      arrayOfSize[currentIndex] = arrayOfSize[randomIndex];
      arrayOfSize[randomIndex] = temp;
    }
    return arrayOfSize;
}

// Return a numbered array of an input size.
// Input size is "gridLen" which is "n" for n X n grid of cards. 
export const arrayOfSize = (gridLen: number) => {
return Array.from(Array<number>(gridLen * gridLen).keys());
}

// Returned a formatted string of time in MM:SS format from an input seconds value.
// Considering the seriousness of the game, and for demonstration purpose, the formatting is done..
// in a way to include MM:SS and exclude, or better say, without considering the value could reach in Hours.
// So, a gameplay time of 1 hr 25 minutes 30 seconds would, for now, render as 85 minutes and 30 seconds.  
export const getFormattedTime = (time: number) => {
    let sec = time % 60;
    let min = Math.floor(time / 60);
    return ((min <= 9)? "0" + min : min ) + ":" + ((sec <= 9)? "0" + sec : sec)
}

// To sort the input array (Users array in particular, here) in DESCENDING order of their high scores. 
export const sort = (array: User[]): User[] => {
  return array.sort((a: User, b: User) => a.score.high - b.score.high);
}
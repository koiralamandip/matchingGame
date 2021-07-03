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
  
export const arrayOfSize = (gridLen: number) => {
return Array.from(Array<number>(gridLen * gridLen).keys());
}

export const getFormattedTime = (time: number) => {
    let sec = time % 60;
    let min = Math.floor(time / 60);
    return ((min <= 9)? "0" + min : min ) + ":" + ((sec <= 9)? "0" + sec : sec)
  }
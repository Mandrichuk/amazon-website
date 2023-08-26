export function createID() {
  let ID = '';

  const letters = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e'
  }

  for (let i = 1; i <= 35; i++) {
    if (ID.length === 9 || ID.length === 14 || ID.length === 19 || ID.length === 24) {
      ID += '-';
    }
    else if (ID[ID.length -1] % 3 === 0) {
      const randNum = Math.floor(Math.random() * 5);
      ID += letters[randNum];
    }
    else { 
      ID += Math.floor(Math.random() * 10);
    }
  }
  return ID;
}
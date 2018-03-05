module.exports = function(firstWord, secondWord) {

  if (firstWord.length !== secondWord.length) {
      return false;
  }

  var sortFirstWord = firstWord.toLowerCase().split('').sort().join('').trim();
  var sortSecondWord = secondWord.toLowerCase().split('').sort().join('').trim();

  return sortFirstWord === sortSecondWord;
}

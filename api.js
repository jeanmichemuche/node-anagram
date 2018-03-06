const express = require('express');
const bodyParser = require('body-parser');
const isAnagram = require('./is_anagram')
const combinations = require('combinations')
const app = express();
const config = require('./config/index');
const dictionagram = require('./dictionagram');
const esj = require('express-stream-json');
const { Writable } = require('stream');

app.use(bodyParser.json());
app.get('/ping', (req, res) => res.send('pong'));

/**
 * @api {get} /find Find Anagrams
 * @apiName FindAnagrams
 * @apiDescription This endpoint will find all anagrams in the english dictionary based on the string sent
 * @apiGroup Anagram
 *
 * @apiParam (query) {String} word
 *
 * @apiExample {curl} Example usage:
 *     curl -X GET -H "Content-Type: application/json" -d '{"word": "test"}' http://localhost:3001/find
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *      "word1",
 *      "word2",
 *      "word3"
 *   ]
 */
app.get('/find', (req, res) => {

  var given_word = req.body.word;
  if (given_word === undefined) {
    res.status(400)
       .send({error: 'Invalid query'});
    return;
  }
  if (/^[a-zA-Z]+$/.test(given_word) === false) {
    res.status(400)
       .send({error: 'Your word contains unexpected characters. Please type only letters.'});
    return;
  }

  dictionagram.find_anagrams(given_word, (anagrams) => {
    res.send(anagrams);
  })
});

/**
 * @api {put} /word Add word
 * @apiName AddWord
 * @apiDescription This endpoint will add the word of your choice in the current dictionnary
 * @apiGroup Anagram
 *
 * @apiParam (query) {String} word
 *
 * @apiExample {curl} Example usage:
 *     curl -X GET -H "Content-Type: application/json" -d '{"word": "yatta"}' http://localhost:3001/add
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 CREATED
 */
app.put('/word', (req, res) => {

  var given_word = req.body.word;
  if (given_word === undefined) {
    res.status(400)
       .send({error: 'Invalid query'});
    return;
  }
  if (/^[a-zA-Z]+$/.test(given_word) === false) {
    res.status(400)
       .send({error: 'Your word contains unexpected characters. Please type only letters.'});
    return;
  }

  dictionagram.add_word(given_word);
  res.status(201).send();
});

/**
 * @api {get} /compare Compare Anagrams
 * @apiName CompareAnagrams
 * @apiDescription This endpoint will receive two words, and compare them to see if they are anagrams
 * @apiGroup Anagram
 *
 * @apiParam (query) {String} word1
 * @apiParam (query) {String} word2
 *
 * @apiExample {curl} Example usage:
 *     curl -X GET -H "Content-Type: application/json" -d '{"word1": "test", "word2": "tset"}' http://localhost:3001/compare
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   false
 */
app.get('/compare', (req, res) => {

  var first_word = req.body.word1;
  var second_word = req.body.word2;
  if (first_word === undefined || second_word == undefined) {
    res.status(400)
       .send({error: 'Invalid query'});
    return;
  }

  res.send(isAnagram(first_word, second_word));
});

/**
 * @api {get} /phrases Find Anagrams for phrases composed of two words
 * @apiName FindPhraseAnagrams
 * @apiDescription 
 * @apiGroup Anagram
 *
 * @apiParam (query) {String} phrase
 *
 * @apiExample {curl} Example usage:
 *     curl -X GET -H "Content-Type: application/json" -d '{"phrase": "rail safety"}' http://localhost:3001/phrase
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *      "fairy tales"
 *   ]
 */
const THRESHOLD = 3;
app.get('/phrase', (req, res, next) => {

  var given_phrase = req.body.phrase;
  if (given_phrase === undefined) {
    res.status(400)
       .send({error: 'Invalid query'});
    return;
  }
  if (/^[a-zA-Z]+\s{1}[a-zA-Z]+$/.test(given_phrase) === false) {
    res.status(400)
       .send({error: 'Your word contains unexpected characters. Please type only 2 words separated by a space.'});
    return;
  }

  var anagrams = [];

  var givenPhraseCompressed = given_phrase.toLowerCase().trim().replace(' ', '');
  var givenPhraseLettersOnly = givenPhraseCompressed.split('');

  var allCombinations = combinations(givenPhraseLettersOnly, THRESHOLD);
  for (var i = 0; i < allCombinations.length; i++) {
    // Our first part will be the current combination
    var combination = allCombinations[i];

    // Our second part will be the remaining characters of the given phrase (ie. given phrase minus combination)
    var remaining_letters = givenPhraseCompressed;
    for (var j = 0; j < combination.length; j++) {
      remaining_letters = remaining_letters.replace(combination[j], '');
    }
    // If equals of below threshold, skip
    if (remaining_letters.length < THRESHOLD) {
      continue;
    }
    console.log(remaining_letters);

    var firstPart = null;
    var secondPart = null;

    // var combinationAsString = combination.join('');
    // for (var j = 0; j < wordList.length; j++) {
    //   var word = wordList[j];
    //   if(isAnagram(combinationAsString, word)) {
    //     firstPart = word;
    //     break;
    //   }
    // }
    var combinationStr = combination.join('');
    dictionagram.find_anagrams(combinationStr, firstPartAnagrams => {
      if (typeof firstPartAnagrams === 'undefined' || firstPartAnagrams.length === 0) {
          return;
      }
      // console.dir(firstPartAnagrams);
      for (var firstPartAnagram in firstPartAnagrams) {
        dictionagram.find_anagrams(remaining_letters, secondPartAnagrams => {
          if (typeof secondPartAnagrams === 'undefined' || secondPartAnagrams.length === 0) {
              return;
          }
          console.dir(secondPartAnagrams);
          for (var secondPartAnagram in secondPartAnagrams) {
            // stream.pipe(firstPartAnagram + ' ' + secondPartAnagrams);
            res.status(200).end();
          }
        })
      }
    })
    // for (var j = 0; j < wordList.length; j++) {
    //   var word = wordList[j];
    //   if(isAnagram(remaining_letters, word)) {
    //     secondPart = word;
    //     break;
    //   }
    // }
    // if (firstPart && secondPart) {
    //   anagrams.push(firstPart + ' ' + secondPart);
    // }
  }

  // res.send(anagrams);
  // next();
});

app.listen(config.port);
console.log('Anagram API listening on port ' + config.port);

module.exports = app

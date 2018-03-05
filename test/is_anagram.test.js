var assert = require('assert');
var isAnagram = require('../is_anagram')

describe('is_anagram', function() {

    it('should return true when two words which are anagrams', function() {
      assert.equal(isAnagram('zebra', 'braze'), true);
    });

    it('should return true when two words which are anagrams, but one word has an uppercase', function() {
      assert.equal(isAnagram('zebrA', 'braze'), true);
    });

    it('should return false when two words which are NOT anagrams', function() {
      assert.equal(isAnagram('test', 'tast'), false);
    });
});

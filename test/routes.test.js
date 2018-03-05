var api = require('../api');
var expect = require('chai').expect;
var request = require('supertest');

describe('API Tests', function() {

  describe('GET /find', function() {
    const endpoint = '/find';

    describe('word with anagrams', function() {

      var zebra = 'zebra';
      var its_anagram = 'braze';

      it('should find one anagram for "' + zebra + '"', function(done) {
        request(api)
          .get(endpoint)
          .set('Accept', 'application/json')
          .send({word: zebra})
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.equal(1);
            expect(res.body).to.contain(its_anagram);
            done();
          });
      });

      var test = 'test';
      var test_anagrams = ['sett', 'stet', 'tets'];
      it('should find many anagrams for "' + test + '"', function(done) {
        request(api)
          .get(endpoint)
          .set('Accept', 'application/json')
          .send({word: test})
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.equal(test_anagrams.length);
            expect(res.body).to.deep.equal(test_anagrams);
            done();
          });
      });
    });

    describe('word with no anagrams', function() {

      var word_with_no_anagrams = 'abcd';

      it('should not find anagrams for "' + word_with_no_anagrams + '"', function(done) {
        request(api)
          .get(endpoint)
          .set('Accept', 'application/json')
          .send({word: word_with_no_anagrams})
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.equal(0);
            done();
          });
      });
    });

    describe('invalid query', function() {

      it('should return 400', function(done) {
        request(api)
          .get(endpoint)
          .set('Accept', 'application/json')
          .send({sentence: 'zebra'})
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(400);
            done();
          });
      });

      it('when word contains invalid characters, it should return 400', function(done) {
        request(api)
          .get(endpoint)
          .set('Accept', 'application/json')
          .send({sentence: 'zeb ra'})
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(400);
            done();
          });
      });
    });
  });

  describe('GET /compare', function() {
    const endpoint = '/compare';

    describe('words which are anagrams', function() {

      var zebra = 'zebra';
      var its_anagram = 'braze';

      it('should return true', function(done) {
        request(api)
          .get(endpoint)
          .set('Accept', 'application/json')
          .send({word1: zebra, word2: its_anagram})
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('boolean');
            expect(res.body).to.be.equal(true);
            done();
          });
      });
    });

    describe('words which are NOT anagrams', function() {

      it('should return true', function(done) {
        request(api)
          .get(endpoint)
          .set('Accept', 'application/json')
          .send({word1: 'dog', word2: 'cat'})
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('boolean');
            expect(res.body).to.be.equal(false);
            done();
          });
      });
    });

    describe('invalid query', function() {

      it('should return 400', function(done) {
        request(api)
          .get(endpoint)
          .set('Accept', 'application/json')
          .send({sentence: 'zebra'})
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(400);
            done();
          });
      });
    });
  });

  describe('PUT /word', function() {
    const endpoint = '/word';

    describe('add a non-existing word', function() {

      var word = 'bloubiboulga';

      it('should return 201', function(done) {
        request(api)
          .put(endpoint)
          .set('Accept', 'application/json')
          .send({word: word})
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(201);
            done();
          });
      });
    });

    describe('add an existing word', function() {

      var existing_word = 'zebra';

      it('should return 201', function(done) {
        request(api)
          .put(endpoint)
          .set('Accept', 'application/json')
          .send({word: existing_word})
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(201);
            done();
          });
      });
    });

    describe('invalid query', function() {

      it('should return 400', function(done) {
        request(api)
          .put(endpoint)
          .set('Accept', 'application/json')
          .send()
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(400);
            done();
          });
      });

      it('when word contains invalid characters, should return 400', function(done) {
        request(api)
          .put(endpoint)
          .set('Accept', 'application/json')
          .send({word: 'abc d'})
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.equal(400);
            done();
          });
      });
    });
  });
});

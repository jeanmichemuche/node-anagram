const config = require('./config/index');
const {promisify} = require('util');
const fs = require('fs');
const redis = require('redis')


class Dictionagram {

  constructor(redis_url, reset_db) {
    this._init_client(redis_url);
    this._flushdb(reset_db);
    this._populate();
  }

  _init_client(redis_url) {
    var client = redis.createClient(redis_url);
    client.on("error", function (err) {
        console.log("Error " + err);
    });
    this.flushdbAsync = promisify(client.flushall).bind(client);
    this.getAsync = promisify(client.get).bind(client);
    this.hsetAsync = promisify(client.hset).bind(client);
    this.client = client;
  }

  async _flushdb(reset_db) {
    if (reset_db) {
      await this.flushdbAsync();
    }
  }

  async _populate() {
    var self = this;

    const is_loaded = await this.getAsync('loaded');
    if (is_loaded) {
      console.log('already loaded');
      return;
    }

    config.wordFilePath.split('\n').forEach(word => {
      this.hsetAsync(word.split('').sort().join(''), word, 1);
    })
    self.client.set('loaded', 1);
  }

  is_ready(cb) {
      this.client.get('loaded', (err, reply) => {
          cb(reply == 1);
      });
  }

  find_anagrams(word, cb) {
      word = word.toLowerCase().trim();
      this.client.hgetall(Dictionagram.prepare_word(word), (err, reply) => {
          var anagrams = [];
          for (var hash in reply) {
              anagrams.push(hash);
          }
          anagrams.splice(anagrams.indexOf(word), 1);
          cb(anagrams);
      });
  }

  add_word(word) {
      word = word.toLowerCase().trim();
      this.client.hset(Dictionagram.prepare_word(word), word, 1);
  }

  static prepare_word(word) {
      return word.split('').sort().join('');
  }
}

var dictionagram = new Dictionagram(config.redis_url, config.reset_db);

module.exports = dictionagram;

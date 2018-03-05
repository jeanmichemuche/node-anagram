### Node-Anagram Assignment

#### Description

The node-anagram API provides endpoints to work with Anagrams.

> An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

For example, the word 'mary' is an anagram of 'army'. 

#### What is being requested

Two endpoints need to be implemented as part of the assignment:

* GET /find - Given a single word, the endpoint should find all anagrams in the english dictionary. Note that a dependency called 'word-list' is being included as part of the setup and should be used as input for all supported words in the english language.

* GET /compare - Given two words, the endpoint will determine if they are anagrams or not.

See app.js for more details.

#### Considerations
 
You may restructure the code as you see fit (while respecting the provided rules), creating new files and directories as needed.
The solution to the assignment can be sent back as a zip/tar.gz file or a link to a github repo.

Things to take into account while implementing your solution:

* Functionality: endpoints have to work as expected.
* Design & code style: code structure, solution design, extensibility, easy to read & maintain, error handling.
* Performance: code must have good performance (O(n), memory usage, etc). Multiple simultaneous calls per second should be expected for the API.
* Test coverage: some level of unit testing is expected.

#### Rules

1) The existing setup and endpoints should be used. Endpoints should respect existing naming and query param names.
2) The provided word-list (english dictionary) must be used for the english language and cannot be swapped for a different one.
3) When getting anagrams for a given word, the passed word should not be included as part of the result. Ie: for 'cat' it should return ['act'] and not ['cat', 'act'].
4) The API must be served @localhost:3001 when running npm start.

#### Bonus points

You can tackle as many bonus points as want/can, they are not mandatory but welcomed.

* Create a new endpoint called find-longest. The endpoint should return an array containing the longest anagrams for the given dictionary. Single dictionary words (no anagrams) should be excluded.
* Add support for multiple dictionaries (english remains default if not specified).
* Add support to list, add and remove words from the supported dictionaries.
* Add support for phrases, not just single words. Ie: 'rail safety' -> ['fairy tales'].

#### How to run (locally)

`nvm use` ( or install node 8.9 )

`npm install`

`npm start` ( or run directly via `node app.js` )

Make sure you have Redis running.

#### How to run (Docker containers)

`docker build -t node-anagram .`

`docker run --name redis -p 6379:6379 -d redis`

`docker run --name node-anagram --link redis -p 3001:3001 --env REDIS_URL=redis://redis:6379 node-anagram`

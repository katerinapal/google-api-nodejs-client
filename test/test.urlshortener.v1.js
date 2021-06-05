import ext_assert_assert from "assert";
import ext_nock_nock from "nock";
/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

ext_nock_nock.disableNetConnect();

describe('Urlshortener', function() {

  function noop() {}

  it('should generate a valid payload for single requests', function() {
    var google = new googleapis.GoogleApis();
    var urlshortener = google.urlshortener('v1');
    var obj = { longUrl: 'http://someurl...' };

    var req = urlshortener.url.insert(obj, noop);
    ext_assert_assert.equal(req.uri.href, 'https://www.googleapis.com/urlshortener/v1/url?longUrl=http%3A%2F%2Fsomeurl...');
    ext_assert_assert.equal(req.method, 'POST');
  });

  it('should generate valid payload if any params are given', function() {
    var google = new googleapis.GoogleApis();
    var urlshortener = google.urlshortener('v1');
    var params = { shortUrl: 'a' };
    var req = urlshortener.url.get(params, noop);
    ext_assert_assert.equal(req.uri.href, 'https://www.googleapis.com/urlshortener/v1/url?shortUrl=a');
    ext_assert_assert.equal(req.method, 'GET');
  });

  it('should return a single response object for single requests', function(done) {
    var google = new googleapis.GoogleApis();
    var scope = ext_nock_nock('https://www.googleapis.com')
        .post('/urlshortener/v1/url')
        .replyWithFile(200, __dirname + '/fixtures/urlshort-insert-res.json');
    var urlshortener = google.urlshortener('v1');
    var obj = { longUrl: 'http://google.com/' };
    urlshortener.url.insert({ resource: obj }, function(err, result) {
      ext_assert_assert.equal(err, null);
      ext_assert_assert.notEqual(result, null);
      ext_assert_assert.notEqual(result.kind, null);
      ext_assert_assert.notEqual(result.id, null);
      ext_assert_assert.equal(result.longUrl, 'http://google.com/');
      scope.done();
      done(err);
    });
  });
});

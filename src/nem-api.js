'use strict'

const unirest = require('unirest');
const EventEmitter = require('eventemitter3');
const Promise = require('bluebird');
const fileType = require('file-type');
const request = require('request-promise');
const streamedRequest = require('request');
const qs = require('querystring');
const stream = require('stream');
const mime = require('mime');
const path = require('path');
const URL = require('url');

module.exports = class nodeis extends EventEmitter {

  constructor(endpoint) {
    super();
    this.endpoint = endpoint;
  }

  heartbeat() {
    return this._request('heartbeat', {});
  }

  _request(_path, options = {}) {
    if (!this.endpoint) {
      throw new Error('NIS endpoint not provided!');
    }

    options.url = this._buildURL(_path);
    options.simple = false;
    options.resolveWithFullResponse = true;
    return request(options)
      .then(resp => {
        if (resp.statusCode !== 200) {
          throw new Error(`${resp.statusCode} ${resp.body}`);
        }

        const data = this._safeParse(resp.body);
        return data.result;
        throw new Error(`${data.error_code} ${data.description}`);
      });
  }

  _buildURL(_path) {
    return URL.format({
      protocol: 'http',
      host: this.endpoint,
      pathname: `/${_path}`
    });
  }

  _safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (err) {
      throw new Error(`Error parsing NIS response: ${String(json)}`);
    }
  }
}

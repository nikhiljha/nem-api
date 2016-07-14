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

module.exports = class nisapi extends EventEmitter {

  constructor(endpoint) {
    super();
    this.endpoint = endpoint;
  }

  heartbeat() {
    return this._request('heartbeat', {});
  }

  status() {
    return this._request('status', {});
  }

  account() {
    return this._request('account', {}); // Useless, added because why not.
  }

  account_generate() {
    return this._request('account/generate', {});
  }

  account_get(address) {
    return this._request('account/get', { qs: { address: address } });
  }

  account_get_frompublickey(key) {
    return this._request('account/get/from-public-key', { qs: { publicKey: key } });
  }

  account_get_forwarded(address) {
    return this._request('account/get/forwarded', { qs: { address: address } });
  }

  account_get_forwarded_frompublickey(key) {
    return this._request('account/get/forwarded/from-public-key', { qs: { publicKey: key } });
  }

  account_status(address) {
    return this._request('account/status', { qs: { address: address } });
  }

  account_transfers_incoming(address, hash, id) {
    return this._request('account/transfers/incoming', { qs: { address: address, hash: hash, id: id } });
  }

  account_transfers_outgoing(address, hash, id) {
    return this._request('account/transfers/outgoing', { qs: { address: address, hash: hash, id: id } });
  }

  account_transfers_all(address, hash, id) {
    return this._request('account/transfers/all', { qs: { address: address, hash: hash, id: id } });
  }

  account_unconfirmedTransactions(address) {
    return this._request('account/unconfirmedTransactions', { qs: { address: address } });
  }

  account_harvests(address, hash) {
    return this._request('account/transfers/all', { qs: { address: address, hash: hash } });
  }

  account_importances(address, hash) {
    return this._request('account/importances', {});
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
        return data;
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

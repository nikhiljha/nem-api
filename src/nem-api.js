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

  account_get_namespace_page(address, parent, id, pageSize) {
    return this._request('/account/namespace/page', { qs: { address: address, parent: parent, id: id, pagesize: pagesize } });
  }

  account_get_mosaic_definition_page(address, parent, id) {
    return this._request('/account/mosaic/definition/page', { qs: { address: address, parent: parent, id: id } });
  }

  account_get_mosaic_owned(address) {
    return this._request('/account/mosaic/owned', { qs: { address: address } });
  }

  account_post_unlock(privateKey) {
    return this._request('/account/unlock', { qs: { privateKey: privateKey } });
  }

  account_post_lock(privateKey) {
    return this._request('/account/lock', { qs: { privateKey: privateKey } });
  }

  account_post_unlocked_info() {
    return this._request('/account/unlocked/info', {});
  }

  account_get_historical_get(address, startHeight, endHeight, increment) {
    return this._request('/account/historical/get', { qs: { address: address, startHeight: startHeight, endHeight: endHeight, increment: increment } });
  }

  chain_get_height() {
    return this._request('/chain/height', {});
  }

  chain_get_score() {
    return this._request('/chain/score', {});
  }

  chain_get_last_block() {
    return this._request('/chain/last-block', {});
  }

  block_get_get(blockHash) {
    return this._request('/block/get', { qs: { blockHash: blockHash } });
  }

  block_post_at_public(blockHeight) {
    return this._request('/block/at/public', { qs: { blockHeight: blockHeight } });
  }

  local_post_chain_blocks_after(blockHeight) {
    return this._request('/local/chain/blocks-after', { qs: { blockHeight: blockHeight } });
  }

  node_get_info() {
    return this._request('/node/info', {});
  }

  node_get_extended_info() {
    return this._request('/node/extended-info', {});
  }

  node_get_peer_list_all() {
    return this._request('/node/peer-list/all', {});
  }

  node_get_peer_list_reachable() {
    return this._request('/node/peer-list/reachable', {});
  }

  node_get_peer_list_active() {
    return this._request('/node/peer-list/active', {});
  }

  node_get_active_peers_max_chain_height() {
    return this._request('/node/active-peers/max-chain-height', {});
  }

  node_get_experiences() {
    return this._request('/node/experiences', {});
  }

  node_post_boot(bootNodeRequest ) {
    return this._request('/node/boot', { qs: { bootNodeRequest: bootNodeRequest } });
  }

  namespace_get_root_page(id, pagesize) {
    return this._request('/namespace/root/page', { qs: { id: id, pagesize: pagesize } });
  }

  namespace_get(namespace) {
    return this._request('/namespace', { qs: { namespace: namespace } });
  }

  namespace_get_mosaic_definition_page(namespace, id, pagesize) {
    return this._request('/namespace/mosaic/definition/page', { qs: { namespace: namespace, id: id, pagesize: pagesize } });
  }

  transaction_post_prepare_announce(requestPrepareAnnounce) {
    return this._request('/transaction/prepare-announce', { qs: { requestPrepareAnnounce: requestPrepareAnnounce } });
  }

  transaction_post_announce(requestAnnounce) {
    return this._request('/transaction/announce', { qs: { requestAnnounce: requestAnnounce } });
  }

  debug_get_time_synchronization() {
    return this._request('/debug/time-synchronization', {});
  }

  debug_get_connections_incoming() {
    return this._request('/debug/connections/incoming', {});
  }

  debug_get_connections_outgoing() {
    return this._request('/debug/connections/outgoing', {});
  }

  debug_get_connections_timers() {
    return this._request('/debug/connections/timers', {});
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

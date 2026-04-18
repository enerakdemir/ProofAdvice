/**
 * Client-side report persistence & share encoding (demo / MVP).
 * Production: replace with POST /reports + GET /reports/:id on your API.
 */
(function initCertPathReportPersistence(global) {
  'use strict';

  const HISTORY_KEY = 'certpath-report-history-v1';
  const MAX_ITEMS = 25;
  const SHARE_VERSION = 1;
  /** ~45k safe for many browsers as fragment */
  const MAX_HASH_CHARS = 45000;

  function bytesToBase64Url(u8) {
    let binary = '';
    for (let i = 0; i < u8.length; i++) {
      binary += String.fromCharCode(u8[i]);
    }
    return global.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function base64UrlToBytes(str) {
    let s = str.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) {
      s += '=';
    }
    const bin = global.atob(s);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      u8[i] = bin.charCodeAt(i);
    }
    return u8;
  }

  function readHistoryRaw() {
    try {
      const raw = global.localStorage.getItem(HISTORY_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeHistoryRaw(list) {
    global.localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
  }

  function listHistory() {
    return readHistoryRaw().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * @param {object} snapshot - Serializable report snapshot (see app.js)
   */
  function saveToHistory(snapshot) {
    const list = readHistoryRaw();
    const id = snapshot.id || (global.crypto?.randomUUID?.() || `r-${Date.now()}`);
    const record = {
      ...snapshot,
      id,
      createdAt: snapshot.createdAt || new Date().toISOString()
    };
    const filtered = list.filter((item) => item.id !== id);
    filtered.unshift(record);
    writeHistoryRaw(filtered);
    return record;
  }

  function getHistoryById(id) {
    return readHistoryRaw().find((item) => item.id === id) || null;
  }

  function deleteHistoryById(id) {
    writeHistoryRaw(readHistoryRaw().filter((item) => item.id !== id));
  }

  /**
   * Encode { locale, profile, aiAnalysis } for URL hash (gzip when supported).
   * Engine output is recomputed on the read-only page from profile.
   */
  async function encodeSharePayload(payload) {
    const body = JSON.stringify({ v: SHARE_VERSION, ...payload });
    const enc = new TextEncoder().encode(body);

    if (typeof CompressionStream !== 'undefined') {
      const stream = new Blob([enc]).stream().pipeThrough(new CompressionStream('gzip'));
      const buf = await new Response(stream).arrayBuffer();
      const b64 = bytesToBase64Url(new Uint8Array(buf));
      if (b64.length <= MAX_HASH_CHARS) {
        return { format: 'gz', data: b64, tooLong: false };
      }
    }

    const raw = bytesToBase64Url(enc);
    return {
      format: 'raw',
      data: raw,
      tooLong: raw.length > MAX_HASH_CHARS,
      length: raw.length
    };
  }

  async function decodeSharePayload(encoded, format) {
    const u8 = base64UrlToBytes(encoded);
    let jsonBytes = u8;

    if (format === 'gz' && typeof DecompressionStream !== 'undefined') {
      const stream = new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip'));
      jsonBytes = new Uint8Array(await new Response(stream).arrayBuffer());
    }

    const text = new TextDecoder().decode(jsonBytes);
    const obj = JSON.parse(text);
    if (!obj || obj.v !== SHARE_VERSION || !obj.profile) {
      throw new Error('Invalid share payload');
    }
    return obj;
  }

  global.CertPathReportPersistence = {
    HISTORY_KEY,
    listHistory,
    saveToHistory,
    getHistoryById,
    deleteHistoryById,
    encodeSharePayload,
    decodeSharePayload,
    MAX_HASH_CHARS
  };
}(typeof window !== 'undefined' ? window : globalThis));

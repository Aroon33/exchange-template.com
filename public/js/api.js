// js/api.js

// APIのベースURL（必要に応じて http → https に切り替え）
const API_BASE_URL = 'https://api.exchange-template.com';

// 共通fetchラッパ（Cookieを送受信する）
async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const defaultOptions = {
    credentials: 'include', // Cookie送受信
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    let errorText = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.message) {
        errorText = data.message;
      }
    } catch (e) {
      // ignore
    }
    throw new Error(errorText);
  }

  // JSON返すAPIを前提にする
  return response.json();
}

// ログインAPI
async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// /auth/me
async function fetchCurrentUser() {
  return apiRequest('/auth/me', {
    method: 'GET',
  });
}

// /wallet
async function fetchWallet() {
  return apiRequest('/wallet', {
    method: 'GET',
  });
}

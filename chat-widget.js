/* =====================================================
   chat-widget.js — AI Chatbot Mường Thanh via n8n
   ===================================================== */

// ===== CONFIG =====
// Thay N8N_WEBHOOK_URL bằng URL webhook thật của n8n sau khi deploy
const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/hotel-chat';

// ===== STATE =====
let chatOpen    = false;
let sessionId   = 'sess_' + Math.random().toString(36).slice(2);
let isTyping    = false;
let messageHistory = [];

// ===== BUILD UI =====
(function buildWidget() {
  const style = document.createElement('style');
  style.textContent = `
    #mt-chat-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #c9a96e, #a8823e);
      border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(201,169,110,0.4);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.3s, box-shadow 0.3s;
      font-size: 1.5rem;
    }
    #mt-chat-btn:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(201,169,110,0.55); }
    #mt-chat-btn .badge {
      position: absolute; top: -4px; right: -4px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #e05555; color: #fff; font-size: 0.6rem;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; display: none;
    }

    #mt-chat-box {
      position: fixed; bottom: 96px; right: 28px; z-index: 9998;
      width: 360px; max-height: 520px;
      background: #111; border: 1px solid rgba(201,169,110,0.2);
      border-radius: 16px; display: flex; flex-direction: column;
      box-shadow: 0 12px 48px rgba(0,0,0,0.6);
      transform: translateY(20px) scale(0.96); opacity: 0;
      pointer-events: none; transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
      font-family: 'Inter', sans-serif;
    }
    #mt-chat-box.open {
      transform: translateY(0) scale(1); opacity: 1; pointer-events: all;
    }

    #mt-chat-header {
      padding: 1rem 1.2rem; border-bottom: 1px solid rgba(201,169,110,0.15);
      display: flex; align-items: center; gap: 0.8rem; flex-shrink: 0;
    }
    .chat-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(201,169,110,0.15); border: 1px solid rgba(201,169,110,0.35);
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; flex-shrink: 0;
    }
    .chat-header-info { flex: 1; }
    .chat-header-name { font-size: 0.82rem; font-weight: 600; color: #f5f0ea; }
    .chat-header-status {
      font-size: 0.66rem; color: #6fcf97;
      display: flex; align-items: center; gap: 0.3rem; margin-top: 0.1rem;
    }
    .chat-header-status::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%;
      background: #6fcf97; display: inline-block;
    }
    #mt-chat-close {
      background: none; border: none; cursor: pointer;
      color: rgba(245,240,234,0.4); font-size: 1rem;
      transition: color 0.2s; padding: 0.2rem;
    }
    #mt-chat-close:hover { color: #f5f0ea; }

    #mt-chat-messages {
      flex: 1; overflow-y: auto; padding: 1rem;
      display: flex; flex-direction: column; gap: 0.75rem;
      scrollbar-width: thin; scrollbar-color: rgba(201,169,110,0.2) transparent;
    }
    #mt-chat-messages::-webkit-scrollbar { width: 4px; }
    #mt-chat-messages::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.2); border-radius: 2px; }

    .chat-msg {
      max-width: 85%; padding: 0.65rem 0.9rem;
      border-radius: 12px; font-size: 0.8rem; line-height: 1.5;
      animation: msgIn 0.2s ease;
    }
    @keyframes msgIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }

    .chat-msg.bot {
      background: rgba(255,255,255,0.06); color: #e8e3db;
      border: 1px solid rgba(255,255,255,0.07); align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .chat-msg.user {
      background: rgba(201,169,110,0.15); color: #f5f0ea;
      border: 1px solid rgba(201,169,110,0.2); align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    .chat-typing {
      display: flex; gap: 4px; align-items: center;
      padding: 0.65rem 0.9rem; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 12px; border-bottom-left-radius: 4px;
      align-self: flex-start;
    }
    .chat-typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(201,169,110,0.6); display: inline-block;
      animation: dot 1.2s infinite;
    }
    .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
    .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dot { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

    #mt-chat-input-row {
      padding: 0.75rem 1rem; border-top: 1px solid rgba(201,169,110,0.12);
      display: flex; gap: 0.5rem; flex-shrink: 0;
    }
    #mt-chat-input {
      flex: 1; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(201,169,110,0.18); border-radius: 8px;
      padding: 0.55rem 0.75rem; color: #f5f0ea; font-size: 0.78rem;
      font-family: inherit; outline: none; resize: none;
      transition: border-color 0.2s;
    }
    #mt-chat-input:focus { border-color: rgba(201,169,110,0.5); }
    #mt-chat-input::placeholder { color: rgba(245,240,234,0.25); }
    #mt-chat-send {
      width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
      background: rgba(201,169,110,0.2); border: 1px solid rgba(201,169,110,0.3);
      color: #c9a96e; cursor: pointer; display: flex; align-items: center;
      justify-content: center; transition: all 0.2s; font-size: 0.9rem;
    }
    #mt-chat-send:hover { background: rgba(201,169,110,0.35); }
    #mt-chat-send:disabled { opacity: 0.35; cursor: not-allowed; }

    .chat-quick-replies {
      display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.4rem;
    }
    .chat-quick-btn {
      font-size: 0.68rem; padding: 0.3rem 0.65rem;
      border: 1px solid rgba(201,169,110,0.3); border-radius: 20px;
      background: transparent; color: #c9a96e; cursor: pointer;
      transition: all 0.2s; white-space: nowrap;
    }
    .chat-quick-btn:hover { background: rgba(201,169,110,0.12); }

    @media (max-width: 480px) {
      #mt-chat-box { width: calc(100vw - 24px); right: 12px; bottom: 80px; }
      #mt-chat-btn { right: 16px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', `
    <button id="mt-chat-btn" aria-label="Chat với chúng tôi">
      💬
      <span class="badge" id="chatBadge">1</span>
    </button>

    <div id="mt-chat-box" role="dialog" aria-label="Chat hỗ trợ Mường Thanh">
      <div id="mt-chat-header">
        <div class="chat-avatar">🏨</div>
        <div class="chat-header-info">
          <div class="chat-header-name">Trợ Lý Mường Thanh</div>
          <div class="chat-header-status">Trực tuyến</div>
        </div>
        <button id="mt-chat-close" aria-label="Đóng chat">✕</button>
      </div>
      <div id="mt-chat-messages"></div>
      <div id="mt-chat-input-row">
        <textarea id="mt-chat-input" rows="1" placeholder="Nhập câu hỏi của bạn..."></textarea>
        <button id="mt-chat-send" aria-label="Gửi">➤</button>
      </div>
    </div>
  `);

  document.getElementById('mt-chat-btn').addEventListener('click', toggleChat);
  document.getElementById('mt-chat-close').addEventListener('click', closeChat);
  document.getElementById('mt-chat-send').addEventListener('click', sendMessage);
  document.getElementById('mt-chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  // Show welcome message after short delay
  setTimeout(showWelcome, 800);
})();

// ===== TOGGLE =====
function toggleChat() {
  chatOpen ? closeChat() : openChat();
}
function openChat() {
  chatOpen = true;
  document.getElementById('mt-chat-box').classList.add('open');
  document.getElementById('mt-chat-btn').innerHTML = '✕<span class="badge" id="chatBadge" style="display:none">1</span>';
  document.getElementById('chatBadge') && (document.getElementById('chatBadge').style.display = 'none');
  setTimeout(() => document.getElementById('mt-chat-input').focus(), 300);
}
function closeChat() {
  chatOpen = false;
  document.getElementById('mt-chat-box').classList.remove('open');
  document.getElementById('mt-chat-btn').innerHTML = '💬<span class="badge" id="chatBadge" style="display:none">1</span>';
}

// ===== WELCOME =====
function showWelcome() {
  appendBotMessage(
    'Xin chào! Tôi là trợ lý ảo của Mường Thanh. Tôi có thể giúp bạn về đặt phòng, giá cả, tiện nghi hoặc các dịch vụ của chúng tôi. 😊',
    [
      'Xem khách sạn tại Đà Nẵng',
      'Chính sách hủy phòng',
      'Khuyến mãi hiện có',
      'Liên hệ hỗ trợ',
    ]
  );
  // Show badge
  const badge = document.getElementById('chatBadge');
  if (badge) badge.style.display = 'flex';
}

// ===== MESSAGES =====
function appendBotMessage(text, quickReplies = []) {
  const msgs = document.getElementById('mt-chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.textContent = text;

  if (quickReplies.length) {
    const qr = document.createElement('div');
    qr.className = 'chat-quick-replies';
    quickReplies.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'chat-quick-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        qr.remove();
        submitMessage(label);
      });
      qr.appendChild(btn);
    });
    div.appendChild(qr);
  }

  msgs.appendChild(div);
  scrollToBottom();
  messageHistory.push({ role: 'assistant', content: text });
}

function appendUserMessage(text) {
  const msgs = document.getElementById('mt-chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.textContent = text;
  msgs.appendChild(div);
  scrollToBottom();
  messageHistory.push({ role: 'user', content: text });
}

function showTyping() {
  const msgs = document.getElementById('mt-chat-messages');
  const el = document.createElement('div');
  el.className = 'chat-typing';
  el.id = 'typingIndicator';
  el.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(el);
  scrollToBottom();
}

function hideTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function scrollToBottom() {
  const msgs = document.getElementById('mt-chat-messages');
  msgs.scrollTop = msgs.scrollHeight;
}

// ===== SEND =====
function sendMessage() {
  const input = document.getElementById('mt-chat-input');
  const text = input.value.trim();
  if (!text || isTyping) return;
  input.value = '';
  submitMessage(text);
}

async function submitMessage(text) {
  appendUserMessage(text);
  isTyping = true;
  document.getElementById('mt-chat-send').disabled = true;
  showTyping();

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        sessionId,
        history: messageHistory.slice(-10), // gửi 10 tin nhắn gần nhất làm context
      }),
    });

    const data = await res.json();
    hideTyping();
    appendBotMessage(data.reply || data.output || 'Xin lỗi, tôi không nhận được phản hồi. Vui lòng thử lại.');

  } catch (err) {
    hideTyping();
    appendBotMessage('Đã xảy ra lỗi kết nối. Vui lòng thử lại hoặc liên hệ hotline của chúng tôi.');
  }

  isTyping = false;
  document.getElementById('mt-chat-send').disabled = false;
}

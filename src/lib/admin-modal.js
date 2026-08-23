// === Admin Modals Controller for Payment & Room Editing ===
let activeRoomId = null;

function openPaymentModal(roomId) {
  activeRoomId = roomId;
  const period = getCurrentPeriod();
  const rooms = getRoomsData();
  const room = rooms.find(r => r.id === roomId);
  const modal = document.getElementById('payment-modal');
  const title = document.getElementById('modal-room-title');
  const dateInput = document.getElementById('pay-date');

  if (!room || !modal) return;
  title.textContent = `Pembukuan Kamar ${room.id} (${room.tenant})`;
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  renderLedgerHistory(room, period);
  modal.classList.remove('hidden');
}

function renderLedgerHistory(room, period) {
  const payments = getPaymentsData(period).filter(p => p.roomId === room.id);
  const list = document.getElementById('modal-ledger-list');
  const paidSum = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = Math.max(0, room.rate - paidSum);

  document.getElementById('modal-summary-paid').textContent = formatCurrency(paidSum);
  document.getElementById('modal-summary-rem').textContent = formatCurrency(remaining);

  if (!list) return;
  list.innerHTML = '';

  if (payments.length === 0) {
    list.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem;">Belum ada cicilan masuk untuk bulan ini.</div>';
    return;
  }

  payments.forEach(p => {
    const item = document.createElement('div');
    item.className = 'ledger-item';
    item.innerHTML = `
      <div>
        <div class="ledger-item-date">${p.date} • ${formatCurrency(p.amount)}</div>
        <div class="ledger-item-note">${p.note}</div>
      </div>
      <div>
        <button class="btn btn-secondary btn-sm" onclick="triggerWA('${p.id}')">📲 WA</button>
        <button class="ledger-del-btn" onclick="handleDeletePay('${p.id}')">🗑️</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) modal.classList.add('hidden');
  activeRoomId = null;
  renderAdminDashboard();
}

function handleDeletePay(payId) {
  if (confirm('Hapus catatan pembayaran ini?')) {
    const period = getCurrentPeriod();
    deletePayment(period, payId);
    const rooms = getRoomsData();
    const room = rooms.find(r => r.id === activeRoomId);
    if (room) renderLedgerHistory(room, period);
    renderAdminDashboard();
  }
}

function triggerWA(payId) {
  const period = getCurrentPeriod();
  const payments = getPaymentsData(period);
  const pay = payments.find(p => p.id === payId);
  const rooms = getRoomsData();
  const room = rooms.find(r => r.id === activeRoomId);
  if (pay && room) {
    const roomPays = payments.filter(p => p.roomId === room.id);
    const totalPaid = roomPays.reduce((acc, curr) => acc + curr.amount, 0);
    sendWhatsAppReceipt(room, pay, totalPaid, room.rate, period);
  }
}

// Handle Form Submit for New Payment
document.addEventListener('DOMContentLoaded', () => {
  const payForm = document.getElementById('payment-form');
  if (payForm) {
    payForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = document.getElementById('pay-amount').value;
      const note = document.getElementById('pay-note').value;
      const date = document.getElementById('pay-date').value;
      const sendWaChecked = document.getElementById('pay-send-wa').checked;
      const period = getCurrentPeriod();

      const newPay = addPayment(period, activeRoomId, amount, note, date);
      const rooms = getRoomsData();
      const room = rooms.find(r => r.id === activeRoomId);

      if (sendWaChecked && room) {
        const payments = getPaymentsData(period).filter(p => p.roomId === room.id);
        const totalPaid = payments.reduce((acc, curr) => acc + curr.amount, 0);
        sendWhatsAppReceipt(room, newPay, totalPaid, room.rate, period);
      }

      document.getElementById('pay-amount').value = '';
      document.getElementById('pay-note').value = '';
      if (room) renderLedgerHistory(room, period);
      renderAdminDashboard();
    });
  }
});

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
        <button class="btn btn-secondary btn-sm" onclick="triggerWA('${p.id}')" style="display:inline-flex; align-items:center; gap:4px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.135.56 4.139 1.536 5.882l-1.636 5.977 6.136-1.61c1.703.929 3.644 1.451 5.71 1.451 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/></svg>
          WA
        </button>
        <button class="ledger-del-btn" onclick="handleDeletePay('${p.id}')" title="Hapus Pembayaran" style="display:inline-flex; align-items:center; justify-content:center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
        </button>
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

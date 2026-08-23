// === Admin Ledger Calculations and UI Rendering ===
function getCurrentPeriod() {
  const periodInput = document.getElementById('filter-period');
  if (periodInput && periodInput.value) return periodInput.value;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function renderAdminDashboard() {
  const period = getCurrentPeriod();
  const rooms = getRoomsData();
  const payments = getPaymentsData(period);

  let totalIncome = 0;
  let totalPending = 0;
  let totalOccupied = 0;

  const gridContainer = document.getElementById('rooms-grid');
  if (!gridContainer) return;
  gridContainer.innerHTML = '';

  rooms.forEach(room => {
    if (room.occupied) totalOccupied++;
    const roomPayments = payments.filter(p => p.roomId === room.id);
    const paidSum = roomPayments.reduce((acc, curr) => acc + curr.amount, 0);
    const targetRate = room.rate;
    const remaining = Math.max(0, targetRate - paidSum);

    let statusText = 'KOSONG';
    let statusClass = 'status-kosong';
    let percent = 0;

    if (room.occupied) {
      totalIncome += paidSum;
      totalPending += remaining;
      percent = Math.min(100, Math.round((paidSum / targetRate) * 100));

      if (paidSum >= targetRate) {
        statusText = 'Lunas';
        statusClass = 'status-lunas';
      } else if (paidSum > 0) {
        statusText = 'Dicicil';
        statusClass = 'status-cicil';
      } else {
        statusText = 'Belum Bayar';
        statusClass = 'status-belum';
      }
    }

    const card = document.createElement('div');
    card.className = 'room-admin-card';
    card.innerHTML = `
      <div class="room-card-head">
        <div class="room-number-badge">Kamar ${room.id}</div>
        <span class="room-status-badge ${statusClass}">${statusText}</span>
      </div>
      <div class="tenant-info">
        <div class="tenant-name">${room.occupied ? room.tenant : 'Kamar Kosong'}</div>
        <div class="tenant-meta">${room.occupied ? `Jatuh tempo tgl ${room.dueDay} • ${formatCurrency(room.rate)}/bln` : 'Siap huni'}</div>
      </div>
      ${room.occupied ? `
        <div class="progress-section">
          <div class="progress-labels">
            <span>Masuk: ${formatCurrency(paidSum)}</span>
            <span>Sisa: ${formatCurrency(remaining)}</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill ${percent < 100 && percent > 0 ? 'warning' : ''}" style="width: ${percent}%;"></div>
          </div>
        </div>
      ` : ''}
      <div class="room-card-actions">
        ${room.occupied ? `
          <button class="btn btn-secondary btn-sm" onclick="openPaymentModal('${room.id}')" style="display:inline-flex; align-items:center; justify-content:center; gap:6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Bayar / Cicil
          </button>
        ` : ''}
        <button class="btn btn-secondary btn-sm" onclick="openEditRoomModal('${room.id}')" style="display:inline-flex; align-items:center; justify-content:center; gap:6px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
          Edit Kamar
        </button>
      </div>
    `;
    gridContainer.appendChild(card);
  });

  // Update Overview Stats
  const elIncome = document.getElementById('stat-total-income');
  const elPending = document.getElementById('stat-total-pending');
  const elOccupied = document.getElementById('stat-occupied-rooms');

  if (elIncome) elIncome.textContent = formatCurrency(totalIncome);
  if (elPending) elPending.textContent = formatCurrency(totalPending);
  if (elOccupied) elOccupied.textContent = `${totalOccupied} / 9 Kamar`;
}

window.renderAdminDashboard = renderAdminDashboard;
document.addEventListener('DOMContentLoaded', () => {
  const periodInput = document.getElementById('filter-period');
  if (periodInput) {
    periodInput.value = getCurrentPeriod();
    periodInput.addEventListener('change', renderAdminDashboard);
  }
  if (isUserAuthenticated()) renderAdminDashboard();
});

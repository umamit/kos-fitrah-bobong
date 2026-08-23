// === Data Store with Cloud Sync (Supabase + Local Fallback) ===
const STORE_KEY = 'kosfitrah_rooms_data';

const DEFAULT_ROOMS = [
  { id: '01', type: 'basic', rate: 600000, tenant: 'Budi Santoso', phone: '08123456789', dueDay: 5, occupied: true },
  { id: '02', type: 'basic', rate: 600000, tenant: 'Ahmad Fauzi', phone: '08129876543', dueDay: 10, occupied: true },
  { id: '03', type: 'basic', rate: 600000, tenant: '', phone: '', dueDay: 1, occupied: false },
  { id: '04', type: 'comfort', rate: 700000, tenant: 'Dewi Lestari', phone: '08131122334', dueDay: 1, occupied: true },
  { id: '05', type: 'comfort', rate: 700000, tenant: 'Rian Pratama', phone: '08529988776', dueDay: 15, occupied: true },
  { id: '06', type: 'breeze', rate: 750000, tenant: 'Siti Rahma', phone: '08781234567', dueDay: 20, occupied: true },
  { id: '07', type: 'breeze', rate: 750000, tenant: '', phone: '', dueDay: 1, occupied: false },
  { id: '08', type: 'vip', rate: 1000000, tenant: 'Dr. Hendra Wijaya', phone: '08112233445', dueDay: 1, occupied: true },
  { id: '09', type: 'vip', rate: 1000000, tenant: 'Irfan Hakim', phone: '08139988776', dueDay: 25, occupied: true }
];

function getRoomsData() {
  const data = localStorage.getItem(STORE_KEY);
  if (!data) {
    saveRoomsData(DEFAULT_ROOMS);
    return DEFAULT_ROOMS;
  }
  try { return JSON.parse(data); } catch (e) { return DEFAULT_ROOMS; }
}

function saveRoomsData(rooms) {
  localStorage.setItem(STORE_KEY, JSON.stringify(rooms));
  // Background cloud sync
  if (typeof supabaseFetch === 'function') {
    rooms.forEach(r => {
      supabaseFetch('rooms', {
        method: 'POST',
        prefer: 'resolution=merge-duplicates',
        body: { id: r.id, type: r.type, rate: r.rate, tenant: r.tenant, phone: r.phone, due_day: r.dueDay, occupied: r.occupied }
      });
    });
  }
}

function getPaymentsData(period) {
  const data = localStorage.getItem(`kosfitrah_payments_${period}`);
  return data ? JSON.parse(data) : [];
}

function savePaymentsData(period, payments) {
  localStorage.setItem(`kosfitrah_payments_${period}`, JSON.stringify(payments));
}

function addPayment(period, roomId, amount, note, date) {
  const payments = getPaymentsData(period);
  const newPayment = {
    id: 'pay_' + Date.now(),
    roomId,
    amount: parseInt(amount) || 0,
    note: note || 'Cicilan sewa',
    date: date || new Date().toISOString().split('T')[0]
  };
  payments.push(newPayment);
  savePaymentsData(period, payments);

  // Background cloud sync
  if (typeof supabaseFetch === 'function') {
    supabaseFetch('payments', {
      method: 'POST',
      body: { id: newPayment.id, room_id: newPayment.roomId, period, amount: newPayment.amount, note: newPayment.note, date: newPayment.date }
    });
  }
  return newPayment;
}

function deletePayment(period, paymentId) {
  let payments = getPaymentsData(period);
  payments = payments.filter(p => p.id !== paymentId);
  savePaymentsData(period, payments);

  if (typeof supabaseFetch === 'function') {
    supabaseFetch('payments', {
      method: 'DELETE',
      query: `?id=eq.${paymentId}`
    });
  }
}

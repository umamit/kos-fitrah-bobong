// === Rental Cost Calculator & Booking Logic ===
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('booking-form');
  const roomSelect = document.getElementById('tipe-kamar');
  const cycleSelect = document.getElementById('jenis-sewa');
  const durationInput = document.getElementById('durasi');
  const entryDateInput = document.getElementById('tanggal-masuk');

  const summaryUnitPrice = document.getElementById('summary-unit-price');
  const summaryTotal = document.getElementById('summary-total');

  if (!form || !roomSelect || !cycleSelect || !durationInput) return;

  const pricingData = {
    basic: { day: 100000, month: 600000, year: 6600000 },
    comfort: { day: 100000, month: 700000, year: 7700000 },
    breeze: { day: 100000, month: 750000, year: 8250000 },
    vip: { day: 150000, month: 1000000, year: 11000000 }
  };

  const roomLabels = {
    basic: 'Standard Lite (Basic)',
    comfort: 'Eco Comfort (Standard Plus)',
    breeze: 'Eco Breeze (Standard Premium)',
    vip: 'Executive VIP (Deluxe AC)'
  };

  function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }

  function calculateCosts() {
    const roomType = roomSelect.value;
    const rentCycle = cycleSelect.value;
    const duration = parseInt(durationInput.value) || 1;

    const selectedPricing = pricingData[roomType] || pricingData.basic;
    const unitPrice = rentCycle === 'hari' ? selectedPricing.day : (rentCycle === 'bulan' ? selectedPricing.month : selectedPricing.year);
    const totalCost = unitPrice * duration;

    summaryUnitPrice.textContent = `${formatRupiah(unitPrice)} / ${rentCycle}`;
    summaryTotal.textContent = formatRupiah(totalCost);
    return { unitPrice, totalCost, duration, rentCycle, roomType };
  }

  roomSelect.addEventListener('change', calculateCosts);
  cycleSelect.addEventListener('change', () => {
    const durationLabel = document.querySelector('label[for="durasi"]');
    if (durationLabel) {
      if (cycleSelect.value === 'tahun') durationLabel.textContent = 'Durasi Sewa (Tahun)';
      else if (cycleSelect.value === 'hari') durationLabel.textContent = 'Durasi Sewa (Hari)';
      else durationLabel.textContent = 'Durasi Sewa (Bulan)';
    }
    calculateCosts();
  });
  durationInput.addEventListener('input', calculateCosts);

  // Set default minimum date to today
  if (entryDateInput) {
    const today = new Date().toISOString().split('T')[0];
    entryDateInput.setAttribute('min', today);
    entryDateInput.value = today;
  }

  // Initial calculation
  calculateCosts();

  // Room Showcase Card Select Buttons
  document.querySelectorAll('.select-room-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const roomType = e.target.getAttribute('data-room');
      roomSelect.value = roomType;
      const calcSection = document.getElementById('kalkulator');
      if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth' });
      calculateCosts();
    });
  });

  // Submit via WhatsApp
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('nama').value.trim();
    const entryDate = entryDateInput ? entryDateInput.value : '';
    const { totalCost, duration, rentCycle, roomType } = calculateCosts();

    const formattedRoom = roomLabels[roomType] || roomType;
    const formattedCycle = rentCycle === 'hari' ? 'Hari' : (rentCycle === 'bulan' ? 'Bulan' : 'Tahun');
    const formattedDate = entryDate ? new Date(entryDate).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : '-';

    const whatsappMessage = `Halo Pengelola Kos Fitrah Bobong,

Saya ingin mengajukan pemesanan kamar kos dengan detail berikut:
• Nama: ${name}
• Tipe Kamar: Kamar ${formattedRoom}
• Durasi Sewa: ${duration} ${formattedCycle}
• Rencana Masuk: ${formattedDate}

Estimasi Biaya Sewa:
• Total Biaya Sewa: ${formatRupiah(totalCost)} (${duration} ${formattedCycle})

Apakah unit kamar tipe tersebut masih tersedia untuk rencana tanggal masuk saya? Terima kasih.`;

    const phoneNumber = '6281357001357';
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, '_blank');
  });
});

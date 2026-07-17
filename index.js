document.addEventListener('DOMContentLoaded', () => {
  // === Theme Toggle Logic ===
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  
  // Set default theme from localStorage or system preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', initialTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // === Mobile Navigation Menu ===
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // === Form Cost Calculator ===
  const form = document.getElementById('booking-form');
  const roomSelect = document.getElementById('tipe-kamar');
  const cycleSelect = document.getElementById('jenis-sewa');
  const durationInput = document.getElementById('durasi');
  const entryDateInput = document.getElementById('tanggal-masuk');

  const summaryUnitPrice = document.getElementById('summary-unit-price');
  const summaryDeposit = document.getElementById('summary-deposit');
  const summaryTotal = document.getElementById('summary-total');

  // Prices and Deposits configurations
  const pricingData = {
    basic: {
      month: 600000,
      year: 6600000,
      deposit: 200000
    },
    comfort: {
      month: 700000,
      year: 7700000,
      deposit: 200000
    },
    breeze: {
      month: 750000,
      year: 8250000,
      deposit: 200000
    },
    vip: {
      month: 1000000,
      year: 11000000,
      deposit: 500000
    }
  };

  // Format number to Indonesian Rupiah currency style
  function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }

  function calculateCosts() {
    const roomType = roomSelect.value;
    const rentCycle = cycleSelect.value; // 'bulan' or 'tahun'
    const duration = parseInt(durationInput.value) || 1;

    const selectedPricing = pricingData[roomType];
    const unitPrice = rentCycle === 'bulan' ? selectedPricing.month : selectedPricing.year;
    const deposit = selectedPricing.deposit;

    const rentCost = unitPrice * duration;
    const totalCost = rentCost + deposit;

    // Update UI elements
    summaryUnitPrice.textContent = `${formatRupiah(unitPrice)} / ${rentCycle}`;
    summaryDeposit.textContent = formatRupiah(deposit);
    summaryTotal.textContent = formatRupiah(totalCost);
  }

  // Event Listeners for interactive calculator updates
  roomSelect.addEventListener('change', calculateCosts);
  cycleSelect.addEventListener('change', () => {
    // Modify labels based on cycle selection
    if (cycleSelect.value === 'tahun') {
      durationInput.setAttribute('min', '1');
      if (durationInput.value === '0') durationInput.value = '1';
    }
    calculateCosts();
  });
  durationInput.addEventListener('input', calculateCosts);

  // Set default minimum date to today for entry date
  const today = new Date().toISOString().split('T')[0];
  entryDateInput.setAttribute('min', today);
  entryDateInput.value = today;

  // Run initial calculation
  calculateCosts();

  // === Room Showcase Card Buttons ===
  const selectRoomBtns = document.querySelectorAll('.select-room-btn');
  
  selectRoomBtns.forEach(button => {
    button.addEventListener('click', (e) => {
      const roomType = e.target.getAttribute('data-room');
      
      // Auto-select room in calculator
      roomSelect.value = roomType;
      
      // Scroll to calculator
      const calcSection = document.getElementById('kalkulator');
      calcSection.scrollIntoView({ behavior: 'smooth' });
      
      // Re-trigger calculation
      calculateCosts();
    });
  });

  // === Submit Booking via WhatsApp ===
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('nama').value.trim();
    const roomType = roomSelect.value;
    const rentCycle = cycleSelect.value;
    const duration = parseInt(durationInput.value) || 1;
    const entryDate = entryDateInput.value;

    const selectedPricing = pricingData[roomType];
    const unitPrice = rentCycle === 'bulan' ? selectedPricing.month : selectedPricing.year;
    const deposit = selectedPricing.deposit;
    const totalCost = (unitPrice * duration) + deposit;

    let formattedRoom = '';
    if (roomType === 'basic') formattedRoom = 'Standard Lite (Basic)';
    else if (roomType === 'comfort') formattedRoom = 'Eco Comfort (Standard Plus)';
    else if (roomType === 'breeze') formattedRoom = 'Eco Breeze (Standard Premium)';
    else if (roomType === 'vip') formattedRoom = 'Executive VIP (Deluxe AC)';
    const formattedCycle = rentCycle === 'bulan' ? 'Bulan' : 'Tahun';
    const formattedDate = new Date(entryDate).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Generate neat text message (handcrafted look, polite Indonesian)
    const whatsappMessage = `Halo Pengelola Kos Fitrah Bobong,

Saya ingin mengajukan pemesanan kamar kos dengan detail berikut:
• Nama: ${name}
• Tipe Kamar: Kamar ${formattedRoom}
• Durasi Sewa: ${duration} ${formattedCycle}
• Rencana Masuk: ${formattedDate}

Estimasi Biaya Awal:
• Sewa Unit: ${formatRupiah(unitPrice * duration)} (${duration} ${formattedCycle})
• Uang Jaminan (Deposit): ${formatRupiah(deposit)}
• Total Tagihan Awal: ${formatRupiah(totalCost)}

Apakah unit kamar tipe tersebut masih tersedia untuk rencana tanggal masuk saya? Terima kasih.`;

    // Target phone number (Bapak Fitrah) - placeholder as approved
    const phoneNumber = '6281357001357';
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
  });
});

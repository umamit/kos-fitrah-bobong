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
  const summaryTotal = document.getElementById('summary-total');

  // Prices configurations (No deposit)
  const pricingData = {
    basic: {
      day: 100000,
      month: 600000,
      year: 6600000
    },
    comfort: {
      day: 100000,
      month: 700000,
      year: 7700000
    },
    breeze: {
      day: 100000,
      month: 750000,
      year: 8250000
    },
    vip: {
      day: 150000,
      month: 1000000,
      year: 11000000
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
    const rentCycle = cycleSelect.value; // 'hari', 'bulan', or 'tahun'
    const duration = parseInt(durationInput.value) || 1;

    const selectedPricing = pricingData[roomType];
    const unitPrice = rentCycle === 'hari' ? selectedPricing.day : (rentCycle === 'bulan' ? selectedPricing.month : selectedPricing.year);

    const totalCost = unitPrice * duration;

    // Update UI elements
    summaryUnitPrice.textContent = `${formatRupiah(unitPrice)} / ${rentCycle}`;
    summaryTotal.textContent = formatRupiah(totalCost);
  }

  // Event Listeners for interactive calculator updates
  roomSelect.addEventListener('change', calculateCosts);
  cycleSelect.addEventListener('change', () => {
    // Modify label of duration dynamically based on selected cycle
    const durationLabel = document.querySelector('label[for="durasi"]');
    if (cycleSelect.value === 'tahun') {
      durationLabel.textContent = 'Durasi Sewa (Tahun)';
    } else if (cycleSelect.value === 'hari') {
      durationLabel.textContent = 'Durasi Sewa (Hari)';
    } else {
      durationLabel.textContent = 'Durasi Sewa (Bulan)';
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
    const unitPrice = rentCycle === 'hari' ? selectedPricing.day : (rentCycle === 'bulan' ? selectedPricing.month : selectedPricing.year);
    const totalCost = unitPrice * duration;

    let formattedRoom = '';
    if (roomType === 'basic') formattedRoom = 'Standard Lite (Basic)';
    else if (roomType === 'comfort') formattedRoom = 'Eco Comfort (Standard Plus)';
    else if (roomType === 'breeze') formattedRoom = 'Eco Breeze (Standard Premium)';
    else if (roomType === 'vip') formattedRoom = 'Executive VIP (Deluxe AC)';
    const formattedCycle = rentCycle === 'hari' ? 'Hari' : (rentCycle === 'bulan' ? 'Bulan' : 'Tahun');
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

Estimasi Biaya Sewa:
• Total Biaya Sewa: ${formatRupiah(totalCost)} (${duration} ${formattedCycle})

Apakah unit kamar tipe tersebut masih tersedia untuk rencana tanggal masuk saya? Terima kasih.`;

    // Target phone number (Ona) - placeholder as approved
    const phoneNumber = '6281357001357';
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
  });

  // === FAQ Accordion Toggle ===
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = question.nextElementSibling;
      const isActive = item.classList.contains('active');
      
      // Close other active FAQ items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});


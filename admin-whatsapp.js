// === WhatsApp Receipt & Rekap Generator ===
function formatCurrency(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

function sendWhatsAppReceipt(room, payment, totalPaid, targetRate, period) {
  if (!room.phone) {
    alert('Nomor WhatsApp penghuni belum diatur.');
    return;
  }

  const sisa = Math.max(0, targetRate - totalPaid);
  const statusStr = sisa === 0 ? 'LUNAS ✅' : `BELUM LUNAS (Sisa: ${formatCurrency(sisa)}) ⏳`;
  
  // Format period into Indonesian month name
  const [year, month] = period.split('-');
  const dateObj = new Date(year, parseInt(month) - 1, 1);
  const periodStr = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const message = `*KWITANSI PEMBAYARAN KOS FITRAH* 🏠
============================
Kepada Yth: *${room.tenant}*
Kamar: *No. ${room.id}*
Periode: *${periodStr}*

*Rincian Pembayaran:*
• Tanggal: ${payment.date}
• Jumlah Diterima: *${formatCurrency(payment.amount)}*
• Keterangan: ${payment.note}

*Status Tagihan Bulan Ini:*
• Total Tagihan: ${formatCurrency(targetRate)}
• Total Sudah Dibayar: ${formatCurrency(totalPaid)}
• Status: *${statusStr}*

Terima kasih atas pembayaran Anda.
_Pengelola Kos Fitrah Bobong_`;

  let cleanPhone = room.phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }

  const whatsappURL = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
}

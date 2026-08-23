// === Edit Room Details Controller ===
function openEditRoomModal(roomId) {
  const rooms = getRoomsData();
  const room = rooms.find(r => r.id === roomId);
  const modal = document.getElementById('edit-room-modal');
  if (!room || !modal) return;

  document.getElementById('edit-room-id').value = room.id;
  document.getElementById('edit-room-title').textContent = `Pengaturan Kamar ${room.id}`;
  document.getElementById('edit-tenant-name').value = room.tenant || '';
  document.getElementById('edit-tenant-phone').value = room.phone || '';
  document.getElementById('edit-monthly-rate').value = room.rate || 600000;
  document.getElementById('edit-due-day').value = room.dueDay || 1;
  document.getElementById('edit-occupied').checked = !!room.occupied;

  modal.classList.remove('hidden');
}

function closeEditRoomModal() {
  const modal = document.getElementById('edit-room-modal');
  if (modal) modal.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const editForm = document.getElementById('edit-room-form');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const roomId = document.getElementById('edit-room-id').value;
      const rooms = getRoomsData();
      const roomIndex = rooms.findIndex(r => r.id === roomId);

      if (roomIndex !== -1) {
        rooms[roomIndex].tenant = document.getElementById('edit-tenant-name').value.trim();
        rooms[roomIndex].phone = document.getElementById('edit-tenant-phone').value.trim();
        rooms[roomIndex].rate = parseInt(document.getElementById('edit-monthly-rate').value) || 600000;
        rooms[roomIndex].dueDay = parseInt(document.getElementById('edit-due-day').value) || 1;
        rooms[roomIndex].occupied = document.getElementById('edit-occupied').checked;

        saveRoomsData(rooms);
        closeEditRoomModal();
        renderAdminDashboard();
      }
    });
  }
});

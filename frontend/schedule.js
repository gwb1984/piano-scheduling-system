async function loadAvailableSlots() {
    const response = await fetch('/api/available-slots');
    const slots = await response.json();
    const slotsList = document.getElementById('slots');
    slotsList.innerHTML = '';
    slots.forEach(slot => {
        const li = document.createElement('li');
        li.textContent = `${slot.start} - ${slot.end}`;
        slotsList.appendChild(li);
    });
}

async function scheduleLesson() {
    const time = document.getElementById('time').value;
    await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time })
    });
    alert('Lesson scheduled!');
    loadAvailableSlots();
}

window.onload = loadAvailableSlots;
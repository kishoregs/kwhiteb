document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('whiteboard');
  const context = canvas.getContext('2d');
  let isDrawing = false;
  let penColor = '#000000';
  let isColorPickerVisible = false;

  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 120;

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);

  function startDrawing(e) {
    isDrawing = true;
    draw(e);
  }

  function stopDrawing() {
    isDrawing = false;
    context.beginPath();
  }

  function draw(e) {
    if (!isDrawing) return;

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = penColor;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  }

  const controlsContainer = document.querySelector('.controls');

  controlsContainer.addEventListener('click', handleControlsClick);

  function handleControlsClick(e) {
    const target = e.target;

    if (target.id === 'colorPickerIcon') {
      e.stopPropagation();
      toggleColorPicker();
    } else if (target.id === 'clearBtn') {
      clearCanvas();
    }
  }

  function toggleColorPicker() {
    isColorPickerVisible = !isColorPickerVisible;
    const colorPickerContainer = document.getElementById('colorPicker');
    colorPickerContainer.style.display = isColorPickerVisible ? 'flex' : 'none';
    if (isColorPickerVisible) {
      const colorInput = document.getElementById("colorInput");
      colorInput.click(); // Trigger the click event on the color input
    }
  }

  const colorConfirm = document.getElementById('colorInput');
  colorConfirm.addEventListener('change', confirmColor);

  function confirmColor() {
    penColor = colorConfirm.value;
    const colorPickerContainer = document.getElementById('colorPicker');
    toggleColorPicker();
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
});

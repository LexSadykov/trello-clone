document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.column');
    const addCardButtons = document.querySelectorAll('.add-card');
  
    const loadState = () => {
      const state = JSON.parse(localStorage.getItem('boardState')) || { column1: [], column2: [], column3: [] };
      columns.forEach((column, index) => {
        const columnId = `column${index + 1}`;
        const cardsContainer = column.querySelector('.cards');
        cardsContainer.innerHTML = '';
        state[columnId].forEach((cardText) => {
          const card = createCard(cardText);
          cardsContainer.appendChild(card);
        });
      });
    };
  
    const saveState = () => {
      const state = {};
      columns.forEach((column, index) => {
        const columnId = `column${index + 1}`;
        const cards = [...column.querySelector('.cards').children].map(card => card.textContent);
        state[columnId] = cards;
      });
      localStorage.setItem('boardState', JSON.stringify(state));
    };
  
    const createCard = (text) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.textContent = text;
      card.addEventListener('click', () => {
        card.remove();
        saveState();
      });
      card.setAttribute('draggable', true);
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', text);
        e.target.classList.add('dragging');
      });
  
      card.addEventListener('dragend', () => {
        document.querySelectorAll('.card').forEach(card => card.classList.remove('dragging'));
        saveState();
      });
  
      return card;
    };
  
    addCardButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const cardText = prompt('Enter card text:');
        if (cardText) {
          const card = createCard(cardText);
          columns[index].querySelector('.cards').appendChild(card);
          saveState();
        }
      });
    });
  
    columns.forEach((column) => {
      column.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingCard = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(column, e.clientY);
        if (afterElement === null) {
          column.querySelector('.cards').appendChild(draggingCard);
        } else {
          column.querySelector('.cards').insertBefore(draggingCard, afterElement);
        }
        saveState();
      });
    });
  
    const getDragAfterElement = (column, y) => {
      const draggableElements = [...column.querySelectorAll('.card:not(.dragging)')];
      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
          }
          return closest;
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    };
  
    loadState();
  });
  
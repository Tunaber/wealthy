import React, { useCallback, useRef, useState } from 'react';
import { NotificationsNoneRounded } from '@mui/icons-material';

const demoNotifications = [
  { id: 1, icon: '✳', title: 'Цель «Отпуск мечты» на 68%', text: 'Осталось отложить ещё 48 000 ₽ до конца года.', time: 'сейчас' },
  { id: 2, icon: '📈', title: 'Курс доллара обновился', text: 'USD/RUB изменился на +0,4% — конвертер уже пересчитал курсы.', time: '1 час назад' },
  { id: 3, icon: '💰', title: 'Напоминание: подписка', text: 'Завтра списание 599 ₽ за музыкальный сервис. Обновить траты?', time: 'вчера' },
];

const NotificationsBell = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(demoNotifications);
  const rootRef = useRef(null);

  const dismiss = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = () => setItems([]);

  return (
    <div className="fin-bell" ref={rootRef}>
      <button
        className="fin-notification"
        aria-label="Уведомления"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <NotificationsNoneRounded />
        {items.length > 0 && <span className="fin-notification__badge">{items.length}</span>}
      </button>

      {open && (
        <>
          <button className="fin-bell-backdrop" aria-label="Закрыть уведомления" onClick={() => setOpen(false)} />
          <div className="fin-bell-panel">
            <div className="fin-bell-panel__header">
              <strong>Уведомления</strong>
              {items.length > 0 && <button onClick={clearAll}>Очистить</button>}
            </div>
            {items.length === 0 ? (
              <div className="fin-bell-panel__empty">Уведомлений пока нет. Отдыхайте ✳</div>
            ) : (
              items.map((item) => (
                <div className="fin-bell-item" key={item.id}>
                  <span className="fin-bell-item__icon">{item.icon}</span>
                  <div className="fin-bell-item__body">
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                    <small>{item.time}</small>
                  </div>
                  <button className="fin-bell-item__close" onClick={() => dismiss(item.id)} aria-label="Удалить уведомление">×</button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsBell;
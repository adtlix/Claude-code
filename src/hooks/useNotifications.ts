import { useEffect, useRef, useCallback } from 'react';
import type { Task } from '../types';

export function useNotifications() {
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    return () => {
      for (const timer of timersRef.current.values()) clearTimeout(timer);
    };
  }, []);

  const scheduleNotification = useCallback((task: Task) => {
    if (!task.dueTime || Notification.permission !== 'granted') return;

    const [hoursStr, minutesStr] = task.dueTime.split(':');
    const hours = parseInt(hoursStr ?? '0', 10);
    const minutes = parseInt(minutesStr ?? '0', 10);

    const now = new Date();
    const target = new Date(`${task.dayId}T00:00:00`);
    target.setHours(hours, minutes, 0, 0);

    const delay = target.getTime() - now.getTime();
    if (delay <= 0) return;

    const timer = setTimeout(() => {
      new Notification(task.title, {
        body: `Due now · ${task.category}`,
        icon: '/icons/icon-192.png',
      });
      timersRef.current.delete(task.id);
    }, delay);

    timersRef.current.set(task.id, timer);
  }, []);

  const cancelNotification = useCallback((taskId: string) => {
    const timer = timersRef.current.get(taskId);
    if (timer !== undefined) {
      clearTimeout(timer);
      timersRef.current.delete(taskId);
    }
  }, []);

  return { scheduleNotification, cancelNotification };
}

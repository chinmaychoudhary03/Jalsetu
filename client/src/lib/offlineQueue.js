import Dexie from 'dexie';

export const db = new Dexie('jalsathi_offline');
db.version(1).stores({
  queue: '++id, endpoint, method, createdAt, retries'
});

export const addToQueue = async (endpoint, method, payload) => {
  await db.queue.add({
    endpoint,
    method,
    payload,
    createdAt: new Date(),
    retries: 0
  });
};

export const getQueue = async () => {
  return await db.queue.orderBy('createdAt').toArray();
};

export const removeFromQueue = async (id) => {
  await db.queue.delete(id);
};

export const processQueue = async (apiClient) => {
  const queue = await getQueue();
  for (const item of queue) {
    try {
      if (item.method.toUpperCase() === 'POST') {
        await apiClient.post(item.endpoint, item.payload);
      } else if (item.method.toUpperCase() === 'PUT') {
        await apiClient.put(item.endpoint, item.payload);
      }
      await removeFromQueue(item.id);
    } catch (error) {
      console.error('Failed to process offline queue item', item, error);
      await db.queue.update(item.id, { retries: item.retries + 1 });
    }
  }
};

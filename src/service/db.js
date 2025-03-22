// db.js
import Dexie from 'dexie';

export const db = new Dexie('betaBoxDatabase');
db.version(1).stores({
	task: '++id, desc, dueAt',
	tag: '++id, name'
});

// db.js
import Dexie from 'dexie';

export const db = new Dexie('betaBoxDatabase');

db.version(15).stores({
	field_definition: '++id, entity, list, rel_entity',
	list_option: '++id, list, code, label',
	task: '++id, desc, dueAt',
	tag: '++id, name',
	color: '++id, label',
	dummy: '++id, name',
	week: '++id',
	day: '++id, date',
	activity: '++id',
	topic: '++id, name',
	sprint: '++id, name',
	ticket: '++id, title',
	note: '++id, title',
	status: '++id, name',
	connection: '++id',
	content: '++id, name',
	predefined_filter: '++id, name',
});

/*
id
entity
order
field
pk
type
rel_entity
list
multiple
min
max
readonly
picker_col
filter
info
comment
 */

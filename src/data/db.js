// db.js
import Dexie from 'dexie';

export const db = new Dexie('betaBoxDatabase');

db.version(5).stores({
	field_definition: '++id, entity, list, rel_entity',
	list_option: '++id, list, code, label',
	task: '++id, desc, dueAt',
	tag: '++id, name',
	color: '++id, label',
	dummy: '++id, name',
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

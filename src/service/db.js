// db.js
import Dexie from 'dexie';

export const db = new Dexie('betaBoxDatabase');
db.version(1).stores({
	field_definition: '++id, entity, list, rel_entity',
	task: '++id, desc, dueAt',
	tag: '++id, name'
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

export const CONTENT_FIELD_DESC = (options) => {
	return {
		entity: "Ticket",
		field: "content",
		type: "E",
		rel_entity: "Content",
		multiple: true,
		options,
		pk: false,
		readonly: false,
		picker_col: false,
		required: false,
		min: "",
		max: "",
		entityPickerCols: [ "id", "name" ],
		order: 1,
		id: 1
	}
}


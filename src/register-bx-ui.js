import BxIcon from "@/modules/ui/components/BxIcon.vue";
import BxBadge from "@/modules/ui/components/BxBadge.vue";

import BxButton from "@/modules/ui/components/BxButton.vue";
import BxIconButton from "@/modules/ui/components/BxIconButton.vue";

import BxModal from "@/modules/ui/components/BxModal.vue";
import BxNotif from "@/modules/ui/components/BxNotif.vue";

import BxOptionSelector from "@/modules/ui/components/BxOptionSelector.vue";
import BxHoverSelect from "@/modules/ui/components/BxHoverSelect.vue";

import BxForm from "@/modules/ui/components/BxForm/BxForm.vue";
import BxFormField from "@/modules/ui/components/BxForm/BxFormField.vue";
import BxSwitch from "@/modules/ui/components/BxForm/fields/BxSwitch.vue";
import BxEntityPicker from "@/modules/ui/components/BxForm/fields/BxEntityPicker.vue";
import BxDateTimeField from "@/modules/ui/components/BxForm/fields/BxDateTimeField.vue";
import BxTimePicker from "@/modules/ui/components/BxForm/fields/BxTimePicker.vue";
import BxTimeInput from "@/modules/ui/components/BxForm/fields/BxTimeInput.vue";
import BxDurationPicker from "@/modules/ui/components/BxForm/fields/BxDurationPicker.vue";

import BxTable from "@/modules/ui/components/BxTable/BxTable.vue";
import BxTableRow from "@/modules/ui/components/BxTable/BxTableRow.vue";
import BxCalendar from "@/modules/ui/components/BxCalendar/BxCalendar.vue";

export function registerBxUi(app) {
	app.component("BxIcon", BxIcon);
	app.component("BxBadge", BxBadge);
	
	app.component("BxButton", BxButton);
	app.component("BxIconButton", BxIconButton);
	
	app.component("BxModal", BxModal);
	app.component("BxNotif", BxNotif);
	
	app.component("BxOptionSelector", BxOptionSelector);
	app.component("BxHoverSelect", BxHoverSelect);
	
	app.component("BxForm", BxForm);
	app.component("BxFormField", BxFormField);
	app.component("BxSwitch", BxSwitch);
	app.component("BxEntityPicker", BxEntityPicker);
	app.component("BxDateTimeField", BxDateTimeField);
	app.component("BxTimePicker", BxTimePicker);
	app.component("BxTimeInput", BxTimeInput);
	app.component("BxDurationPicker", BxDurationPicker);

	app.component("BxTable", BxTable);
	app.component("BxTableRow", BxTableRow);
	
	app.component("BxCalendar", BxCalendar);
}



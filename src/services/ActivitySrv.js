import store from '@/store';

class ActivitySrv {
	constructor() {
		if (ActivitySrv.instance) {
			return ActivitySrv.instance;
		}
		ActivitySrv.instance = this;
	}

	static getInstance() {
		if (!ActivitySrv.instance) {
			ActivitySrv.instance = new ActivitySrv();
		}
		return ActivitySrv.instance;
	}

	_formatDate(dateString) {
		console.log('Input dateString:', dateString);
		const date = new Date(dateString.replace('@', 'T'));
		console.log('Parsed date:', date);
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
		
		const formatted = `${days[date.getDay()]} - ${months[date.getMonth()]} ${date.getDate()}`;
		console.log('Formatted result:', formatted);
		return formatted;
	}

	_getDays() {
		// this is the format of the days:
		// [{"date":"2025-04-07@00:00","id":1},{"date":"2025-04-08@00:00","id":2}]
		
		if (!store?.state?.entity?.entities?.day) return [];
		
		return store.state.entity.entities.day;
	}

	_hydrateDays(days) {
		// this is the format of the activities:
		// [{"type":"$D","day":"1","description":"hello","tickets":"1","duration":120,"id":14},{"type":"$R","day":"1","description":"daily","url":"localhost:8080/activity","tickets":"","duration":30,"id":15}]

		return days.map(day => ({
			...day,
			formattedDate: this._formatDate(day.date),
			activities: store?.state?.entity?.entities?.activity?.filter(
				activity => activity.day === day.id.toString()
			)
		}));
	}

	getActivities() {
		const days = this._getDays();
		return this._hydrateDays(days);
	}
}

export default ActivitySrv.getInstance(); 


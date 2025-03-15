interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
}

type ActionContext = {
  commit: (type: string, payload?: any) => void;
}

export default {
  namespaced: true,
  
  // notice that state is a function that returns a TaskState object
  // this is because we want to ensure that the state is a fresh object
  // and not a reference to the same object in the store 
  state: (): TaskState => ({
    tasks: [
      {
        id: 1,
        title: 'Hello',
        completed: false
      },
      {
        id: 2,
        title: 'World',
        completed: true
      },
    ]
  }),

  getters: {
    completedTasks: (state: TaskState) => state.tasks.filter(task => task.completed),
    incompleteTasks: (state: TaskState) => state.tasks.filter(task => !task.completed)
  },

  mutations: {
    ADD_TASK(state: TaskState, task: Task) {
      state.tasks.push(task);
    },
    TOGGLE_TASK(state: TaskState, taskId: number) {
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    },
    DELETE_TASK(state: TaskState, taskId: number) {
      state.tasks = state.tasks.filter(t => t.id !== taskId);
    }
  },

  actions: {
    addTask({ commit }: ActionContext, title: string) {
      const task: Task = {
        id: Date.now(),
        title,
        completed: false
      };
      commit('ADD_TASK', task);
    },
    toggleTask({ commit }: ActionContext, taskId: number) {
      commit('TOGGLE_TASK', taskId);
    },
    deleteTask({ commit }: ActionContext, taskId: number) {
      commit('DELETE_TASK', taskId);
    }
  }
} 
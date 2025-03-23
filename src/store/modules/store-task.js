import { dataSrv } from "@/service/DataSrv";
// types
import { DatabaseActionResponse } from "@/types/DatabaseActionResponse";

const TABLE_TASK = "task";

const state = {
    loading: false,
    tasks: [],
}

const getters = {
    getTaskById: (state) => (id) => state.tasks.find(task => task.id === id)
}

const mutations = {
    
    SET_LOADING(state, loading) {
        state.loading = loading
    },
    
    SET_TASKS(state, tasks) {
        state.tasks = tasks
    },

}

const actions = {
    
    /**
     * This is the try...catch wrapper
     * @param commit
     * @param action
     * @returns {Promise<{result: string, message}|*>}
     */
    async execDatabaseAction({ commit }, action) {
        commit('SET_LOADING', true);
        try {
            return await action();
        } catch (e) {
            console.error(e)
            return {
                result: "ERR",
                message: e.message
            }
        } finally {
            commit('SET_LOADING', false)
        }
    },
    
    async loadTasks({ dispatch, commit }) {
        return await dispatch("execDatabaseAction", async () => {
            const tasks = await dataSrv.load(TABLE_TASK);
            commit('SET_TASKS', tasks);
            return new DatabaseActionResponse(true, "tasks successfully loaded");
        });
    },
    
    async addTask({ dispatch }, newTask) {
        return await dispatch("execDatabaseAction", async () => {
            const id = await dataSrv.add(TABLE_TASK, newTask);
            await dispatch("loadTasks");
            return new DatabaseActionResponse(true, `task ${id} added`);
        });
    },
    
    async updateTask({ dispatch }, task) {
        return await dispatch("execDatabaseAction", async () => {
            await dataSrv.update(TABLE_TASK, task);
            await dispatch("loadTasks");
            return new DatabaseActionResponse(true, `task ${task.id} successfully updated`);
        });
    },
    
    /**
     * DELETE and CLEAR
     * @param dispatch
     * @param taskId
     * @param all
     * @returns {Promise<*>}
     */
    async deleteTask({ dispatch }, { taskId, all = false }) {
        return await dispatch("execDatabaseAction", async () => {
            const m = (!taskId && all)
              ? "clear"
              : "delete";
            await dataSrv[m](TABLE_TASK, taskId);
            await dispatch("loadTasks");
            return new DatabaseActionResponse(true, `task #${taskId} deleted`);
        });
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}


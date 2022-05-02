<template>
  <div id="boards-container">
    <v-card
      v-for="(list, i) in taskLists"
      :key="i"
      elevation="0"
      color="#F5F5F5"
      class="todo-card"
    >
      <v-card-title class="board-title"> {{ list.name }}</v-card-title>
      <v-card-text>
        <draggable
          :list="list.tasks"
          class="list-group"
          v-bind="dragOptions"
          group="people"
          @change="updateTask($event, list)"
        >
          <v-card
            class="mb-3 pa-3 list-card"
            color="white"
            light
            v-for="(task, n) in list.tasks"
            :key="n"
            elevation="0"
          >
            {{ task.description }}
          </v-card>
        </draggable>
        <v-card v-if="list.isAddTask" class="list-card" elevation="0">
          <v-card-text
            ><v-form @submit.prevent="addTask(list)"
              ><v-text-field
                v-model="newTaskName"
                label="Description"
                dense
                hide-details
              ></v-text-field>
              <div class="action-buttons">
                <v-btn
                  type="submit"
                  color="#66BB6A"
                  small
                  :disabled="!newTaskName.length"
                  :dark="newTaskName.length !== 0"
                  :loading="isAddTaskLoading"
                  >Add Task</v-btn
                ><v-spacer /><v-btn
                  color="#FF5252"
                  small
                  @click="toggleAddTaskCard(list, false)"
                  dark
                  >Cancel</v-btn
                >
              </div></v-form
            ></v-card-text
          >
        </v-card>
        <v-btn
          v-if="!list.isAddTask"
          color="primary"
          text
          @click="toggleAddTaskCard(list, true)"
          small
        >
          <v-icon>mdi-plus</v-icon>Add Task
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card
      elevation="0"
      color="#F5F5F5"
      v-if="isAddList"
      class="mr-3 todo-card"
    >
      <v-card-text>
        <v-form @submit.prevent="addTaskList()"
          ><v-text-field
            v-model="newListName"
            label="Name"
            hide-details
            dense
            solo
          ></v-text-field>
          <div class="action-buttons">
            <v-btn
              type="submit"
              color="#66BB6A"
              small
              :disabled="!newListName.length"
              :loading="isAddListLoading"
              :dark="newListName.length !== 0"
              >Add List</v-btn
            ><v-spacer /><v-btn
              color="#FF5252"
              small
              @click="isAddList = false"
              dark
              >Cancel</v-btn
            >
          </div>
        </v-form></v-card-text
      >
    </v-card>

    <v-btn
      v-if="!isAddList"
      color="primary"
      text
      @click="isAddList = true"
      small
    >
      <v-icon>mdi-plus</v-icon>Add List
    </v-btn>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { fetchTaskLists, createTaskList } from '@/graphql/TaskList.js'
import { createTask, updateTask } from '@/graphql/Task.js'
import catchErrors from '@/assets/js/catchErrors.js'
export default {
  name: 'IndexPage',
  middleware: ['authenticated'],
  components: {
    draggable,
  },
  apollo: {
    taskLists: {
      query: fetchTaskLists,
      variables() {
        return {
          user_id: this.user.id,
        }
      },
      skip() {
        return this.skipQuery
      },
      result(result) {
        const taskLists = result.data.taskLists
        for (const list of taskLists) {
          list['isAddTask'] = false
        }
        this.taskLists = taskLists
      },
      error(error) {
        console.error(error)
        catchErrors(error, this)
      },
    },
  },
  data: () => ({
    newListName: '',
    newTaskName: '',
    isAddTask: false,
    isAddList: false,
    isAddListLoading: false,
    isAddTaskLoading: false,
    taskLists: [],
    dragOptions: {
      animation: 300,
      disabled: false,
    },
    skipQuery: false,
  }),
  computed: {
    user() {
      return JSON.parse(localStorage.user)
    },
  },
  created() {
    this.$eventBus.$on('skipQuery', () => {
      this.skipQuery = true
    })
  },
  methods: {
    async addTaskList() {
      this.isAddListLoading = true
      this.$apollo
        .mutate({
          mutation: createTaskList,
          variables: {
            user_id: this.user.id,
            name: this.newListName,
          },
        })
        .then((result) => {
          this.$apollo.queries.taskLists.refetch()
          const data = result.data
          if (data.createTaskList.__typename === 'Error') {
            Toast.fire({
              icon: 'warning',
              title: data.createTaskList.message,
            })
          }
          this.newListName = ''
          this.isAddListLoading = false
          this.isAddList = false
        })
        .catch((err) => {
          this.isAddListLoading = false
          console.error(err)
          catchErrors(err, this)
        })
    },

    addTask(taskList) {
      this.isAddTaskLoading = true
      this.$apollo
        .mutate({
          mutation: createTask,
          variables: {
            task_list_id: taskList.id,
            description: this.newTaskName,
          },
        })
        .then((result) => {
          this.$apollo.queries.taskLists.refetch()
          const data = result.data
          if (data.createTask.__typename === 'Error') {
            Toast.fire({
              icon: 'warning',
              title: data.createTask.message,
            })
          }
          this.newTaskName = ''
          this.isAddTaskLoading = false
          this.isAddTask = false
        })
        .catch((err) => {
          this.isAddTask = false
          console.error(err)
          catchErrors(err, this)
        })
    },
    toggleAddTaskCard(list, method) {
      list.isAddTask = method
      this.taskLists.map((tl) => {
        if (tl.id !== list.id) {
          tl.isAddTask = false
        }
      })
      this.$forceUpdate()
    },
    updateTask(event, list) {
      if (event.added) {
        this.$apollo
          .mutate({
            mutation: updateTask,
            variables: {
              task_id: event.added.element.id,
              task_list_id: list.id,
            },
          })
          .then((result) => {
            this.$apollo.queries.taskLists.refetch()
            const data = result.data
            if (data.updateTask.__typename === 'Error') {
              Toast.fire({
                icon: 'warning',
                title: data.updateTask.message,
              })
            }
          })
          .catch((err) => {
            catchErrors(err, this)
            console.error(err)
          })
      }
    },
  },
}
</script>

<style scoped>
#boards-container {
  display: flex;
  overflow-x: scroll;
  width: 100%;
  height: 85vh;
  padding: 5px;
}

.todo-card {
  width: 280px;
  min-width: 280px;
  margin-right: 10px;
  overflow-y: scroll;
}

.list-card {
  box-shadow: 0 1px 4px 0 rgba(108, 108, 108, 0.2) !important;
}

.action-buttons {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.board-title {
  color: #616161;
  font-weight: bold;
  font-size: 1rem;
}
</style>

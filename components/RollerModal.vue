<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <div>
              <label for="manager">经理：</label>
              <select v-model="roller.manager" id="manager">
                <option v-for="m in allManagers" :key="m.id">{{m.name}}</option>
              </select>
            </div>

            <h3>请选择员工：</h3>
            <div class="d-flex flex-wrap">
              <div v-for="emp in allWorkers" :key="emp.id">
                <input
                  type="checkbox"
                  :id="emp.name"
                  :checked="empSelected(emp.name)"
                  @change="empChange(emp.name, $event.target.checked)"
                />
                <label :for="emp.name">{{emp.name}}</label>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('close', roller)">OK</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["allEmps", "selecetedRoller"],
  data() {
    return {
      roller: {
        manager: this.selecetedRoller.manager,
        emps: this.selecetedRoller.emps.slice()
      }
    };
  },
  computed: {
    allManagers: function() {
      return this.allEmps.filter(emp => emp.isManager);
    },
    allWorkers: function() {
      return this.allEmps.filter(emp => !emp.isManager);
    }
  },
  methods: {
    empChange: function(name, checked) {
      if (checked) {
        this.roller.emps.push({ name: name, tasks: [] });
      } else {
        this.roller.emps = this.roller.emps.filter(e => e.name != name);
      }
    },
    empSelected: function(name) {
      return this.roller.emps.some(e => e.name == name);
    }
  }
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
<template>
  <div>
    <div class="row">
      <div class="col-sm-2">
        <button class="btn btn-primary" @click="load">读取</button>
        <button class="btn btn-primary" @click="prevWeek">前一周</button>
      </div>
      <div class="col-sm">
        <h1>{{shop.name}} {{week}}</h1>
      </div>
      <div class="col-sm-2">
        <button class="btn btn-primary" @click="nextWeek">下一周</button>
        <button class="btn btn-primary" @click="save">保存</button>
      </div>
    </div>
    <div class="row">
      <div v-for="day in weekDays" :key="day" class="col-sm border">
        <button class="btn btn-primary" @click="editDay = day">{{day}}</button>
        <span>({{getRoller(day).emps.length}})</span>
      </div>
    </div>
    <div class="row">
      <div v-for="day in weekDays" :key="day" class="col-sm border">
        <span v-if="getRoller(day).manager != ''">经理：{{getRoller(day).manager}}</span>
        <div v-for="emp in getRoller(day).emps" :key="emp.name">
          <button @click="removeEmp(day, emp.name)">x</button>
          <span>{{emp.name}}</span>
        </div>
      </div>
    </div>
    <RollerModal
      v-if="editDay != 0"
      :allEmps="$options.allEmps"
      :selecetedRoller="getRoller(editDay)"
      @close="finishEditRoller"
    />
    <TaskModal
      v-if="editEmpTask"
      :allTasks="$options.allTasks"
      :selectedTasks="editEmpTask.tasks"
      @close="finishEditTask"
    />
    <div>
      <button @click="schedule">分配任务</button>
      <button @click="print" v-if="weekRoller.length">打印</button>
    </div>
    <div :id="'taskGrid' + shop.id" class="task-grid" v-if="weekRoller.length">
      <h3>{{shop.name}} {{week}}</h3>
      <div class="row">
        <div class="col-sm border"></div>
        <div v-for="day in weekDays" :key="day" class="col-sm border">
          <span>{{day}}</span>
        </div>
      </div>
      <div class="row" v-for="e in weekRoller" :key="e">
        <div class="col-sm border">
          <span class="task-e">{{e}}</span>
        </div>
        <div
          v-for="day in weekDays"
          :key="day"
          class="col-sm border task-row"
          @click="startEditTask(e, day)"
        >
          <span class="task-content" v-if="isWorker(e, day)">X</span>
          <span class="task-content" v-if="isManager(e, day)">0</span>
          <span class="task-content" v-for="t in getWorkerTasks(e, day)" :key="t.id">{{t.name}}</span>
        </div>
      </div>
      <p class="footer">*“擦”包括按摩床脸洞，床下，所有营业区域台面 *“备品”为做活相关耗材，如按摩油，纸等 *“毛巾”为所有与洗、晾相关工作</p>
      <p class="footer">* 负责厨房清洁请重点擦洗冰箱和微波炉 *消毒请于营业前和1-2pm之间进行两次 *最后到的人洗热石锅</p>
    </div>
  </div>
</template>

<script>
import RollerModal from "./RollerModal.vue";
import TaskModal from "./TaskModal.vue";
import ALL_TASKS from "../json/tasks.json";
import ALL_EMPS from "../json/employees.json";
import TEST_DATA from "../json/test.json";

export default {
  allTasks: ALL_TASKS,
  allEmps: ALL_EMPS,
  noRepeat: 3,
  dayRate: 0.05,
  components: { RollerModal, TaskModal},
  props: ["shop"],
  data() {
    return {
      currentDate: new Date(),
      weekDays: ["一", "二", "三", "四", "五", "六", "日"],
      dayRoller: Array.apply(null, { length: 7 }).map(function() {
        return {
          manager: "",
          emps: []
        };
      }),
      editDay: "",
      editEmpTask: null,
      weekRoller: []
    };
  },

  computed: {
    week: function() {
      function formatDate(date) {
        return (
          (date.getMonth() + 1).toString() + "." + date.getDate().toString()
        );
      }
      var date = new Date(this.currentDate);
      return (
        formatDate(new Date(date.setDate(date.getDate() - date.getDay() + 1))) +
        " - " +
        formatDate(new Date(date.setDate(date.getDate() + 6)))
      );
    }
  },

  methods: {
    load() {
      this.dayRoller = TEST_DATA;
    },
    save() {},
    nextWeek() {
      this.currentDate = new Date(
        this.currentDate.setDate(this.currentDate.getDate() + 7)
      );
    },
    prevWeek() {
      this.currentDate = new Date(
        this.currentDate.setDate(this.currentDate.getDate() - 7)
      );
    },
    finishEditRoller(roller) {
      this.dayRoller[this.weekDays.indexOf(this.editDay)] = roller;
      this.editDay = "";
    },
    startEditTask(name, day) {
      this.editEmpTask = this.getWorkerRecord(name, day);
    },
    finishEditTask(tasks) {
      console.log(this.editEmpTask);
      this.editEmpTask.tasks = tasks;
      this.editEmpTask = null;
    },
    getRoller(day) {
      return this.dayRoller[this.weekDays.indexOf(day)];
    },
    removeEmp(day, name) {
      this.getRoller(day).emps = this.getRoller(day).emps.filter(
        e => e.name != name
      );
    },
    isWorker(name, day) {
      return this.getRoller(day).emps.some(e => e.name == name);
    },
    isManager(name, day) {
      return this.getRoller(day).manager == name;
    },
    getWorkerRecord(name, day) {
      return this.getRoller(day).emps.find(e => e.name == name);
    },
    getWorkerTasks(name, day) {
      const emp = this.getWorkerRecord(name, day);
      return emp ? emp.tasks : [];
    },
    getWeekRoller() {
      var r = [];
      function add(e) {
        if (e != "" && r.indexOf(e) < 0) {
          r.push(e);
        }
      }
      this.dayRoller.forEach(r => {
        r.emps.forEach(e => {
          add(e.name);
        });
      });
      return r;
    },
    schedule() {
      this.weekRoller = this.getWeekRoller();
      this.clearTasks();
      this.allocTasks();
    },
    clearTasks() {
      this.dayRoller.forEach(r => {
        r.emps.forEach(e => (e.tasks = []));
      });
    },
    getWorkLoad(name, day, task) {
      const baseLoad = this.$options.allEmps.find(e => e.name == name).baseLoad;
      return (
        (baseLoad ? baseLoad : 0) +
        this.dayRoller.reduce((l, r, i) => {
          const emp = r.emps.find(e => e.name == name);
          const rate =
            i == this.weekDays.indexOf(day) ? 1 : this.$options.dayRate;
          return (
            l +
            (emp
              ? emp.tasks.reduce(
                  (tl, t) =>
                    tl +
                    t.load * (t.name == task.name ? this.$options.noRepeat : 1),
                  0
                ) * rate
              : 0)
          );
        }, 0)
      );
    },
    allocTasks() {
      //order desc by reserve, then load
      function getDayTasks(day) {
        return ALL_TASKS.filter(t => !t.manual && (!t.days || t.days.indexOf(day) >= 0)).sort(
          (a, b) => {
            return a.reserve
              ? -1
              : b.reserve
              ? 1
              : b.load == a.load
              ? Math.random() - Math.random()
              : b.load - a.load;
          }
        );
      }
      //get reserved emps if exists, otherwise ignore emps not for the task
      function getTaskable(task, emps) {
        var r = [];
        if (task.reserve) {
          r = emps.filter(e => task.reserve.indexOf(e.name) >= 0);
        }
        if (r.length) {
          return r;
        }
        r = emps.filter(e => !task.notFor || task.notFor.indexOf(e.name) < 0);
        if (r.length) {
          return r;
        }
        return emps;
      }
      //allocate next task to the most available employee
      function getLeastLoadEmps(emps, day, task, getWorkLoad) {
        var r = [];
        var ll = 999;
        emps.forEach(e => {
          const l = getWorkLoad(e.name, day, task);
          if (l < ll) {
            r = [e];
            ll = l;
          } else if (l == ll) {
            r.push(e);
          }
        });
        return r;
      }
      function allocate(task, taskableEmps) {
        var r = taskableEmps.filter(
          e => !e.tasks.some(t => t.name == task.name)
        );
        if (!r.length) {
          r = taskableEmps;
        }
        r[Math.floor(Math.random() * taskableEmps.length)].tasks.push(task);
      }
      this.weekDays.forEach(day => {
        const emps = this.getRoller(day).emps;
        if (emps.length) {
          getDayTasks(day).forEach(t => {
            allocate(
              t,
              getLeastLoadEmps(getTaskable(t, emps), day, t, this.getWorkLoad)
            );
          });
        }
      });
    },
    print() {
      // Get HTML to print from element
      const prtHtml = document.getElementById("taskGrid" + this.shop.id)
        .innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style')
      ]) {
        stylesHtml += node.outerHTML;
      }

      stylesHtml += `
      <style>
      @media print {
@page { size: A4 landscape; }


}
      </style>
      `;
      // Open the print window
      const WinPrint = window.open(
        "",
        "",
        "left=50,top=50,width=800,height=900,toolbar=0,scrollbars=0,status=0"
      );

      WinPrint.document.write(`<!DOCTYPE html>
<html>
  <head>
    ${stylesHtml}
  </head>
  <body>
    ${prtHtml}
  </body>
</html>`);

// var css = '',
//     head = WinPrint.document.getElementsByTagName('head')[0],
//     style = WinPrint.document.createElement('style');

// style.type = 'text/css';
// style.media = 'print';

// if (style.styleSheet){
//   style.styleSheet.cssText = css;
// } else {
//   style.appendChild(WinPrint.document.createTextNode(css));
// }

// head.appendChild(style);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },

print2(){
  const options = {
  "styles": [
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    "https://unpkg.com/kidlat-css/css/kidlat.css",
    "./landscape.css"
  ]
};

    this.$htmlToPaper("taskGrid" + this.shop.id, options);
  }
  }
};
</script>

<style scoped>
div.task-grid span {
  font-size: 10px;
}

p.footer {
  font-size: 14px;
  margin: 0;
  padding: 0;
}

/* task-row div {
  padding-top: 0px 0px;
} */

span.task-content {
  margin-right: 11px;
  font-size: 10px;
}

/* span.task-e {
  font-size: 14px;
} */

</style>




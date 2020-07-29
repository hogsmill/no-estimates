<template>
  <div class="my-name" v-if="!showAbout">
    <div class="my-name text-right">
      <button class="btn btn-sm btn-secondary smaller-font" v-if="!myName" @click="show">Set My Name</button>
      <span v-if="myName" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">I am: {{myName.name}}</span>
      <div class="effort-div" v-if="myName">
        <div v-for="n in myEffort.available" :key="n" class="effort rounded-circle"
          :class="getClass(n)">{{n}}</div>
      </div>
      <div v-for="n in myEffort.assigned" :key="n" class="effort rounded-circle used">0</div>
    </div>

    <modal name="set-my-name" :height="120" :classes="['rounded', 'set-my-name']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Name</h4>
        <div class="set-my-name">
          <input type="text" id="my-name" class="form-control" />
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveMyName">Save</button>
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  props: [
    'socket'
  ],
  methods: {
    getClass(n) {
    var className = ''
      if (n > this.myEffort.available) {
        className = 'used'
      } else if (this.myEffort.role) {
        className = this.myEffort.role.toLowerCase()
      } else {
        className = 'no-role'
      }
      return className
    },
    show () {
      this.$modal.show('set-my-name');
    },
    hide () {
      this.$modal.hide('set-my-name');
    },
    saveMyName: function() {
      var oldName = this.myName
      var newName = document.getElementById('my-name').value
      var myNameData
      if (!oldName.id) {
        var uuid = uuidv4()
        myNameData = {id: uuid, name: newName}
        this.$store.dispatch("setMyName", myNameData)
      } else {
        myNameData = {id: this.myName.id, name: newName}
        this.$store.dispatch("changeName", {name: newName})
        this.socket.emit("changeName", {gameName: this.gameName, name: oldName, newName: newName})
      }
      localStorage.setItem("myName", JSON.stringify(myNameData));
      this.hide()
    }
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    myEffort() {
      return this.$store.getters.getMyEffort
    },
    teams() {
      return this.$store.getters.getTeams
    }
  }
}
</script>

<style lang="scss">

  @import '../assets/colours.scss';

  .my-name {
    padding: 0 6px;
    display: inline-block;

    .effort-div {
      display: inline-block;

      .no-role {
        background-color: #aaa;
      }
    }

    .effort {
      display: inline-block;
      color: #fff;
      width: 20px;
      text-align: center;
      margin-left: 2px;
      background-image: none;

      &.used {
        border: 1px solid #aaa;
        background-color: #fff;
        color: #fff;
        height: 21px;
      }
    }

    .designer {
      background-color: $design;
    }
    .developer {
      background-color: $develop;
    }
    .tester {
      background-color: $test;
    }
    .deployer {
      background-color: $deploy;
    }

    }

  .set-my-name {
    height: 120px;

    #my-name {
      display: inline-block;
      width: 30%;
      margin-right: 6px;
    }
  }

</style>

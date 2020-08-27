<template>
  <div class="my-name" v-if="!showFacilitator && gameName">
    <div class="my-name text-right">
      <button class="btn btn-sm btn-secondary smaller-font" v-if="!myName.id" @click="show">Set My Name</button>
      <span v-if="myName.id" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">My Name is: {{myName.name}} <Captain v-bind:captain="myName.captain" /></span>
      <div class="effort-div" v-if="myName.id">
        <div v-for="n in myEffort.available" :key="n" class="effort rounded-circle"
          :class="getClass(n)">{{n}}</div>
      </div>
      <div v-for="n in myEffort.assigned" :key="n" class="effort rounded-circle used">0</div>
    </div>

    <modal name="set-my-name" :height="140" :classes="['rounded', 'set-my-name']">
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
          <div>I am the team Captain <input type="checkbox" id="captain"></div>
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

import Captain from "./specialities/Captain.vue";

export default {
  components: {
    Captain
  },
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
      var captain = document.getElementById('captain').checked
      var myNameData
      if (!oldName.id) {
        var uuid = uuidv4()
        myNameData = {id: uuid, name: newName, captain: captain}
        this.$store.dispatch("setMyName", myNameData)
      } else {
        myNameData = {id: this.myName.id, name: newName, captain: captain}
        this.$store.dispatch("changeName", {name: newName})
        localStorage.setItem("myName", JSON.stringify(myNameData));
        if (this.gameName) {
          this.socket.emit("changeName", {gameName: this.gameName, name: oldName, newName: newName})
        }
      }
      this.hide()
    }
  },
  computed: {
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    myEffort() {
      return this.$store.getters.getMyEffort
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

  .captain {
    color: darkorange;
  }

  .set-my-name {
    height: 140px;

    #my-name {
      display: inline-block;
      width: 30%;
      margin-right: 6px;
    }
  }

</style>

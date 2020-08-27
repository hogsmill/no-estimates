<template>
  <div>

    <table class="roles">
      <tr>
        <td class="role" :class="role.role.toLowerCase()" v-for="(role, index) in roles" :key="index">
          <div v-for="(name, m) in roles[index].names" :key="'name-' + m">
            {{name.name}} <Captain v-bind:captain="name.captain" />
            <span v-if="name.effort">({{name.effort.available}})</span>
          </div>
          <div v-for="(otherName, n) in roles[index].otherNames" :key="'otherName-' + n">(<i>{{otherName.name}}</i>)</div>
        </td>
      </tr>
    </table>

  </div>
</template>

<script>
import Captain from "./specialities/Captain.vue";

export default {
  components: {
    Captain
  },
  computed: {
    roles() {
      return this.$store.getters.getRoles
    }
  }
}
</script>

<style lang="scss">

  table.roles {
    margin-bottom: 12px;
    width: 90%;
    text-align: center;
    width: 100%;
    font-weight: bold;

    td {
      vertical-align: top;
    }
  }

  .role {
    background-color: #fff;
    color: #444;
    display: inline-block;
    padding-top: 76px;
    width: 105px;
    margin: 0 6px;
    background-repeat: no-repeat;
    background-size: contain;

    &.designer {
      background-image: url("../assets/img/designer.png");
    }
    &.developer {
      background-image: url("../assets/img/developer.png");
    }
    &.tester {
      background-image: url("../assets/img/tester.png");
    }
    &.deployer {
      background-image: url("../assets/img/deployer.png");
    }

    .captain {
      color: darkorange;
    }
  }

</style>

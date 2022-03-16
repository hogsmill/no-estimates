<template>
  <div>

    <!-- Modals -->

    <Feedback v-if="modals['feedback']" />
    <NoEstimatesWalkThrough v-if="modals['walkThrough'] && appType == 'No Estimates'" />
    <KanbanPlaygroundWalkThrough v-if="modals['walkThrough'] && appType == 'Kanban Playground'" />
    <SetCaptain v-if="modals['setCaptain']" />
    <SetEstimates v-if="modals['setEstimates']" />
    <SetGame v-if="modals['setGame']" />
    <Report v-if="modals['report']" />
    <EventCard v-if="modals['eventCard']" />
    <EventGraph v-if="modals.results['eventGraph']" />
    <Retro v-if="modals['retro']" />
    <AutoDeployComplete v-if="modals['autoDeployComplete']" />
    <Chat v-if="modals['chat']" />
    <ChatFacilitator v-if="modals['chatFacilitator']" />
    <GoMobile v-if="modals['goMobile']" />

    <!-- Results Modals -->

    <Correlation v-if="modals.results['correlation']" />
    <CumulativeFlow v-if="modals.results['cumulativeFlow']" />
    <CycleTime v-if="modals.results['cycleTime']" />
    <Distribution v-if="modals.results['distribution']" />
    <FlowEfficiency v-if="modals.results['flowEfficiency']" />
    <FlowEfficiencyCards v-if="modals.results['flowEfficiencyCards']" />
    <MonteCarlo v-if="modals.results['monteCarlo']" />
    <ScatterPlot v-if="modals.results['scatterPlot']" />
    <SourcesOfVariation v-if="modals.results['sourcesOfVariation']" />
    <ValueDelivered v-if="modals.results['valueDelivered']" />
    <Wip v-if="modals.results['wip']" />
  </div>
</template>

<script>
import Feedback from './modals/Feedback.vue'
import NoEstimatesWalkThrough from './modals/NoEstimatesWalkThrough.vue'
import KanbanPlaygroundWalkThrough from './modals/KanbanPlaygroundWalkThrough.vue'
import SetCaptain from './modals/SetCaptain.vue'
import SetEstimates from './modals/SetEstimates.vue'
import SetGame from './modals/SetGame.vue'
import Report from './modals/Report.vue'
import EventCard from './modals/EventCard.vue'
import EventGraph from './modals/EventGraph.vue'
import Retro from './modals/Retro.vue'
import AutoDeployComplete from './modals/AutoDeployComplete.vue'
import Chat from './modals/Chat.vue'
import ChatFacilitator from './modals/ChatFacilitator.vue'
import GoMobile from './modals/GoMobile.vue'

import Correlation from './modals/results/Correlation.vue'
import CumulativeFlow from './modals/results/CumulativeFlow.vue'
import CycleTime from './modals/results/CycleTime.vue'
import Distribution from './modals/results/Distribution.vue'
import FlowEfficiency from './modals/results/FlowEfficiency.vue'
import FlowEfficiencyCards from './modals/results/FlowEfficiencyCards.vue'
import MonteCarlo from './modals/results/MonteCarlo.vue'
import ScatterPlot from './modals/results/ScatterPlot.vue'
import SourcesOfVariation from './modals/results/SourcesOfVariation.vue'
import ValueDelivered from './modals/results/ValueDelivered.vue'
import Wip from './modals/results/Wip.vue'

export default {
  components: {
    Feedback,
    NoEstimatesWalkThrough,
    KanbanPlaygroundWalkThrough,
    SetCaptain,
    SetEstimates,
    SetGame,
    Report,
    EventCard,
    EventGraph,
    Retro,
    AutoDeployComplete,
    Chat,
    ChatFacilitator,
    GoMobile,

    Correlation,
    CumulativeFlow,
    CycleTime,
    Distribution,
    FlowEfficiency,
    FlowEfficiencyCards,
    MonteCarlo,
    ScatterPlot,
    SourcesOfVariation,
    ValueDelivered,
    Wip
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    appType() {
      return this.$store.getters.appType
    }
  }
}
</script>

<style lang="scss">

  .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
    width: 90%;
    max-width: 850px;
  }
  .modal__title {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .modal-content {
    letter-spacing: 0;
    color: #212529;

    p.modal-form {
      margin: o auto;
      margin-bottom: 12px;
    }

    .modal-form {
      width: 80%;
      margin: 0 auto;
    }
  }
</style>

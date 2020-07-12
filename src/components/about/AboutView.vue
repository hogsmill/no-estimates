<template>
  <div class="container">
    <h1>No Estimates</h1>
    <p class="text-left">
      Functionality so far, note - it all works across all connected browsers, e.g. when an event card comes up, everyone sees t:
    </p>
    <ul class="text-left">
      <li><strong>Pull a Card into first queue</strong>. Click on "Work Cards" to pull the next card into the Design queue. Commit day is added automatically</li>
      <li><strong>Assign a Dependent Team</strong>. Click on the "Team" area in a card to set the dependent team (instead of picking up a dependent team card)</li>
      <li><strong>Bring up an event card</strong>. Not 100% sure how event cards work, so this just brings up the next one, and increments</li>
      <li><strong>Day increment</strong> Click next to move the day on; we can hook in here to do blocking, etc. </li>
      <li><strong>Pick Team name</strong> once selected, team members see state changes for that team </li>
      <li><strong>Pick team member name</strong> Once you set your name, your available effort appear top right. This is updated to 4 each day (although you can't see this yet) </li>
    </ul>
    <p>And obviously all the data structures behind all this, e.g. Cards have effort, urgent, team, etc. defined</p>

  </div>
</template>

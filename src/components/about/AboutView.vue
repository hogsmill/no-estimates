<template>
  <div class="container">
    <h1>No Estimates</h1>
    <p class="text-left">
      Functionality so far, note - it all works across all connected browsers, e.g. when an event card comes up, everyone sees t:
    </p>
    <ul class="text-left">
      <li><strong>Pick team member name</strong> Once you set your name, your available effort appears top right. This is updated to 4 each day</li>
      <li><strong>Pick Team name</strong> once selected, team members see state changes for that team </li>
      <li><strong>Pick team member speciality</strong> Once you set your name, you can set your speciality</li>
      <li><strong>Pull a Card into first queue</strong>. Click on "Work Cards" to pull the next card into the Design queue. Commit day is added automatically</li>
      <li><strong>Add effort to a card</strong>. Click on the A/B/C/D on the card to add effort. updates your effort left, and takes account of your speciality (2 if not your speciality). Also gives a status message to each client when someone adds some effort</li>
      <li><strong>Assign a Dependent Team</strong>. Click on the "Team" area in a card to set the dependent team (instead of picking up a dependent team card)</li>
      <li><strong>Day increment</strong> Click next to move the day on; it shows the next event card (should this be random?) and randomly blocks some cards </li>
    </ul>
    <p>And obviously all the data structures behind all this, e.g. Cards have effort, urgent, team, etc. defined</p>

    <p>Next steps...</p>
    <ul class="text-left">
      <li>Move cards to the next column(s)</li>
      <li>Create and populate the graphs and reports, etc.</li>
    </ul>
  </div>
</template>

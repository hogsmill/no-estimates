<template>
  <div class="container about">
    <h1>No Estimates</h1>
    <p class="text-left">
      Functionality so far, note - it all works across all connected browsers, e.g. when an event card comes up, everyone sees it.
    </p>
    <p><span class="new">&#9733;</span> = New</p>
    <ul class="text-left">
      <li><span class="new">&#9733;</span><strong>Event Card extras</strong> implemented (an architecture for and) the first function - pizza adds one to capacity</li>
      <li><span class="new">&#9733;</span><strong>Time and Delivery Date</strong> calculated automatically</li>
      <li><span class="new">&#9733;</span><strong>Moving cards to next column</strong> works if card has column effort completed and is not blocked</li>
      <li><span class="new">&#9733;</span><strong>Report</strong> working, but needs testing :-) </li>
      <li><span class="new">&#9733;</span><strong>Event cards</strong> now in right order. There are 2 from the original images not in the new list (see below)</li>
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
      <li>Do other teams work...</li>
      <li>Do the extras on event cards; add effort for pizza, 8 points for deploy, etc. </li>
      <li>Create and populate the graphs</li>
    </ul>

    <p>Missing event cards:</p>
    <ol class="text-left">
      <li>If you decided yesterday to automate deployments, when you complete the delivery automation, you will no longer have to roll the die when you deploy.</li>
      <li>Would you like to restructure your team? Feel free to change role specialities or negotiate with other teams to bring on new members.</li>
    </ol>
  </div>
</template>

<style>
  .about p { text-align: left; }
  .about .new { color: darkorange; padding: 0 3px; }
</style>

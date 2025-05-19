// =====================================
// Script: BdayTime – Milestone calculator
// Objectif : déterminer la date/heure où l'on atteindra
//            - le prochain millier d'heures de vie
//            - le prochain millier de jours de vie
//            - le prochain centaine de mois de vie
// =====================================

// Sélecteurs
const dateInput   = document.getElementById('birth-date');
const timeInput   = document.getElementById('birth-time');
const calcBtn     = document.getElementById('calc-btn');
const resultsZone = document.getElementById('results');

calcBtn.addEventListener('click', ()=>{
  if(!dateInput.value){
    alert('Merci de renseigner ta date de naissance.');
    return;
  }

  // Création de la Date de naissance précise (y, m, d, h, min)
  const [y,m,d] = dateInput.value.split('-').map(Number);
  let h = 12, min = 0;
  if(timeInput.value){
    [h,min] = timeInput.value.split(':').map(Number);
  }
  const birthDateTime = new Date(y, m-1, d, h, min, 0, 0);

  // Calcul des prochains jalons
  const milestones = computeNextMilestones(birthDateTime);

  // Affichage
  renderMilestones(milestones);
});

/**
 * Calcule les dates des prochains jalons (1000 jours, 1000 heures, 100 mois, etc.)
 */
function computeNextMilestones(birth){
  const now = new Date();
  const msSince = now - birth;

  // Convertisseurs
  const MS_PER_HOUR = 3.6e6;   // 60*60*1000
  const MS_PER_DAY  = 8.64e7;  // 24*60*60*1000

  const hoursSince  = msSince / MS_PER_HOUR;
  const daysSince   = msSince / MS_PER_DAY;
  const monthsSince = daysSince / 30.44; // approximation moyenne

  const nextHourMilestone  = Math.ceil(hoursSince  / 1000) * 1000;
  const nextDayMilestone   = Math.ceil(daysSince   / 1000) * 1000;
  const nextMonthMilestone = Math.ceil(monthsSince /  100) *  100;

  const hourDate  = new Date(birth.getTime() + nextHourMilestone * MS_PER_HOUR);
  const dayDate   = new Date(birth.getTime() + nextDayMilestone  * MS_PER_DAY);
  const monthDate = addMonths(birth, nextMonthMilestone);

  return [
    {unit:'heures', amount:nextHourMilestone,  date:hourDate },
    {unit:'jours',  amount:nextDayMilestone,   date:dayDate  },
    {unit:'mois',   amount:nextMonthMilestone, date:monthDate}
  ];
}

/**
 * Ajoute un nombre de mois (positif) à une date
 */
function addMonths(date, months){
  const result = new Date(date);
  const desiredMonth = result.getMonth() + months;
  result.setMonth(desiredMonth);
  return result;
}

/**
 * Affiche les jalons dans la zone de résultats
 */
function renderMilestones(list){
  resultsZone.innerHTML = '';

  list.forEach(({unit, amount, date})=>{
    const card = document.createElement('div');
    card.className = 'birthday-card';

    const dd = String(date.getDate()).padStart(2,'0');
    const mm = String(date.getMonth()+1).padStart(2,'0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2,'0');
    const mn = String(date.getMinutes()).padStart(2,'0');

    card.innerHTML = `
      <h3>${amount.toLocaleString('fr-FR')} ${unit}</h3>
      <div class="result-item"><label>Date&nbsp;:</label><span>${dd}/${mm}/${yyyy}</span></div>
      <div class="result-item"><label>Heure&nbsp;:</label><span>${hh}h${mn}</span></div>
    `;

    resultsZone.appendChild(card);
  });
}

// Sélecteurs
const dateInput   = document.getElementById('birth-date');
const timeInput   = document.getElementById('birth-time');
const calcBtn     = document.getElementById('calc-btn');
const resultsZone = document.getElementById('results');

calcBtn.addEventListener('click',()=>{
  // Validation minimum
  if(!dateInput.value){
    alert('Merci de renseigner ta date de naissance.');
    return;
  }
  // Construction d'un objet Date de naissance (avec heure)
  const [y,m,d] = dateInput.value.split('-').map(Number); // yyyy-mm-dd
  let h = 12, min = 0;
  if(timeInput.value){
    [h,min] = timeInput.value.split(':').map(Number);
  }
  const birthDateTime = new Date(y, m-1, d, h, min, 0, 0);
  // Calcul des 3 prochains anniversaires
  const upcoming = getNextBirthdays(birthDateTime, 3);
  // Affichage
  renderResults(upcoming);
});

function getNextBirthdays(birthDateTime, n){
  const out = [];
  const now = new Date();
  let year = now.getFullYear();
  // Premier anniversaire futur ou aujourd'hui mais plus tard
  let next = new Date(birthDateTime);
  next.setFullYear(year);
  if(next <= now) {
    next.setFullYear(++year);
  }
  for(let i=0;i<n;i++){
    const bday = new Date(next);
    bday.setFullYear(next.getFullYear()+i);
    out.push({number: (bday.getFullYear()-birthDateTime.getFullYear()), date: bday, diff: diffBreakdown(now,bday)});
  }
  return out;
}

function diffBreakdown(start,end){
  const ms = end - start;
  const totalHours = Math.floor(ms/3.6e6); // 3600000ms
  const totalDays  = Math.floor(totalHours/24);
  const months     = Math.floor(totalDays/30); // approximation
  const days       = totalDays % 30;
  const hours      = totalHours % 24;
  return {months, days, hours};
}

function renderResults(list){
  resultsZone.innerHTML='';
  list.forEach(({number,date,diff})=>{
    const card = document.createElement('div');
    card.className='birthday-card';
    const yyyy = date.getFullYear();
    const dd   = String(date.getDate()).padStart(2,'0');
    const mm   = String(date.getMonth()+1).padStart(2,'0');
    const hh   = String(date.getHours()).padStart(2,'0');
    const mn   = String(date.getMinutes()).padStart(2,'0');

    card.innerHTML = `
      <h3>${number}<sup>e</sup> anniversaire – ${dd}/${mm}/${yyyy} à ${hh}h${mn}</h3>
      <div class="result-item"><label>Dans&nbsp;:</label><span>${diff.months} mois</span></div>
      <div class="result-item"><label></label><span>${diff.days} jours</span></div>
      <div class="result-item"><label></label><span>${diff.hours} heures</span></div>
    `;
    resultsZone.appendChild(card);
  });
}


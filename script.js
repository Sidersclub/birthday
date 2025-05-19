// ===============================
// Script: BdayTime – next birthday totals
// ===============================

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

  // Construit la Date de naissance précise (avec heure)
  const [y,m,d] = dateInput.value.split('-').map(Number);
  let h = 12, min = 0;
  if(timeInput.value){
    [h,min] = timeInput.value.split(':').map(Number);
  }
  const birthDateTime = new Date(y, m-1, d, h, min, 0, 0);

  // Prochain anniversaire
  const nextBirthday = getNextBirthday(birthDateTime);

  // Différences totales (comptes ronds)
  const diff = diffTotals(new Date(), nextBirthday);

  // Affichage
  renderResult(nextBirthday, diff);
});

/**
 * Calcule la date du tout prochain anniversaire (>= maintenant)
 */
function getNextBirthday(birthDate){
  const now = new Date();
  const next = new Date(birthDate);
  next.setFullYear(now.getFullYear());
  // Si déjà passé cette année → année suivante
  if(next <= now){
    next.setFullYear(now.getFullYear() + 1);
  }
  return next;
}

/**
 * Retourne les totaux arrondis (heures, jours, mois) entre 2 dates
 */
function diffTotals(start, end){
  const ms = end - start;
  const totalHours = Math.round(ms / 3.6e6);      // 1h  = 3 600 000 ms
  const totalDays  = Math.round(ms / 8.64e7);     // 1j  = 86 400 000 ms
  const totalMonths= Math.round(totalDays / 30.44); // mois moyen ≈ 30,44 j
  return {
    hours : totalHours,
    days  : totalDays,
    months: totalMonths
  };
}

function renderResult(nextBirthday, diff){
  resultsZone.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'birthday-card';

  const dd = String(nextBirthday.getDate()).padStart(2,'0');
  const mm = String(nextBirthday.getMonth()+1).padStart(2,'0');
  const yyyy = nextBirthday.getFullYear();
  const hh = String(nextBirthday.getHours()).padStart(2,'0');
  const mn = String(nextBirthday.getMinutes()).padStart(2,'0');

  card.innerHTML = `
    <h3>Prochain anniversaire – ${dd}/${mm}/${yyyy} à ${hh}h${mn}</h3>
    <div class="result-item"><label>Heures restantes&nbsp;:</label><span>${diff.hours.toLocaleString()}</span></div>
    <div class="result-item"><label>Jours restants&nbsp;:</label><span>${diff.days.toLocaleString()}</span></div>
    <div class="result-item"><label>Mois restants&nbsp;:</label><span>${diff.months.toLocaleString()}</span></div>
  `;

  resultsZone.appendChild(card);
}

let data = null;

const artistsGrid = document.getElementById('artists-grid');
const artistPanel = document.getElementById('artist-panel');
const panelClose = document.getElementById('panel-close');
const panelProfile = document.getElementById('panel-profile');
const panelName = document.getElementById('panel-name');
const panelBio = document.getElementById('panel-bio');
const worksGrid = document.getElementById('works-grid');
const workFs = document.getElementById('work-fullscreen');
const workClose = document.getElementById('work-close');
const workImage = document.getElementById('work-image');
const workTitle = document.getElementById('work-title');
const workDesc = document.getElementById('work-desc');
const navLeft = document.getElementById('nav-left');
const navRight = document.getElementById('nav-right');

let currentArtistIndex = 0;
let currentWorkIndex = 0;

fetch('data.json')
  .then(r => r.json())
  .then(json => {
    data = json.artists;
    renderArtists();
  });

function renderArtists(){
  artistsGrid.innerHTML = '';
  data.forEach((artist, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = artist.preview; 
    img.alt = artist.name;
    card.appendChild(img);
    card.addEventListener('click', ()=> openArtistPanel(idx));
    artistsGrid.appendChild(card);
  });
}

function openArtistPanel(index){
  currentArtistIndex = index;
  const artist = data[index];
  panelProfile.src = artist.profile;
  panelName.textContent = artist.name;
  panelBio.textContent = artist.bio;

  worksGrid.innerHTML = '';
  artist.works.forEach((w, i)=>{
    const c = document.createElement('div');
    c.className = 'card';
    c.style.height = '200px';
    const im = document.createElement('img');
    im.src = w.src;
    im.alt = w.title;
    c.appendChild(im);
    c.addEventListener('click', ()=> openWorkFullscreen(index, i));
    worksGrid.appendChild(c);
  });

  artistPanel.classList.add('open');
  artistPanel.setAttribute('aria-hidden', 'false');
}

panelClose.addEventListener('click', ()=>{
  artistPanel.classList.remove('open');
  artistPanel.setAttribute('aria-hidden', 'true');
});

function openWorkFullscreen(artistIdx, workIdx){
  currentArtistIndex = artistIdx;
  currentWorkIndex = workIdx;
  const work = data[artistIdx].works[workIdx];
  workImage.src = work.src;
  workTitle.textContent = work.title;
  workDesc.textContent = work.description;

  workFs.classList.add('open');
  workFs.setAttribute('aria-hidden','false');
}

workClose.addEventListener('click', ()=>{
  workFs.classList.remove('open');
  workFs.setAttribute('aria-hidden','true');
});

navLeft.addEventListener('click', ()=>{
  const artist = data[currentArtistIndex];
  currentWorkIndex = (currentWorkIndex - 1 + artist.works.length) % artist.works.length;
  openWorkFullscreen(currentArtistIndex, currentWorkIndex);
});
navRight.addEventListener('click', ()=>{
  const artist = data[currentArtistIndex];
  currentWorkIndex = (currentWorkIndex + 1) % artist.works.length;
  openWorkFullscreen(currentArtistIndex, currentWorkIndex);
});

window.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    if(workFs.classList.contains('open')) workClose.click();
    else if(artistPanel.classList.contains('open')) panelClose.click();
  }
});
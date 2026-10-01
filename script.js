/* =========================================
   LEVEL-IMMO - SCRIPT PRINCIPAL
========================================= */


/* =========================================
   INVENTAIRE DES BIENS
========================================= */

const properties = [

  {
    id: 1,
    ref: 'LI-001',
    type: 'parcelle',
    status: 'vente',
    state: 'Terrain nu',
    zone: 'Abomey-Calavi',
    title: 'Parcelle résidentielle de 500 m²',
    price: '18 500 000 FCFA',
    meta: ['500 m²', 'Zone résidentielle'],
    desc: 'Parcelle destinée à un projet résidentiel. Les informations foncières doivent être vérifiées avant engagement.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=85'
  },

  {
    id: 2,
    ref: 'LI-002',
    type: 'maison',
    status: 'vente',
    state: 'Bon état',
    zone: 'Cotonou',
    title: 'Maison familiale R+1',
    price: '95 000 000 FCFA',
    meta: ['4 chambres', '2 salons'],
    desc: 'Maison familiale avec espaces de vie et dépendances. Visite sur rendez-vous.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85'
  },

  {
    id: 3,
    ref: 'LI-003',
    type: 'appartement',
    status: 'location',
    state: 'Neuf',
    zone: 'Cotonou',
    title: 'Appartement moderne',
    price: '350 000 FCFA / mois',
    meta: ['2 chambres', 'Meublé'],
    desc: 'Appartement moderne proposé à la location. Conditions à confirmer auprès de l’agence.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85'
  },

  {
    id: 4,
    ref: 'LI-004',
    type: 'parcelle',
    status: 'vente',
    state: 'Terrain nu',
    zone: 'Comé',
    title: 'Parcelle résidentielle',
    price: '12 000 000 FCFA',
    meta: ['600 m²', 'Accès routier'],
    desc: 'Terrain destiné à un projet résidentiel ou d’investissement.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=85'
  },

  {
    id: 5,
    ref: 'LI-005',
    type: 'maison',
    status: 'location',
    state: 'Bon état',
    zone: 'Porto-Novo',
    title: 'Maison à louer',
    price: '250 000 FCFA / mois',
    meta: ['3 chambres', 'Cour'],
    desc: 'Maison proposée à la location résidentielle.',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85'
  },

  {
    id: 6,
    ref: 'LI-006',
    type: 'local',
    status: 'location',
    state: 'À rénover',
    zone: 'Ouidah',
    title: 'Local commercial',
    price: '180 000 FCFA / mois',
    meta: ['80 m²', 'Axe passant'],
    desc: 'Local pouvant accueillir une activité commerciale, sous réserve de visite et validation.',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85'
  }

];


/* =========================================
   LIBELLÉS
========================================= */

const labels = {

  parcelle: 'Parcelle',
  maison: 'Maison',
  appartement: 'Appartement',
  local: 'Local commercial',

  vente: 'À vendre',
  location: 'À louer'

};


/* =========================================
   OUTILS DOM
========================================= */

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);


/* =========================================
   FAVORIS
========================================= */

let favorites = JSON.parse(
  localStorage.getItem('levelImmoFavorites') || '[]'
);

let favMode = false;


/* Sauvegarder les favoris */

function saveFav() {

  localStorage.setItem(
    'levelImmoFavorites',
    JSON.stringify(favorites)
  );

  const favCount = $('#favCount');

  if (favCount) {
    favCount.textContent = favorites.length;
  }

}


/* Ajouter / retirer un favori */

function toggleFav(id) {

  if (favorites.includes(id)) {

    favorites = favorites.filter(
      item => item !== id
    );

  } else {

    favorites.push(id);

  }

  saveFav();
  render();

}


/* =========================================
   AFFICHAGE DES BIENS
========================================= */

function render() {

  const keywordElement = $('#keyword');
  const typeElement = $('#filterType');
  const statusElement = $('#filterStatus');
  const stateElement = $('#filterState');
  const zoneElement = $('#filterZone');

  if (
    !keywordElement ||
    !typeElement ||
    !statusElement ||
    !stateElement ||
    !zoneElement
  ) {
    return;
  }


  const key = keywordElement.value
    .toLowerCase()
    .trim();

  const type = typeElement.value;
  const status = statusElement.value;
  const state = stateElement.value;
  const zone = zoneElement.value;


  let list = properties.filter(property => {

    const searchableText = `
      ${property.title}
      ${property.zone}
      ${property.ref}
      ${property.type}
      ${property.state}
    `.toLowerCase();


    return (

      (!key || searchableText.includes(key)) &&

      (!type || property.type === type) &&

      (!status || property.status === status) &&

      (!state || property.state === state) &&

      (!zone || property.zone === zone)

    );

  });


  /* Mode favoris */

  if (favMode) {

    list = list.filter(
      property => favorites.includes(property.id)
    );

  }


  /* Nombre de résultats */

  const resultCount = $('#resultCount');

  if (resultCount) {

    resultCount.textContent =
      `${list.length} bien${list.length > 1 ? 's' : ''} trouvé${list.length > 1 ? 's' : ''}`;

  }


  /* Grille */

  const propertyGrid = $('#propertyGrid');

  if (!propertyGrid) {
    return;
  }


  propertyGrid.innerHTML = list.map(property => {

    const isFavorite =
      favorites.includes(property.id);


    return `

      <article class="property">

        <div
          class="property-img"
          style="background-image:url('${property.image}')"
        >

          <span class="badge">
            ${labels[property.status]}
          </span>


          <button
            class="heart ${isFavorite ? 'active' : ''}"
            onclick="toggleFav(${property.id})"
            aria-label="Ajouter aux favoris"
            type="button"
          >
            ${isFavorite ? '♥' : '♡'}
          </button>

        </div>


        <div class="property-body">

          <span class="location">
            Réf. ${property.ref}
            • ${property.zone}
            • ${labels[property.type]}
          </span>


          <h3>
            ${property.title}
          </h3>


          <div class="meta">

            ${property.meta.map(item => `
              <span class="chip">
                ${item}
              </span>
            `).join('')}

          </div>


          <div class="price">
            ${property.price}
          </div>


          <div class="property-foot">

            <span class="state">
              État : ${property.state}
            </span>


            <button
              onclick="showProperty(${property.id})"
              type="button"
            >
              Voir le bien →
            </button>

          </div>

        </div>

      </article>

    `;

  }).join('');


  /* Message aucun résultat */

  const empty = $('#empty');

  if (empty) {

    empty.classList.toggle(
      'hidden',
      list.length > 0
    );

  }


  saveFav();

}


/* =========================================
   DÉTAIL D'UN BIEN
========================================= */

function showProperty(id) {

  const property =
    properties.find(item => item.id === id);


  if (!property) {
    return;
  }


  const propertyDetail =
    $('#propertyDetail');


  if (!propertyDetail) {
    return;
  }


  const safeTitle =
    property.title.replace(/'/g, "\\'");


  propertyDetail.innerHTML = `

    <div class="detail-grid">

      <img
        src="${property.image}"
        alt="${property.title}"
      >


      <div class="detail-info">

        <span class="eyebrow dark">

          ${labels[property.status]}
          • RÉF. ${property.ref}

        </span>


        <h2>
          ${property.title}
        </h2>


        <p class="location">

          ${property.zone}
          • ${labels[property.type]}
          • ${property.state}

        </p>


        <p class="detail-price">
          ${property.price}
        </p>


        <div class="meta">

          ${property.meta.map(item => `
            <span class="chip">
              ${item}
            </span>
          `).join('')}

        </div>


        <p>
          ${property.desc}
        </p>


        <div class="notice">

          Les documents, disponibilité,
          localisation exacte et conditions
          financières doivent être confirmés
          par LEVEL-IMMO avant toute transaction.

        </div>


        <a
          class="btn primary"
          href="#contact"
          onclick="closeModals();prefill('${safeTitle}')"
        >
          Demander ce bien
        </a>

      </div>

    </div>

  `;


  const propertyModal =
    $('#propertyModal');


  if (propertyModal) {

    propertyModal.classList.add('open');

  }

}


/* =========================================
   PRÉREMPLIR LE FORMULAIRE
========================================= */

function prefill(title) {

  const textarea =
    $('#contactForm textarea');


  if (textarea) {

    textarea.value =
      `Bonjour LEVEL-IMMO, je suis intéressé(e) par le bien « ${title} ». Merci de me contacter.`;

  }


  setTimeout(() => {

    const contact =
      $('#contact');

    if (contact) {

      contact.scrollIntoView({
        behavior: 'smooth'
      });

    }

  }, 50);

}


/* =========================================
   FERMER LES MODALES
========================================= */

function closeModals() {

  $$('.modal').forEach(modal => {

    modal.classList.remove('open');

  });

}


/* =========================================
   RECHERCHE HERO
========================================= */

function applyHero() {

  const heroType = $('#heroType');
  const heroStatus = $('#heroStatus');
  const heroZone = $('#heroZone');

  if (!heroType || !heroStatus || !heroZone) {
    return;
  }


  $('#filterType').value =
    heroType.value;

  $('#filterStatus').value =
    heroStatus.value;

  $('#filterZone').value =
    heroZone.value;

  $('#filterState').value = '';

  $('#keyword').value = '';

  favMode = false;

  render();


  const biens =
    $('#biens');

  if (biens) {

    biens.scrollIntoView({
      behavior: 'smooth'
    });

  }

}


/* =========================================
   BOUTON RECHERCHER
========================================= */

const heroSearch =
  $('#heroSearch');


if (heroSearch) {

  heroSearch.addEventListener(
    'click',
    applyHero
  );

}


/* =========================================
   RECHERCHES RAPIDES
========================================= */

$$('.quick button').forEach(button => {

  button.addEventListener(
    'click',
    () => {

      const query =
        button.dataset.q;


      if (
        query === 'vente' ||
        query === 'location'
      ) {

        $('#filterStatus').value =
          query;

        $('#filterType').value = '';

      } else {

        $('#filterType').value =
          query;

        $('#filterStatus').value = '';

      }


      $('#keyword').value = '';

      favMode = false;

      render();


      const biens =
        $('#biens');

      if (biens) {

        biens.scrollIntoView({
          behavior: 'smooth'
        });

      }

    }
  );

});


/* =========================================
   FILTRES
========================================= */

[
  'keyword',
  'filterType',
  'filterStatus',
  'filterState',
  'filterZone'

].forEach(id => {

  const element =
    $('#' + id);


  if (!element) {
    return;
  }


  element.addEventListener(

    id === 'keyword'
      ? 'input'
      : 'change',

    () => {

      favMode = false;

      render();

    }

  );

});


/* =========================================
   RÉINITIALISER LES FILTRES
========================================= */

const resetFilters =
  $('#resetFilters');


if (resetFilters) {

  resetFilters.addEventListener(
    'click',
    () => {

      $('#keyword').value = '';
      $('#filterType').value = '';
      $('#filterStatus').value = '';
      $('#filterState').value = '';
      $('#filterZone').value = '';

      favMode = false;

      render();

    }
  );

}


/* =========================================
   FAVORIS UNIQUEMENT
========================================= */

const favOnly =
  $('#favOnly');


if (favOnly) {

  favOnly.addEventListener(
    'click',
    () => {

      favMode = !favMode;

      render();

    }
  );

}


/* =========================================
   MODALE CONTRAT
========================================= */

const openContract =
  $('#openContract');


if (openContract) {

  openContract.addEventListener(
    'click',
    () => {

      $('#contractModal')
        .classList.add('open');

    }
  );

}


/* =========================================
   MODALE PROPRIÉTAIRE
========================================= */

const ownerBtn =
  $('#ownerBtn');


if (ownerBtn) {

  ownerBtn.addEventListener(
    'click',
    () => {

      $('#ownerModal')
        .classList.add('open');

    }
  );

}


/* =========================================
   BOUTONS FERMER
========================================= */

$$('.close').forEach(button => {

  button.addEventListener(
    'click',
    closeModals
  );

});


/* =========================================
   FERMER EN CLIQUANT EN DEHORS
========================================= */

$$('.modal').forEach(modal => {

  modal.addEventListener(
    'click',
    event => {

      if (event.target === modal) {

        closeModals();

      }

    }
  );

});


/* =========================================
   FORMULAIRE CONTACT
========================================= */

const contactForm =
  $('#contactForm');


if (contactForm) {

  contactForm.addEventListener(
    'submit',
    event => {

      event.preventDefault();


      const formMsg =
        $('#formMsg');


      if (formMsg) {

        formMsg.textContent =
          'Demande enregistrée dans le formulaire. Connectez-le à votre e-mail, WhatsApp ou CRM pour recevoir réellement les messages.';

      }

    }
  );

}


/* =========================================
   FORMULAIRE PROPRIÉTAIRE
========================================= */

const ownerForm =
  $('#ownerForm');


if (ownerForm) {

  ownerForm.addEventListener(
    'submit',
    event => {

      event.preventDefault();


      const ownerMsg =
        $('#ownerMsg');


      if (ownerMsg) {

        ownerMsg.textContent =
          'Demande de dépôt enregistrée localement. Une connexion à une base de données permettra ensuite de la transmettre à LEVEL-IMMO.';

      }

    }
  );

}


/* =========================================
   WHATSAPP
========================================= */

/*
  IMPORTANT :
  Remplace 22900000000 par le véritable
  numéro WhatsApp de LEVEL-IMMO.

  Format :
  229XXXXXXXX
  sans +, sans espaces.
*/

const WHATSAPP_NUMBER =
  '22900000000';


const whatsappBtn =
  $('#whatsappBtn');


if (whatsappBtn) {

  const whatsappMessage =
    'Bonjour LEVEL-IMMO, je souhaite obtenir des informations sur vos services immobiliers.';


  whatsappBtn.href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

}


/* =========================================
   MENU MOBILE
========================================= */

const menu =
  $('.menu');


const nav =
  $('#nav');


if (menu && nav) {

  menu.addEventListener(
    'click',
    () => {

      nav.classList.toggle('open');

    }
  );


  /* Fermer le menu après avoir
     cliqué sur un lien */

  $$('#nav a').forEach(link => {

    link.addEventListener(
      'click',
      () => {

        nav.classList.remove('open');

      }
    );

  });

}


/* =========================================
   ANNÉE AUTOMATIQUE
========================================= */

const year =
  $('#year');


if (year) {

  year.textContent =
    new Date().getFullYear();

}


/* =========================================
   INITIALISATION
========================================= */

saveFav();
render();

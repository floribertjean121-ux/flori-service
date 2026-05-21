const MON_NUMERO_WHATSAPP = "243974437449";

document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    const nouveauTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nouveauTheme);
});

function discuterTarif(nomFormule, prixPromo) {
    const message = `Bonjour Flori Service, je souhaite profiter de l'offre de lancement pour la ${nomFormule} au tarif réduit de ${prixPromo}.`;
    window.open(`https://wa.me/${MON_NUMERO_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
}

document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nom = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const messageClient = document.getElementById('contact-message').value;
    
    const messageTotal = `Bonjour Flori Service, je m'appelle ${nom} (${email}). Voici la description de mon projet : ${messageClient}`;
    window.open(`https://wa.me/${MON_NUMERO_WHATSAPP}?text=${encodeURIComponent(messageTotal)}`, '_blank');
});

function securiserTexte(texte) {
    const conteneurTemporaire = document.createElement('div');
    conteneurTemporaire.innerText = texte;
    return conteneurTemporaire.innerHTML;
}

async function chargerTemoignages() {
    const conteneur = document.getElementById('testimonials-container');
    try {
        const reponse = await fetch('/api/temoignages');
        const listeTemoignages = await reponse.json();
        
        conteneur.innerHTML = listeTemoignages.map(t => `
            <div class="testimonial-card">
                <p class="comment">"${securiserTexte(t.message)}"</p>
                <h4>${securiserTexte(t.nom)}</h4>
            </div>
        `).join('');
    } catch (err) {
        console.error("Erreur de chargement :", err);
    }
}

document.getElementById('testimonial-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nom = document.getElementById('t-nom').value;
    const email = document.getElementById('t-email').value;
    const message = document.getElementById('t-message').value;

    try {
        const reponse = await fetch('/api/temoignages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, email, message })
        });
        
        if (reponse.ok) {
            document.getElementById('testimonial-form').reset();
            chargerTemoignages();
        }
    } catch (err) {
        console.error("Erreur d'envoi :", err);
    }
});

chargerTemoignages();

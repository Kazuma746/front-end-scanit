export const metadata = {
  title: 'Politique de confidentialité | ScanIt',
  description: 'Politique de confidentialité conforme au RGPD pour le service ScanIt (analyse de CV).',
};

export default function PrivacyPage() {
  return (
    <main className="container py-12 prose prose-gray max-w-3xl">
      <h1>Politique de confidentialité</h1>

      <p>
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        ScanIt – Ynov Paris Campus, 12 Rue Anatole France, 92000 Nanterre, France. Téléphone : 01 48 07 07 02.
        Nous déterminons les finalités et les moyens du traitement des données à caractère personnel au sens du RGPD.
      </p>

      <h2>2. Données collectées</h2>
      <ul>
        <li>Données de compte : prénom, nom, email, pseudonyme, rôle, niveau d’abonnement.</li>
        <li>Identifiants tiers (le cas échéant) pour l’authentification (ex. Google OAuth).</li>
        <li>Contenu transmis pour analyse : CV, métadonnées du document.</li>
        <li>Données d’usage : logs techniques, mesures d’audience (si consenties).</li>
        <li>Transactions (si achat de crédits) : identifiants de paiement via un prestataire.</li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>Fourniture du service d’analyse de CV et suivi de candidatures (exécution du contrat).</li>
        <li>Création et gestion de compte, authentification, sécurité (exécution du contrat et intérêt légitime).</li>
        <li>Facturation et gestion des paiements (obligation légale et exécution du contrat).</li>
        <li>Amélioration du service et statistiques (intérêt légitime ou consentement pour l’audience).</li>
        <li>Communication utilisateur et support (exécution du contrat/intérêt légitime).</li>
      </ul>

      <h2>4. Durées de conservation</h2>
      <ul>
        <li>Compte utilisateur : tant que le compte est actif, puis suppression ou anonymisation dans un délai raisonnable.</li>
        <li>CV soumis : selon les paramètres du service, au maximum le temps nécessaire à l’analyse et à vos besoins, puis suppression ou anonymisation.</li>
        <li>Logs techniques et mesures : durée proportionnée (généralement moins de 13 mois pour l’audience).</li>
        <li>Documents de facturation : selon les obligations légales (ex. 10 ans).</li>
      </ul>

      <h2>5. Destinataires et transferts</h2>
      <p>
        Les données peuvent être communiquées à nos prestataires et sous-traitants strictement nécessaires à la
        fourniture du service (hébergement, email, paiement, analytics si consentis). En cas de transfert hors UE,
        nous nous assurons de garanties appropriées (ex. clauses contractuelles types de la Commission européenne).
      </p>

      <h2>6. Cookies et traceurs</h2>
      <p>
        Nous utilisons des cookies nécessaires au fonctionnement du site. Sous réserve de votre consentement,
        nous pouvons utiliser des cookies de mesure d’audience et de marketing. Vous pouvez gérer vos choix via
        la bannière de consentement. Pour plus d’informations, consultez notre section « Cookies » ci-dessus.
      </p>

      <h2>7. Vos droits</h2>
      <ul>
        <li>Droit d’accès, de rectification, d’effacement.</li>
        <li>Droit à la limitation et à l’opposition au traitement.</li>
        <li>Droit à la portabilité des données.</li>
        <li>Droit de retirer votre consentement à tout moment.</li>
        <li>Droit d’introduire une réclamation auprès de la CNIL (www.cnil.fr).</li>
      </ul>

      <h2>8. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données
        contre la perte, l’accès non autorisé, la divulgation ou l’altération.
      </p>

      <h2>9. Contact</h2>
      <p>
        Pour exercer vos droits ou toute question relative à la protection des données :
        <br />Email : privacy@scanit.app (exemple) – Téléphone : 01 48 07 07 02 – Adresse : Ynov Paris Campus,
        12 Rue Anatole France, 92000 Nanterre, France.
      </p>

      <h2>10. Modifications</h2>
      <p>
        Nous pouvons modifier la présente politique pour refléter les évolutions légales ou fonctionnelles. Nous vous
        informerons par des moyens appropriés en cas de changements significatifs.
      </p>
    </main>
  );
}



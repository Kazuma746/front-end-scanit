export const metadata = {
  title: "Conditions d'utilisation | ScanIt",
  description: "Conditions d'utilisation du service ScanIt (analyse de CV).",
};

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-secondary text-white">
        <div className="container py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Conditions d’utilisation</h1>
          <p className="mt-2 text-white/80">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </section>

      {/* Contenu */}
      <main className="container flex-1 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10">
          <article className="legal-content max-w-3xl">
            <h2>1. Objet</h2>
            <p>
              Les présentes conditions régissent l’utilisation du service ScanIt, une plateforme d’analyse de CV et de
              suivi de candidatures. En accédant ou en utilisant le service, vous acceptez ces conditions.
            </p>

            <h2>2. Création de compte</h2>
            <p>
              Pour utiliser certaines fonctionnalités, vous devez créer un compte et fournir des informations exactes et
              à jour. Vous êtes responsable de la confidentialité de vos identifiants et des activités réalisées depuis
              votre compte.
            </p>

            <h2>3. Utilisation du service</h2>
            <ul>
              <li>Vous vous engagez à ne pas transmettre de contenus illicites, diffamatoires ou contrefaisants.</li>
              <li>Vous garantissez détenir les droits nécessaires sur les CV ou documents soumis pour analyse.</li>
              <li>Vous vous interdisez toute tentative de contournement de la sécurité ou d’accès non autorisé.</li>
            </ul>

            <h2>4. Abonnements et paiements</h2>
            <p>
              Certaines fonctionnalités sont accessibles via des crédits ou des formules payantes. Les prix et conditions
              sont indiqués avant l’achat. Les paiements sont traités par un prestataire tiers. Vous devez vérifier les
              conditions spécifiques de ce prestataire.
            </p>

            <h2>5. Propriété intellectuelle</h2>
            <p>
              Les éléments du service (marques, logos, interface, code) sont protégés par la propriété intellectuelle et
              restent la propriété de leurs titulaires. Vous conservez vos droits sur vos documents (CV, etc.). Vous nous
              concédez une licence limitée et nécessaire pour traiter vos documents afin de fournir le service.
            </p>

            <h2>6. Protection des données</h2>
            <p>
              Le traitement de vos données personnelles est décrit dans notre <a href="/privacy">Politique de confidentialité</a>.
              Vous disposez de droits conformément au RGPD.
            </p>

            <h2>7. Responsabilité</h2>
            <p>
              Le service est fourni « en l’état ». Nous mettons en œuvre des efforts raisonnables pour assurer sa
              disponibilité et la qualité des analyses, sans garantie de résultat. Nous ne saurions être tenus responsables
              des dommages indirects. Rien n’exclut notre responsabilité en cas de dol, faute lourde ou atteinte aux droits
              fondamentaux.
            </p>

            <h2>8. Résiliation</h2>
            <p>
              Vous pouvez cesser d’utiliser le service à tout moment. Nous pouvons suspendre ou résilier l’accès en cas
              de violation des présentes conditions, de fraude ou d’utilisation abusive.
            </p>

            <h2>9. Modifications</h2>
            <p>
              Nous pouvons modifier les présentes conditions pour refléter des évolutions légales ou techniques. En cas de
              changement substantiel, nous vous en informerons par des moyens appropriés.
            </p>

            <h2>10. Droit applicable et juridiction</h2>
            <p>
              Les présentes sont régies par le droit français. En l’absence d’accord amiable, les tribunaux compétents de
              Nanterre seront saisis, sous réserve des règles impératives applicables.
            </p>

            <h2>11. Contact</h2>
            <p>
              ScanIt – Ynov Paris Campus, 12 Rue Anatole France, 92000 Nanterre. Téléphone : 01 48 07 07 02.
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}



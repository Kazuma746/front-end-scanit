'use client';

import { useEffect, useState } from 'react';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = 'cookie_consent_v1';

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setIsOpen(true);
        return;
      }
      const parsed = JSON.parse(saved) as { preferences: CookiePreferences; consentedAt: string };
      if (!parsed?.preferences) {
        setIsOpen(true);
      }
    } catch (_) {
      setIsOpen(true);
    }
  }, []);

  const save = (preferences: CookiePreferences) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ preferences, consentedAt: new Date().toISOString() })
      );
      // Optionnel: déposer un cookie simple pour lecture côté serveur si besoin
      document.cookie = `cookie_consent=1; Max-Age=${60 * 60 * 24 * 365}; Path=/`;
    } catch (_) {}
  };

  const acceptAll = () => {
    const all = { ...defaultPreferences, analytics: true, marketing: true };
    setPrefs(all);
    save(all);
    setIsOpen(false);
  };

  const refuseAll = () => {
    const none = { ...defaultPreferences, analytics: false, marketing: false };
    setPrefs(none);
    save(none);
    setIsOpen(false);
  };

  const saveCustomized = () => {
    save(prefs);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100]">
      <div className="container">
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="md:max-w-3xl">
              <h2 className="text-lg font-semibold mb-2">Nous respectons votre vie privée</h2>
              <p className="text-sm text-gray-600">
                Nous utilisons des cookies nécessaires au bon fonctionnement du site et, avec votre
                consentement, des cookies pour mesurer l'audience et améliorer nos services. Vous pouver
                accepter, refuser ou personnaliser vos choix à tout moment. Pour en savoir plus, consultez notre{' '}
                <a href="/privacy" className="text-primary underline">Politique de confidentialité</a>.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-3 shrink-0">
              <button
                onClick={refuseAll}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Refuser tout
              </button>
              <button
                onClick={() => setShowCustomize((v) => !v)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Personnaliser
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-90"
              >
                Accepter tout
              </button>
            </div>
          </div>

          {showCustomize && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-md border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Cookies nécessaires</p>
                    <p className="text-sm text-gray-600">Indispensables pour la navigation et la sécurité.</p>
                  </div>
                  <input type="checkbox" checked disabled className="h-4 w-4" />
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Mesure d'audience</p>
                    <p className="text-sm text-gray-600">Aide à comprendre l'utilisation du site.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={prefs.analytics}
                    onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                  />
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Marketing</p>
                    <p className="text-sm text-gray-600">Personnalisation et offres pertinentes.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={prefs.marketing}
                    onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                  />
                </div>
              </div>
              <div className="md:col-span-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowCustomize(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={saveCustomized}
                  className="px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-90"
                >
                  Enregistrer mes choix
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



const FADE_MS = 200;

export const hideSplash = () => {
    const splash = document.getElementById('splash');
    if (!splash || splash.classList.contains('splash--hidden')) {
        return;
    }

    splash.classList.add('splash--hidden');
    setTimeout(() => splash.remove(), FADE_MS);
};

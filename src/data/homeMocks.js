/** Placeholder content for the home layout (replace with API data). */

/** Placeholder images — use a CDN that returns 200 (Google gtv bucket now 403). */
const PLACEHOLDER = 'https://placehold.co';

export const BANNER_MOCK = {
  title: 'Onnum Onnum Moonu',
  metaLine: '2023 · Show · U/A 7+',
  subLine: 'Malayalam · Entertainment',
  description:
    'A light-hearted variety show bringing together comedy, music, and celebrity conversations.',
  imageUri: `${PLACEHOLDER}/1600x900/050012/d9468c/png?text=Smart+TV+Banner`,
};

function makeItems(prefix, count, w, h, label) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    title: `${label} ${i + 1}`,
    imageUri: `${PLACEHOLDER}/${w}x${h}/1a1a22/d9468c/png?text=${encodeURIComponent(`${label} ${i + 1}`)}`,
  }));
}

/** Multiple rails with many cards for vertical + horizontal scrolling. */
export const HOME_RAILS = [
  {
    id: 'series',
    title: 'Series shows',
    variant: 'portrait',
    items: makeItems('series', 20, 280, 420, 'Series'),
  },
  {
    id: 'trending',
    title: 'Trending now',
    variant: 'portrait',
    items: makeItems('trend', 16, 280, 420, 'Trending'),
  },
  {
    id: 'brands',
    title: 'Brand Rail',
    variant: 'landscape',
    items: makeItems('brand', 14, 400, 225, 'Brand'),
  },
  {
    id: 'movies',
    title: 'Movies for you',
    variant: 'landscape',
    items: makeItems('movie', 18, 400, 225, 'Movie'),
  },
  {
    id: 'kids',
    title: 'Kids & family',
    variant: 'portrait',
    items: makeItems('kids', 15, 280, 420, 'Kids'),
  },
  {
    id: 'doc',
    title: 'Documentaries',
    variant: 'landscape',
    items: makeItems('doc', 12, 400, 225, 'Doc'),
  },
  {
    id: 'sports',
    title: 'Sports & live',
    variant: 'landscape',
    items: makeItems('sport', 17, 400, 225, 'Sport'),
  },
  {
    id: 'continue',
    title: 'Continue watching',
    variant: 'portrait',
    items: makeItems('cont', 14, 280, 420, 'Continue'),
  },
];

/** First rail’s first card (spatial nav initial focus). */
export const INITIAL_CARD_FOCUS_KEY = `HOME_RAIL_${HOME_RAILS[0].id}_0`;

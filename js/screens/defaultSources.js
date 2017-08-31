import {Parsers} from './parsers'

/**
 * List of sources for the 'Cats of Reddit' pack.
 */
const redditCats = [
    {
        parser: Parsers.Reddit,
        title: '/r/Cats',
        url: 'https://www.reddit.com/r/cats/.json?limit=25&raw_json=1',
    },
    {
        parser: Parsers.Reddit,
        title: '/r/CatReactionGifs',
        url: 'https://www.reddit.com/r/catreactiongifs/.json?limit=25&raw_json=1',
    },
    {
        parser: Parsers.Reddit,
        title: '/r/Kittens',
        url: 'https://www.reddit.com/r/kittens/.json?limit=25&raw_json=1',
    },
    {
        parser: Parsers.Reddit,
        title: '/r/KittenGifs',
        url: 'https://www.reddit.com/r/kittengifs/.json?limit=25&raw_json=1',
    },
    {
        parser: Parsers.Reddit,
        title: '/r/CatGifs',
        url: 'https://www.reddit.com/r/CatGifs/.json?limit=25&raw_json=1',
    },
]

/**
 * List of sources for the 'Cats of Instagram' pack.
 */
const instagramCats = [
    {
        parser: Parsers.Instagram,
        title: 'Foster home for kittens in WA',
        url: 'https://www.instagram.com/twilight_foster_kittens/media/',
    },
    {
        parser: Parsers.Instagram,
        title: 'Bodega Cats',
        url: 'https://www.instagram.com/bodegacatsofinstagram/media/',
    },
    {
        parser: Parsers.Instagram,
        title: 'Welcome To Mini Cat Town!',
        url: 'https://www.instagram.com/minicattown/media/',
    },
    {
        parser: Parsers.Instagram,
        title: 'Foster_Babies',
        url: 'https://www.instagram.com/kitty_fostering_oz/media/',
    },
    {
        parser: Parsers.Instagram,
        title: 'midori',
        url: 'https://www.instagram.com/midorinotanbo/media/?hl=en',
    },
    {
        parser: Parsers.Instagram,
        title: 'Rachael and Foster Kittens',
        url: 'https://www.instagram.com/okfosterkitties/media/',
    },
    {
        parser: Parsers.Instagram,
        title: 'TinyKittens HQ',
        url: 'https://www.instagram.com/tinykittenshq/media/',
    },
    {
        parser: Parsers.Instagram,
        title: 'Foster Kittens In Bay Area, CA',
        url: 'https://www.instagram.com/jessies_foster_kittens/media/',
    },
    {
        parser: Parsers.Instagram,
        title: 'Kitten Foster Home 🐱 Vancouver Island, BC',
        url: 'https://www.instagram.com/whiskersnpurrs/media/',
    },
    {
        parser: Parsers.Instagram,
        title: 'ZucasKittens',
        url: 'https://www.instagram.com/zucaskittens/media/?hl=en',
    },
    {
        parser: Parsers.Instagram,
        title: 'love2foster',
        url: 'https://www.instagram.com/love2foster/media/',
    },
    {
        parser: Parsers.Instagram,
        title: 'Serena Boleto | Philadelphia',
        url: 'https://www.instagram.com/veggiedayz/media/',
    },
]

/**
 * The list of source packs that on by default in the app.
 */
export const defaultSourcePacks = [
    {
        key: '35eef7f5-7cec-4f4e-a130-d12b7f02fad3',
        sources: redditCats,
        title: 'Cats of Reddit',
    },
    {
        key: 'cb4acc7c-f06b-45a4-b695-dcbbea3a7248',
        sources: instagramCats,
        title: 'Cats of Instagram',
    },
]

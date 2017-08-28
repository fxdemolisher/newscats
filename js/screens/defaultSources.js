import {Parsers} from './parsers'

/**
 * The list of default sources for the app.
 * NOTE: the key MUST be unique.
 */
export const defaultSources = [
    {
        key: '93c9993f-72e2-41d0-a845-ee1155bb990f',
        parser: Parsers.Reddit,
        title: '/r/Cats',
        url: 'https://www.reddit.com/r/cats/.json?limit=25&raw_json=1',
    },
    {
        key: '59b86af7-505b-4576-8932-178577780bd7',
        parser: Parsers.Reddit,
        title: '/r/CatReactionGifs',
        url: 'https://www.reddit.com/r/catreactiongifs/.json?limit=25&raw_json=1',
    },
    {
        key: '45ae95e1-6fac-42e6-a3f2-d139e6d1cec2',
        parser: Parsers.Reddit,
        title: '/r/Kittens',
        url: 'https://www.reddit.com/r/kittens/.json?limit=25&raw_json=1',
    },
    {
        key: '663170d7-9392-4991-bc3e-bb498e493eb1',
        parser: Parsers.Reddit,
        title: '/r/KittenGifs',
        url: 'https://www.reddit.com/r/kittengifs/.json?limit=25&raw_json=1',
    },
    {
        key: 'fb1e6277-0d37-433d-9253-b5819edd64a6',
        parser: Parsers.Reddit,
        title: '/r/CatGifs',
        url: 'https://www.reddit.com/r/CatGifs/.json?limit=25&raw_json=1',
    },
    {
        key: '75fcbf30-cc8b-4178-a632-a26dbbf07f25',
        parser: Parsers.Instagram,
        title: 'Foster home for kittens in WA',
        url: 'https://www.instagram.com/twilight_foster_kittens/media/',
    },
    {
        key: '09084132-fa97-4349-a817-9eb0caa5587c',
        parser: Parsers.Instagram,
        title: 'Bodega Cats',
        url: 'https://www.instagram.com/bodegacatsofinstagram/media/',
    },
    {
        key: 'f2324820-dd6c-4531-9a56-1cc30c500387',
        parser: Parsers.Instagram,
        title: 'Welcome To Mini Cat Town!',
        url: 'https://www.instagram.com/minicattown/media/',
    },
    {
        key: '73bf5412-ca49-4ef6-b0a0-5bb967766f20',
        parser: Parsers.Instagram,
        title: 'Foster_Babies',
        url: 'https://www.instagram.com/kitty_fostering_oz/media/',
    },
    {
        key: '4edb738b-9796-4a1c-9854-295b394dfe2e',
        parser: Parsers.Instagram,
        title: 'midori',
        url: 'https://www.instagram.com/midorinotanbo/media/?hl=en',
    },
    {
        key: '871ddb96-fb48-4903-a0ea-27ec50d87f8d',
        parser: Parsers.Instagram,
        title: 'Rachael and Foster Kittens',
        url: 'https://www.instagram.com/okfosterkitties/media/',
    },
    {
        key: 'd2d484c9-100c-462a-831d-e90844331c89',
        parser: Parsers.Instagram,
        title: 'TinyKittens HQ',
        url: 'https://www.instagram.com/tinykittenshq/media/',
    },
    {
        key: 'a9410012-c302-46b6-bba9-dbb0be1174d7',
        parser: Parsers.Instagram,
        title: 'Foster Kittens In Bay Area, CA',
        url: 'https://www.instagram.com/jessies_foster_kittens/media/',
    },
    {
        key: '64a6f004-07f4-4e65-ad5f-a760a0df3683',
        parser: Parsers.Instagram,
        title: 'Kitten Foster Home 🐱 Vancouver Island, BC',
        url: 'https://www.instagram.com/whiskersnpurrs/media/',
    },
    {
        key: '2ead9e23-c9ed-44ec-a801-d0755a9b4a96',
        parser: Parsers.Instagram,
        title: 'ZucasKittens',
        url: 'https://www.instagram.com/zucaskittens/media/?hl=en',
    },
    {
        key: 'b9f5119c-89c1-4202-8f15-ec7e2ae0455c',
        parser: Parsers.Instagram,
        title: 'love2foster',
        url: 'https://www.instagram.com/love2foster/media/',
    },
    {
        key: 'b9f5119c-89c1-4202-8f15-ec7e2ae0455c',
        parser: Parsers.Instagram,
        title: 'Serena Boleto | Philadelphia',
        url: 'https://www.instagram.com/veggiedayz/media/',
    },
]

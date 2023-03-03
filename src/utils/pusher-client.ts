import Pusher from 'pusher-js';

var pusher = new Pusher('ecb7cbb82afafb863aa9', {
    cluster: 'ap2'
});

(global as any).pusher = pusher

export default pusher;
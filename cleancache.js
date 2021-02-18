var fetch = require('node-fetch');

fetch('https://api.cloudflare.com/client/v4/zones/a39ebcbe4e56a2e7f32867f988bde7df/purge_cache', {
    method: 'POST',
    headers: {
        //'X-Auth-Email': 'i@186526.xyz',
        'Authorization': ' Bearer ALz3Oq3tley5eJ9JBJ6nj6MHTsmLRWUyxhK29_QJ',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"purge_everything":true})
});

const http = require('http');
const fs = require('fs');

const readFile = (file)=> {
  return new Promise((resolve, reject)=> {
    fs.readFile(file, (err, data)=> {
      if(err){
        reject(err);
      }
      else {
        resolve(data.toString());
      }
    });
  });
};

const writeFile = (file, data)=> {
  return new Promise((resolve, reject)=> {
    fs.writeFile(file, data, (err, data)=> {
      if(err){
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
};

const addGuest = (guest)=> {
  return readFile('./guests.json')
    .then(data => {
      const guests = JSON.parse(data);
      let max = guests.reduce((acc, guest)=> {
        if(guest.id > acc){
          acc = guest.id;
        }
        return acc;
      }, 0);
      guest.id = max + 1;
      guests.push(guest);
      return writeFile('./guests.json', JSON.stringify(guests, null, 2));
    })
    .then(()=> {
      return guest;
    });
};

const port = process.env.PORT || 3000;

const server = http.createServer((req, res)=> {
    if(req.url === '/'){
        readFile('./index.html')
            .then( html => {
                res.write(html);
                res.end()
            })
    }
    else if(req.url === '/api/guests'){
        if(req.method === 'GET'){
            readFile('./guests.json')
                .then( html => {
                    res.write(html);
                    res.end();
                })
        }
        else if(req.method === 'POST'){
            let buffer = '';
            req.on('data', (chunk)=>{
                console.log(`Data to ${chunk}`)
                buffer += chunk;

            });
            req.on('end', ()=> {
                const guest = JSON.parse(buffer)
                addGuest(guest)
                    .then( g => {
                      console.log(g)
                        res.write(JSON.stringify(g));
                        res.end();
                    })
            })
        }
    }
    else {
        res.statusCode = 404;
        res.write('');
        res.end();
    }
})

server.listen(port, () => console.log(`Listening on ${ port }`))
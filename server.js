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
// const server = 
http.createServer((req, response) => {
    
    response.write("hello world")
    response.end()

}).listen(3000)
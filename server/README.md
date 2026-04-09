## Description

***League*** Simulation API (by default, for 3 simultaneously happening games).

Please mind that the tests will be added over the 11-12.04 weekend.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start
```

## Run tests

```bash
# unit tests
$ npm run test
```

## API overview

The *npm run start* should establish WebSocket server on port :8080 which you can query either using Postman *https://www.postman.com/*, or
provided client. To run client app just execute *node app* within /client/ directory. If everything went well you should be able to access *http://localhost/* at that point. What you see is a dead-simple, frameworkless piece of code (which was created just to test the API without 3rd party applications).

After connecting to WebSocket server you should be able to use one of the **provided methods**. (At that point please mind that the NestJs is by default using socket.io - which allows to use sperate communication channls which will be distinguish by "@param: name").

*** *TX* ***

  **subscribe** - by calling subscribe you declare willingess to watch the league of crtain @param:name.
  ```
    const mySocket = io('ws://localhost:8080');
    mySocket.emit('subscribe', {name: '<name goes here>'});
  ```
  **unsubscribe** - by calling unsubscribe you revoke you willingness to watch certain league, without affecting other watching clinents. Please mind that all the watching clients will be automatically unsubscribed when the watched league ends. This is to prevent memory overflow.
  ```
    mySocket.emit('unsubscribe', {name: '<name goes here>'});
  ```
  **start** - by calling start with @param:name, you will start the new League. This method can be called once per every 5 seconds. Client that starts the league is atuomatically subscribed as a watcher.
  ```
  mySocket.emit('start', {name: '<name goes here>'});
  ```
  **stop** - by calling stop with @param:name, you will abort the ongoing league (only if the name matches).
  ```
  mySocket.emit('stop', {name: '<name goes here>'});
  ```
  
*** *RX* ***
There are two events that you can listen to:

  **score** is called each time the one team (among all participating in the league) scores. The data contains only updated state of that game (to reduce net traffic). Recieved data will be JSON representation of the given object type:
  ``` { 
    host: string;
    guest: string;
    score: {
      host: number;
      guest: number;
    }
  }
  ```

  **summary** is called with array of games that are included in the league, at certain points of time.
    - When the league is started,
    - When client subscribes to the ongoing league,
    - When the league has ended,

  Listening to the *summary* event is a bare minimum that allows to create a functional client application, while the listening to the *score*
  allows the live-feed.

## Worth mentioning

The *Simulation* is based on the Math.random, but it is much more complex then just calling it once. Each *action* (1000ms period after which one of the participating teams scores) is devided into random amount of interactions between players of the selected game. During *action* ball is passed between players of two teams (random amount of times) and for a random distance. The team which passed the ball for the longer overall distance, scores. (that would allow to extend API by the info about the game it self in the future providing information about which player held the ball for what time and how far he kicked).

## Stay in touch

- Author - [Tomasz Swirski] https://www.linkedin.com/in/web-alchemist/

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

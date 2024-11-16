## Triple Triad
An implementation of Triple Triad from Final Fantasy VIII in Python and JavaScript. A 3x3 grid card game that allows multiplayer through the browser.

This project includes the web server, and game coordinator.

## Technologies
* [jinja](https://github.com/pallets/jinja)
* [websockets](https://github.com/python-websockets/websockets)
* [threading](https://docs.python.org/3/library/threading.html)

## Usage
You have two options for using this repository.

### Testing
1. Clone repository
2. Modify websocket `url` in `web_server/templates/base.html`

    from: `let url = "wss://{{ url }}/wss/triple-triad";`
    
    to: `let url = "wss://{{ url }}:5001";`

3. Execute the test script
    ```bash
    python3 ./test.py
    ```

### Installing
1. Clone repository
2. Add to your Apache2 Site config
```
WSGIScriptAlias /triple-triad <GIT_REPO>/only_web.wsgi
Alias /triple-triad/static <GIT_REPO>/web_server/static
ProxyPass /wss/triple-triad ws://localhost:5001        
```
3. Execute the game server
```bash
python3 ./only_game.py
```
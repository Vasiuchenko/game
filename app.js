const MINIMAL_BET = 1;
const SPEED = 80;
const END_LINE = 436;
const STORAGE = window.localStorage;


window.onload = () => {
    if (STORAGE.length == 0) {
        localStorage.cash = '50';
    }
    document.getElementById('select-line')
            .addEventListener('change', e => {
            new RaceGame(e.target.value);
            })
    new RaceGame();
};

class RaceGame {
    constructor(num = 3) {
        this.lines = num;
        this.cash = +STORAGE.getItem('cash');
        this.cashUI = document.getElementById('cash')
        this.content = document.querySelector('.minigames__cr--content');
        this.game = document.querySelector('.minigames__cr')
        this.createUI();
        this.addEvents();
    }

    createUI() {
        this.UI = ['bet', 'buttonStart','select-line'];
        let lines = '';

        for (let i = 0; i < this.lines; i++) {
            let height = (i + 1) * 100;
        
            lines += this.createLine(i + 1);

            this.game.style.height = height + 100 + 'px';
            this.content.style.height = height + 'px'
        }
        this.content.innerHTML = lines; 
        this.cashUI.innerText = this.cash;
        this.bugs = document.querySelectorAll('.minigames__cr--bug');
    }

    createLine(i) {
        return (`
            <div class="minigames__cr--line">
                <div class="minigames__cr--number">${i}</div>
                <input type="radio" value="${i}" name="bugs" id="bet-${i}" />
                <div class="minigames__cr--bug" id="bug-${i}" style="left:0px"></div>
            </div>
        `);
    }

    createModal(mode) {
        let result = document.createElement('div');
        result.setAttribute('class', 'minigames__cr--result');

        if (mode) {
            let win = document.createElement('div');

            win.setAttribute('class', 'winner');
            win.innerText = 'You are winner!'
            result.appendChild(win);
            return result;
        }
        let lose = document.createElement('div');

        lose.setAttribute('class', 'looser');
        lose.innerText = 'You are looser!'
        result.appendChild(lose);
        return result;
    }

    addEvents() {
        let bets = document.querySelectorAll('input[name="bugs"]');

        document.getElementById('buttonReset')
            .addEventListener('click', () => {
                let modal = document.querySelector('.minigames__cr--result');

                document.getElementById('bet').value = MINIMAL_BET;
                bets.forEach(item => {
                    item.checked = false;
                });
                this.bugs.forEach(item => {
                    item.style.left = '0px';
                });
                this.toggleUI(true);
                if(modal != null) modal.remove();
            });
        document.getElementById('buttonStart')
            .addEventListener('click', () => {
                let ready = false;
                bets.forEach(item => {
                    if (item.checked) ready = true;
                });
                if (ready) {
                    this.start();
                }
                
            });
    }

    start() {
        this.bet = +document.getElementById('bet').value;
        this.line = +document.querySelector('input[name="bugs"]:checked').value;
        this.speeds = this.getSpeeds();
        
        this.run();
    }

    run() {
        setTimeout(() => {
            let finish = false;
            this.bugs.forEach((item, i) => {
                let x = parseInt(item.style.left);
                x += this.speeds[i];
                if(x > END_LINE) {
                    finish = i + 1;
                } else {
                    item.style.left = `${x}px`;
                }
            });
            if(finish) {
                this.end(finish);
            } else {
                this.run();
            }
        }, SPEED);
    }

    getSpeeds() {
        let arr = [], speeds = [];
        let size = this.lines <= 5 ? 10 : 20;

        for(let i = 1; i <size; i++) {
            arr.push(i);
        }

        for(let i = 1; i <size; i++) {
            let value =  arr.splice(Math.floor(Math.random() * (size-i)),1);
            speeds.push(value.pop())
        }
        return speeds;
    }

    end(winNumber) {
        let result = false;
        if(winNumber === this.line) {
            this.cash += this.bet;
            this.content.prepend(this.createModal(true));
            STORAGE.setItem('cash', `${this.cash}`)
        } else {
            this.cash -= this.bet;
            this.content.prepend(this.createModal(false));
            STORAGE.setItem('cash', `${this.cash}`)
        }
        this.cashUI.innerText = this.cash;
        this.toggleUI(result);
    }

    toggleUI(mode = false) {
        this.UI.forEach(str => {
            let ui = document.getElementById(str);
            if (mode) {
                ui.classList.remove('disabled');
            } else {
                ui.classList.add('disabled');
            }
        })
    }
}
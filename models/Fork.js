const fs = require('fs');
const path = require('path');
const { resolve } = require('path');


class Fork {
    constructor(initiator1, initiator2,discipline, profit) {
        this.initiator1 = initiator1,
            this.initiator2 = initiator2,
            this.discipline = discipline,
            this.profit = profit,
            this.date = new Date().getTime()
    }

    static forks = [];

    toObj() {
        return {
            initiator1: this.initiator1,
            initiator2: this.initiator2,
            discipline: this.discipline,
            profit: this.profit,
            date: this.date
        }
    }
    static async getForks(){
        return Fork.forks;
    }
    async addFork() {
        await this._autoDeleteFork();
        if (this.initiator1 === undefined) {
            return
        }
        else{
            let iteration = 0;

            let savedForks = Fork.forks.filter((savedFork) => {
                if (!savedFork.initiator1.id || !savedFork.initiator2.id||!savedFork.initiator2.koef){
                    console.log(savedFork)
                }
                if (!this.initiator1.id || !this.initiator2.id||!this.initiator2.koef){
                    console.log('pizda v vilke')
                }
                if (savedFork.initiator1.id === this.initiator1.id &&
                    savedFork.initiator2.id === this.initiator2.id &&
                    savedFork.initiator2.koef === this.initiator2.koef) {
                        return savedFork
                }
                iteration++;
            })
            if (savedForks.length === 0) {
                Fork.forks.push(this.toObj());
            } else {
                if (savedForks[0].initiator2.koef === this.initiator2.koef &&
                    savedForks[0].initiator2.koef_value === this.initiator2.koef_value) {
                    // не делаем ничего т.к. это старая вилка которая уже была найдена
                } else {
                    Fork.forks.splice(iteration, 1);
                    Fork.forks.push(this.toObj());
                }
            }
        }
    }

    async _autoDeleteFork() {
        let iteration = 0;
        Fork.forks.map((fork) => {
            if ((new Date().getTime() - fork.date) > 120000) {
                Fork.forks.splice(iteration, 1);
            }
        })
    }
}

module.exports = Fork;
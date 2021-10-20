import Vue from 'vue';
var processingClick = false;
document.addEventListener('mousedown', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains("object") && !processingClick) {
        processingClick = true;
        game.vue.itemClicked(e.target);
    }
});

var game = {
    vue: null,
    vueConfig: {
        el: "#game",
        data: {
            isPortrait: false,
            isStarted: false,
            isStarting: false,
            isShowingTitle: true,
            isShowingInfo: false,
            objectFactory: null,
            countDown: 6,
            points: 0
        },
        created: function () {
            window.addEventListener('orientationchange', this.getOrientation);
            window.addEventListener('resize', this.getOrientation);
            this.getOrientation();
            this.startTitleCountdown();
        },
        computed: {

        },
        watch: {
            countDown: function () {
                let self = this;
                if (self.countDown == 0) {
                    self.isStarting = false;
                    self.isStarted = true;
                    return;
                }
                setTimeout(function () {
                    self.countDown -= 1;
                }, 1000)
            },
            isShowingInfo: function () {
                if (!this.isShowingInfo && !this.isShowingTitle) {
                    this.isStarting = true;
                    this.countDown = 4;
                }
            },
            isStarted: function () {
                this.startGame();
            }
        },
        methods: {
            getOrientation: function () {
                console.log(window.innerHeight > window.innerWidth)
                this.isPortrait = window.innerHeight > window.innerWidth;
            },
            startTitleCountdown: function () {
                //title = 5000 and info = 5000. If needing to update, update in css aswell.
                let self = this;
                setTimeout(function () {
                    self.isShowingTitle = false;
                    setTimeout(function () {
                        self.isShowingInfo = true;
                        setTimeout(function () {
                            self.isShowingInfo = false;
                        }, 6000)
                    }, 300);
                }, 5000);
            },
            startGame: function () {
                let self = this;
                self.objectFactory = new ObjectFactory([self.$refs.craterOne, self.$refs.craterTwo, self.$refs.craterThree, self.$refs.craterFour, self.$refs.craterFive]);
                self.objectFactory.Start();
            },
            itemClicked: function (e) {
                var index = e.attributes['data-index'].value;
                var type = e.attributes['data-type'].value;
                var slot = this.objectFactory.slots.filter(function (x) { return x.index == index })[0];
                if (slot) {
                    slot.running = false;
                    Velocity(slot.element, "stop");
                    slot.Explode();

                    this.points += type == "Turkey"
                        ? 1
                        : 5;
                }
                processingClick = false;
            }
        },
        onResize: function () {
            this.getOrientation();
        },
        orientationChange: function () {
            this.getOrientation();
        },
        onSelectStart: function () {
        }
    },
    init: function () {
        game.vue = new Vue(game.vueConfig);
    }
}

const ItemTypes = { Turkey: "Turkey", Alien: "Alien" }

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function ObjectFactory(refs) {
    this.numSlots = refs.length;
    this.refs = refs;
    this.slots = [];
}

function Slot(ref, i)
{
    this.ref = ref;
    this.index = i;
    this.initialDelay = random(1000, 6000);
    this.running = true;
    this.betweenDelay = random(700, 1300);
    this.moveSpeed = random(500, 1500);
    this.acceleratedStep = 3;
}

function getElement(index, type) {
    var config = getConfig(index, type);

    var element = document.createElement('img');
    element.id = type + "_" + index;
    element.setAttribute('unselectable', "on");
    element.setAttribute('draggale', 'false');
    element.setAttribute('src', config.url);
    element.setAttribute('data-index', index);
    element.setAttribute('data-type', type);
    element.setAttribute('data-top', config.top);
    element.setAttribute('data-bottom', config.bottom);
    if (config.mid)
        element.setAttribute('data-middle', config.mid);
    element.setAttribute('data-extended-z', config.extendedZ);
    element.setAttribute('data-contracted-z', config.contractedZ);
    element.classList.add(config.class);
    element.classList.add('object');

    return element;
}

function getConfig(index, type) {
    switch (index) {
        case 0:
            return type == ItemTypes.Turkey
                ? { class: "turkey", url: "client/src/svg/turkey_one.svg", top: "-12.5%", bottom: "30%", mid: "2%", extendedZ: "202", contractedZ: "201" }
                : { class: "alien", url: "client/src/img/alien_one.png", top: "1%", bottom: "-47%", extendedZ: "201", contractedZ: "201" }
        case 1:
            return type == ItemTypes.Turkey
                ? { class: "turkey", url: "client/src/svg/turkey_two.svg", top: "-12.5%", bottom: "30%", mid: "-1%", extendedZ: "203", contractedZ: "201" }
                : { class: "alien", url: "client/src/img/alien_two.png", top: "1%", bottom: "-53%", extendedZ: "201", contractedZ: "201" }
        case 2:
            return type == ItemTypes.Turkey
                ? { class: "turkey", url: "client/src/svg/turkey_three.svg", top: "-13.25%", bottom: "15%", mid: "1%", extendedZ: "204", contractedZ: "203" }
                : { class: "alien", url: "client/src/img/alien_three.png", top: "1%", bottom: "-56%", extendedZ: "203", contractedZ: "203" }
        case 3:
            return type == ItemTypes.Turkey
                ? { class: "turkey", url: "client/src/svg/turkey_four.svg", top: "-10.5%", bottom: "30%", mid: "6%", extendedZ: "203", contractedZ: "201" }
                : { class: "alien", url: "client/src/img/alien_four.png", top: "8%", bottom: "-41%", extendedZ: "201", contractedZ: "201" }
        case 4:
            return type == ItemTypes.Turkey
                ? { class: "turkey", url: "client/src/svg/turkey_five.svg", top: "-11.25%", bottom: "30%", mid: "6%", extendedZ: "206", contractedZ: "204" }
                : { class: "alien", url: "client/src/img/alien_five.png", top: "3%", bottom: "-60%", extendedZ: "204", contractedZ: "204" }
    }
}

ObjectFactory.prototype.Start = function () {
    //for (var i = 0; i <= this.numSlots - 1; i++) {
    for (var i = 0; i <= 4; i++) {
        var slot = new Slot(this.refs[i], i);
        this.slots.push(slot);
        slot.Start();
    }
}

Slot.prototype.Move = function () {
    clearTimeout(this.moveTimer);
    let self = this;
    if (!self.running)
        return;
    var fullMovement = this.element.attributes["data-middle"] != null ? random(0, 10) % 2 == 0 : true;

    //if it's the full amount, we need to pop the zIndex after animation to make the bird fully clickable.
    if (fullMovement) {
        Velocity(self.element, { top: self.element.attributes.getNamedItem('data-top').value }, { duration: 500 }).then(function (e) {
            self.element.style.zIndex = self.element.attributes.getNamedItem('data-extended-z').value;
        });
    }
    else {
        Velocity(self.element, { top: self.element.attributes.getNamedItem('data-middle').value }, { duration: 500 });
    }

    this.hideTimer = setTimeout(function (x) {
        self.Hide();
    }, self.betweenDelay)
}

Slot.prototype.Hide = function () {
    clearTimeout(this.hideTimer);
    let self = this;
    if (!self.running)
        return;
    this.element.style.zIndex = self.element.attributes.getNamedItem('data-contracted-z').value;
    
    Velocity(self.element, { top: self.element.attributes.getNamedItem('data-bottom').value }, { duration: 500 });
    this.moveTimer = setTimeout(function (x) {
        self.Move();
    }, self.betweenDelay)
    
}

Slot.prototype.Start = function () {
    let self = this;

    var element = getElement(self.index, ItemTypes.Turkey);
    self.ref.append(element);
    self.element = element;
    
    setTimeout(function (x) {
        self.Move();
    }, this.initialDelay);
}

Slot.prototype.Stop = function () {
    this.animation('stop', true);
}

Slot.prototype.Explode = function () {
    let self = this;
    self.element.addEventListener('load', function () {
        setTimeout(function () {
            self.element.classList.add('fadeOut')
            setTimeout(function () {
                self.element.remove();
                self.Regen();
            }, 500);
        }, 500);
    })
    self.element.src = 'client/src/svg/poof.svg';
}

Slot.prototype.Regen = function () {
    let self = this;
    var element = getElement(self.index, random(0, 9) % 3 == 0 ? ItemTypes.Alien : ItemTypes.Turkey);
    self.ref.append(element);
    self.element = element;
    self.running = true;
    setTimeout(function (x) {
        self.Move();
    }, 750);
}

document.addEventListener("DOMContentLoaded", function (event) {
    game.init();
})
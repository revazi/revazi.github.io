var looping = false, myPart, sounds, phrases = {}, patterns = {};

function preload() {

    sounds = {
        'kick1': {
            'sound': loadSound('../assets/kick_1.wav'),
            'effects': {}
        },
        'kick2': {
            'sound': loadSound('../assets/kick_2.wav'),
            'effects': {}
        },
        'snare': {
            'sound': loadSound('../assets/snare.wav'),
            'effects': {}
        },
        'rim': {
            'sound': loadSound('../assets/rim-shot.wav'),
            'effects': {}
        },
        'hat-closed': {
            'sound': loadSound('../assets/hat-closed.wav'),
            'effects': {}
        },
        'hat-open': {
            'sound': loadSound('../assets/hat-open.wav'),
            'effects': {}
        },
        'tom-high': {
            'sound': loadSound('../assets/tom-high_yamaha.wav'),
            'effects': {}
        },
        'tom-low': {
            'sound': loadSound('../assets/tom-low-floor.wav'),
            'effects': {}
        },
        'cymbal': {
            'sound': loadSound('../assets/cymbal.wav'),
            'effects': {}
        },
        'maracas': {
            'sound': loadSound('../assets/maraca.wav'),
            'effects': {}
        },
        'zap': {
            'sound': loadSound('../assets/zap_v1.wav'),
            'effects': {}
        },
        'sample': {
            'sound': loadSound('../assets/zap_v2.wav'),
            'effects': {}
        }
    }

}

function setup() {
    // Sets the screen to be 720 pixels wide and 400 pixels high
    var pads = selectAll('.Drumpads-pad');
    var knobs = selectAll('.knob');
    var phraseName = null;
    var bpmknob = select("#knobBpm");
    var volknob = select('#knobVolume');
    var panknob = select('#knobPan');
    var startLoop = select('#startLoop');
    var stopLoop = select('#stopLoop');

    // console.log(select('.knob-target', select("#knobFeedback .knob-target")));
    var delayFeedback = select('.knob-target', select("#knobFeedback")) != null
        ? select('.knob-target', select("#knobFeedback")) : null;
    var delayFilterFreq = select('.knob-target', select("#delayFreqFilter")) != null
        ? select('.knob-target', select("#delayFreqFilter")) : null;
    var delayTime = select('.knob-target', select("#knobDelayTime")) != null
        ? select('.knob-target', select("#knobDelayTime")) : null;
    var reverbDecay = select('.knob-target', select("#knobReverbDecay")) != null
        ? select('.knob-target', select("#knobReverbDecay")) : null;
    var reverbTime = select('.knob-target', select("#knobReverbTime")) != null
        ? select('.knob-target', select("#knobReverbTime")) : null;
    var filterSwitch = select('#filterType') != null ? select('#filterType') : null;
    var filterType = null;
    var bpmDisplay = select("#bpmDisplay");
    var body = select("body");
    var dragMouse = {x: 0, y: 0};
    var dragControl = null;
    var changeX, changeY;
    var target = null;
    var activePad = null;
    var activePhrase = null;
    var sequence = null;
    var sequencerPads = selectAll('.Sequencerpads-pad');
    var StartStopLoop = select("#start-stop-loop");
    var reverb = new p5.Reverb();
    var filter = new p5.LowPass();

    var instrumentParts = ['kick1', 'kick2', 'snare', 'rim',
        'hat-closed', 'hat-open', 'tom-high', 'tom-low',
        'cymbal', 'maracas', 'zap', 'sample'];

    instrumentParts.map(function (el) {
        patterns[el] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        phrases[el] = new p5.Phrase(el, makeSound(sounds[el]), patterns[el]);

        sounds[el].effects.lowPassfilter = new p5.LowPass();
        sounds[el].effects.highPassfilter = new p5.HighPass();
        sounds[el].effects.delay = new p5.Delay();
        sounds[el].effects.reverb = new p5.Reverb();
        sounds[el].sound.disconnect();
        // sounds[el].sound.connect(sounds[el].effects.env);
        sounds[el].effects.reverb.process(sounds[el].sound, 0.1, 1, 0);
        sounds[el].effects.delay.process(sounds[el].sound, 0, 0, 0);
        // sounds[el].sound.connect(sounds[el].effects.reverb);
        sounds[el].sound.connect(sounds[el].effects.highPassfilter);
        sounds[el].sound.connect(sounds[el].effects.highPassfilter);
        sounds[el].sound.connect(sounds[el].effects.delay);

        // sounds[el].effects.reverb.set(0, 0);
        // sounds[el].effects.delay.filter(0);
        // sounds[el].effects.delay.delayTime(0.1);
        // sounds[el].effects.delay.feedback(0.1);
        // sounds[el].effects.highPassfilter.amp(sounds[el].effects.env);
        // sounds[el].sound.amp(sounds[el].effects.env);
    });

    myPart = new p5.Part();
    myPart.setBPM(80);
    // myPart.loop();
    myPart.onStep(function (stepData) {
        // console.log(stepData);
    });

    startLoop.mouseClicked(function () {
        if (myPart != null) {
            myPart.loop();
            looping = true;
            this.addClass('active');
        }
    });
    stopLoop.mouseClicked(function () {
        if (myPart != null) {
            myPart.stop();
            looping = false;
            startLoop.removeClass('active');
        }
    });

    filterSwitch.mouseClicked(function () {
        if (this.attribute('data-high') == this.attribute('data-value')) {
            this.attribute('data-value', this.attribute('data-low'));
            this.html('L-pass');
        } else {
            this.html('H-pass');
            this.attribute('data-value', this.attribute('data-high'));
        }
    });
    // StartStopLoop.mouseClicked(function(){
    //   myPart.noLoop();
    // });

    knobs.map(function (knob) {
        knob.mousePressed(function (mouse) {
            dragMouse.x = mouse.screenX;
            dragMouse.y = mouse.screenY;
            dragControl = this;
        });
    });

    body.mouseMoved(function (mouse) {
        if (dragControl != null) {
            changeX = mouse.screenX - dragMouse.x;
            changeY = mouse.screenY - dragMouse.y
            target = select('.knob-target', dragControl);
            step = dragControl.attribute('data-step') != null ? dragControl.attribute('data-step') : 1;
            minValue = dragControl.attribute('data-minVal') != null ? dragControl.attribute('data-minVal') : 0;
            maxValue = dragControl.attribute('data-maxVal') != null ? dragControl.attribute('data-maxVal') : 200;
            targetValue = parseInt(target.attribute('data-value'));
            console.log(changeY);
            if (target != 0) {
                if (changeY <= 0) {
                    (target.value() > maxValue - 1)
                        ? target.value(maxValue)
                        : target.value(targetValue + (-changeY * step));
                } else if (changeY > 0) {
                    (target.value() <= parseInt(minValue))
                        ? target.value(minValue)
                        : target.value(targetValue - (changeY * step));
                }
                changeProperty(dragControl.attribute('data-prop'), target.value());
                changeDisplay(dragControl.attribute('data-display'), target.value());
            }

        }
    });

    body.mouseReleased(function () {
        if (target != null) {
            target.attribute('data-value', target.value());
            dragControl = null;
            target = null;
            // delayTime = null;
            // delayFeedback = null;
            // delayFilterFreq = null
        }
    });

    pads.map(function (pad) {
        pad.mouseClicked(function (el) {

            phraseName = pad.attribute('id');
            // if (!looping) {
            sounds[phraseName].sound.play();
            // sounds[phraseName].effects.reverb.set(0.1,1);
            // sounds[phraseName].effects.reverb.set(0,0);

            // }
            pads.map(function (p) {
                p.removeClass('recording');
            });
            pad.addClass('recording');
            if (myPart.getPhrase(phraseName) == null && phrases[phraseName] != null) {
                myPart.addPhrase(phrases[phraseName]);
                // if (looping) {
                pad.addClass('playing');
                // }
                activePad = pad;
            } else if (activePad == pad) {
                myPart.removePhrase(phraseName);
                // if (looping) {
                pad.removeClass('recording');
                pad.removeClass('playing');
                // }
                activePad = null;
            } else {
                activePad = pad;
            }

            if (activePad != null) {
                activePhrase = myPart.getPhrase(activePad.attribute('id'));
                console.log(activePhrase)
                sequencerPads.map(function (el, i) {
                    el.removeClass('active');
                    if (!!activePhrase.sequence[i]) {
                        el.addClass('active');
                    }
                });
            } else {
                sequencerPads.map(function (el) {
                    el.removeClass('active');
                });
            }

        });
    });

    sequencerPads.map(function (el, i) {
        el.mouseClicked(function () {
            sequence = activePhrase.sequence;
            if (!!activePhrase.sequence[i]) {
                sequence[i] = 0;
                myPart.replaceSequence(activePhrase.name, sequence);
                el.removeClass('active');
            } else {
                sequence[i] = 1;
                myPart.replaceSequence(activePhrase.name, sequence);
                el.addClass('active');
            }
        });
    });

    function makeSound(soundObj) {
        if (reverb != null) {
            // reverb.process(sound, 3, 2);
        }
        return function (time, playbackRate) {
            soundObj.sound.rate(playbackRate);
            // soundObj.sound.amp(soundObj.effects.env);
            soundObj.sound.play(time);
        }
    }

    function changeDisplay(id, value) {
        display = select('#' + id);
        display.value(value);
    }

    function changeProperty(prop, value) {
        // sounds.kick1.disconnect();
        // delay = new p5.Delay();
        // sounds.kick1.connect(filter);
        // sounds.kick1.connect(delay);
        minValue = dragControl.attribute('data-minVal') != null ? dragControl.attribute('data-minVal') : 0;
        maxValue = dragControl.attribute('data-maxVal') != null ? dragControl.attribute('data-maxVal') : 200;
        rotationDegree = Math.abs(minValue - value) * (270 / (maxValue - minValue));
        rotationKnob = select('.knob-rotator', dragControl);
        rotationKnob.style('rotate', rotationDegree);

        switch (prop) {
            case 'bpm':
                myPart.setBPM(value);
                break;
            case 'low-pass':
                break;
            case 'freq':
                if (activePad != null && filterSwitch != null) {
                    filterType = filterSwitch.attribute('data-value') != null ? filterSwitch.attribute('data-value') : null;
                    console.log(sounds[activePad.attribute('id')].effects[filterType].freq(+value));
                }
                break;
            case 'res':
                if (activePad != null && filterSwitch != null) {
                    filterType = filterSwitch.attribute('data-value') != null ? filterSwitch.attribute('data-value') : null;
                    sounds[activePad.attribute('id')].effects[filterType].res(+value);
                }
                break;
            case 'amp':
                if (activePad != null && filterSwitch != null) {
                    filterType = filterSwitch.attribute('data-value') != null ? filterSwitch.attribute('data-value') : null;
                    sounds[activePad.attribute('id')].effects[filterType].amp(+value * 0.01);
                }
                break;
            case 'delayTime':
                if (activePad != null && delayTime != null) {
                    value = value == 0 ? 1 : value;
                    sounds[activePad.attribute('id')].effects.delay.process(
                        sounds[activePad.attribute('id')].sound, value * 0.01,
                        parseFloat(delayFeedback.value()) != null ? parseFloat(delayFeedback.value()) * 0.01 : 0,
                        delayFilterFreq.value() != null ? delayFilterFreq.value() : 0
                    );
                }
                break;
            case 'feedback':
                if (activePad != null && delayFeedback != null) {
                    value = value == 0 ? 1 : value;
                    sounds[activePad.attribute('id')].effects.delay.process(
                        sounds[activePad.attribute('id')].sound,
                        delayTime.value() != null ? parseFloat(delayTime.value()) * 0.01 : 0,
                        value * 0.01,
                        delayFilterFreq.value() != null ? parseFloat(delayFilterFreq.value()) : 0
                    );
                }
                break;
            case 'delayFreqFilter':
                if (activePad != null && delayFilterFreq != null) {
                    value = value == 0 ? 1 : value;

                    // sounds[activePad.attribute('id')].effects.delay.filter(value);
                    sounds[activePad.attribute('id')].effects.delay.process(
                        sounds[activePad.attribute('id')].sound,
                        delayTime.value() != null ? parseFloat(delayTime.value()) * 0.01 : 0,
                        value * 0.01,
                        delayFilterFreq.value() != null ? parseFloat(delayFilterFreq.value()) : 0
                    );
                    // sounds[activePad.attribute('id')].effects.delay.process(
                    //     sounds[activePad.attribute('id')].sound,
                    //     delayTime.value() != null ? parseFloat(delayTime.value()) * 0.01 : 0,
                    //     delayFeedback.value() != null ? parseFloat(delayFeedback.value() * 0.01) : 0,
                    //     value
                    // );
                }
                break;
            case 'reverbTime':
                console.log('reverbTime');
                if (activePad != null)
                    sounds[activePad.attribute('id')].effects.reverb.set(value * 0.1, reverbDecay.value());
                break;
            case 'reverbDecay':
                console.log('reverbDecay');
                if (activePad != null)
                sounds[activePad.attribute('id')].effects.reverb.set(reverbTime.value()*0.1,value);
                    break;
            case 'pan':
                sounds[activePad.attribute('id')].sound.pan(value * 0.01);
                break;
            default:
            // console.log('no luck');
        }
    }
}

function draw() {

}





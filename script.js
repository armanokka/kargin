
const wheel = document.getElementById("wheel");
const spinBtn = document.querySelector(".start_button");
const karginPhoto = document.querySelector(".kargin__photo")
const fiftyTwo = document.querySelector(".fiftytwo")

const min = 2;
const max = 31;
// fromElement.value = min;
// toElement.value = max;


const {data, labels, pieColors} = generateData(min, max)


let numbers = []
for (var i = 1; i < 30; i++) {
    numbers.push(i)
}

function generateData(from, to) {
    const data = [];
    const labels = [];
    var pieColors = [];
    for (var i = from; i <= to; i++) {
        data.push(16)
        labels.push(i)
        pieColors.push(i % 2 === 0 ? '#CF1200': '#101616')
    }
    shuffleArray(labels)

    data.push(32)
    labels.push('Х2')
    pieColors.push('#236729')
    return {data, labels, pieColors}
}

//Create chart
let myChart = new Chart(wheel, {
    //Plugin for displaying text on pie chart
    plugins: [ChartDataLabels],
    //Chart Type Pie
    type: "pie",
    data: {
        //Labels(values which are to be displayed on chart)
        labels: labels,
        //Settings for dataset/pie
        datasets: [
            {
                backgroundColor: pieColors,
                data: data,
            },
        ],
    },
    options: {
        //Responsive chart
        responsive: true,
        animation: { duration: 0 },
        plugins: {
            //hide tooltip and legend
            tooltip: false,
            legend: {
                display: false,
            },
            //display labels inside pie chart
            datalabels: {
                color: "#ffffff",
                // offset: 9,
                align: 'start',
                // rotation: 90,
                anchor: 'end',
                formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                font: { size: 28},
            },
        },
    },
});
//display value based on the randomAngle


//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let additionalRotation = 51;

let changePhotoTimeout;
//Start spinning
var audio = new Audio('assets/rotation.m4a');
spinBtn.addEventListener("click", () => {
    audio.pause();
    let loopAudio = true
    audio = new Audio('assets/rotation-v2.m4a');
    audio.addEventListener('ended', function(){
        if(loopAudio){
            audio.play();
        }
    });
    audio.play();

    clearInterval(changePhotoTimeout);
    spinBtn.disabled = true;
    spinBtn.textContent = 'СТАВКА СДЕЛАНА'
    karginPhoto.setAttribute("src", "assets/kargin2.png")
    // fiftyTwo.style.animationPlayState = 'paused'
    //Generate random degrees to stop at
    let randomDegree =  getRandomDegree()
    //Interval for rotation animation
    let rotationInterval = window.setInterval(() => {
        //Set rotation for piechart
        /*
        Initially to make the piechart rotate faster we set additionalRotation to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
        */
        myChart.options.rotation = myChart.options.rotation + additionalRotation;
        //Update chart with new value;
        myChart.update();
        if (myChart.options.rotation >= 360) {
            count += 1;
            // console.log('decreased rotation count', count, 'additionalRotation', additionalRotation)
            if (additionalRotation - 5 > 0) {
                additionalRotation -= 5;
            }
            myChart.options.rotation = 0
        } else if (count >= 11 && Math.floor(myChart.options.rotation / 10) == Math.floor(randomDegree / 10)) {
            // valueGenerator(randomDegree);
            spinBtn.disabled = false;
            spinBtn.textContent = 'ПОБЕДИТЕЛЬ ВЫБРАН'

            karginPhoto.setAttribute('src', 'assets/kargin3.png')
            fiftyTwo.style.animationPlayState = 'running'
            clearInterval(rotationInterval);
            count = 0;
            additionalRotation = 51;
            myChart.update();

            loopAudio = false;
            audio.pause();
            audio = new Audio('assets/finish-v2.m4a');
            audio.play();
            confetti();

            changePhotoTimeout = setTimeout(()=>{
                // let photos = ['assets/kargi54.png', 'assets/kargin6.png', 'assets/kargin7.png', 'assets/kargin1.png']
                // let randPhoto = photos[Math.floor(Math.random()*photos.length)];
                karginPhoto.setAttribute('src', 'assets/kargin1.png');
                spinBtn.textContent = 'Запустить Шарманку';
            }, 5000);
        }
    }, 20);
});



// let from = document.getElementById('from')
let toElement = document.getElementById('to')
let fromElement = document.getElementById('from')

fromElement.addEventListener('input',  inputHandler)
toElement.addEventListener('input', inputHandler)

// getRandomDegree returns random degree but modifies it so that the triangle with match to the middle of the wheel cell
function getRandomDegree() {
    let randomDegree =  Math.floor(Math.random() * 359) + 1;
    let cellStepDegree = 360 / (max - min + 1); // each cell takes this many degrees
    return (Math.floor(randomDegree / cellStepDegree) + 0.5) * cellStepDegree;
}

function inputHandler(e) {
    let from = Number(fromElement.value)
    let to = Number(toElement.value)
    if (from == null || to == null || from > to) {
        return
    }

    const {data, labels, pieColors} = generateData(from, to)
    // console.log('here', from, to)
    // console.log(data, labels, pieColors)
    myChart.data.labels = labels;
    myChart.data.datasets =  [
        {
            backgroundColor: pieColors,
            data: data,
        },
    ];
    myChart.update()
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index
        // Swap elements
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


document.querySelector(".start_button_overflow").addEventListener('click', ()=>{
    spinBtn.click();
})

function confetti() {
    tsParticles.load({
        id: "tsparticles",
        options: {
            "autoPlay": true,
            "background": {
                "color": {
                    "value": ""
                },
                "image": "",
                "position": "",
                "repeat": "",
                "size": "",
                "opacity": 1
            },
            "backgroundMask": {
                "composite": "destination-out",
                "cover": {
                    "color": {
                        "value": "#fff"
                    },
                    "opacity": 1
                },
                "enable": false
            },
            "clear": true,
            "defaultThemes": {},
            "delay": 0,
            "fullScreen": {
                "enable": true,
                "zIndex": 0
            },
            "detectRetina": true,
            "duration": 0,
            "fpsLimit": 120,
            "interactivity": {
                "detectsOn": "window",
                "events": {
                    "onClick": {
                        "enable": false,
                        "mode": []
                    },
                    "onDiv": {
                        "selectors": [],
                        "enable": false,
                        "mode": [],
                        "type": "circle"
                    },
                    "onHover": {
                        "enable": false,
                        "mode": [],
                        "parallax": {
                            "enable": false,
                            "force": 2,
                            "smooth": 10
                        }
                    },
                    "resize": {
                        "delay": 0.5,
                        "enable": true
                    }
                },
                "modes": {
                    "trail": {
                        "delay": 1,
                        "pauseOnStop": false,
                        "quantity": 1
                    },
                    "attract": {
                        "distance": 200,
                        "duration": 0.4,
                        "easing": "ease-out-quad",
                        "factor": 1,
                        "maxSpeed": 50,
                        "speed": 1
                    },
                    "bounce": {
                        "distance": 200
                    },
                    "bubble": {
                        "distance": 200,
                        "duration": 0.4,
                        "mix": false,
                        "divs": {
                            "distance": 200,
                            "duration": 0.4,
                            "mix": false,
                            "selectors": []
                        }
                    },
                    "connect": {
                        "distance": 80,
                        "links": {
                            "opacity": 0.5
                        },
                        "radius": 60
                    },
                    "grab": {
                        "distance": 100,
                        "links": {
                            "blink": false,
                            "consent": false,
                            "opacity": 1
                        }
                    },
                    "push": {
                        "default": true,
                        "groups": [],
                        "quantity": 4
                    },
                    "remove": {
                        "quantity": 2
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4,
                        "factor": 100,
                        "speed": 1,
                        "maxSpeed": 50,
                        "easing": "ease-out-quad",
                        "divs": {
                            "distance": 200,
                            "duration": 0.4,
                            "factor": 100,
                            "speed": 1,
                            "maxSpeed": 50,
                            "easing": "ease-out-quad",
                            "selectors": []
                        }
                    },
                    "slow": {
                        "factor": 3,
                        "radius": 200
                    },
                    "light": {
                        "area": {
                            "gradient": {
                                "start": {
                                    "value": "#ffffff"
                                },
                                "stop": {
                                    "value": "#000000"
                                }
                            },
                            "radius": 1000
                        },
                        "shadow": {
                            "color": {
                                "value": "#000000"
                            },
                            "length": 2000
                        }
                    }
                }
            },
            "manualParticles": [],
            "particles": {
                "bounce": {
                    "horizontal": {
                        "value": 1
                    },
                    "vertical": {
                        "value": 1
                    }
                },
                "collisions": {
                    "absorb": {
                        "speed": 2
                    },
                    "bounce": {
                        "horizontal": {
                            "value": 1
                        },
                        "vertical": {
                            "value": 1
                        }
                    },
                    "enable": false,
                    "maxSpeed": 50,
                    "mode": "bounce",
                    "overlap": {
                        "enable": true,
                        "retries": 0
                    }
                },
                "color": {
                    "value": "#00ff00",
                    "animation": {
                        "h": {
                            "count": 0,
                            "enable": true,
                            "speed": 50,
                            "decay": 0,
                            "delay": 0,
                            "sync": false,
                            "offset": 0
                        },
                        "s": {
                            "count": 0,
                            "enable": false,
                            "speed": 1,
                            "decay": 0,
                            "delay": 0,
                            "sync": true,
                            "offset": 0
                        },
                        "l": {
                            "count": 0,
                            "enable": false,
                            "speed": 1,
                            "decay": 0,
                            "delay": 0,
                            "sync": true,
                            "offset": 0
                        }
                    }
                },
                "effect": {
                    "close": true,
                    "fill": true,
                    "options": {},
                    "type": []
                },
                "groups": {},
                "move": {
                    "angle": {
                        "offset": 0,
                        "value": 90
                    },
                    "attract": {
                        "distance": 200,
                        "enable": false,
                        "rotate": {
                            "x": 3000,
                            "y": 3000
                        }
                    },
                    "center": {
                        "x": 50,
                        "y": 50,
                        "mode": "percent",
                        "radius": 0
                    },
                    "decay": 0.1,
                    "distance": {},
                    "direction": "none",
                    "drift": 0,
                    "enable": true,
                    "gravity": {
                        "acceleration": 10,
                        "enable": true,
                        "inverse": false,
                        "maxSpeed": 50
                    },
                    "path": {
                        "clamp": true,
                        "delay": {
                            "value": 0
                        },
                        "enable": false,
                        "options": {}
                    },
                    "outModes": {
                        "default": "destroy",
                        "bottom": "destroy",
                        "left": "destroy",
                        "right": "destroy",
                        "top": "none"
                    },
                    "random": false,
                    "size": false,
                    "speed": {
                        "min": 10,
                        "max": 20
                    },
                    "spin": {
                        "acceleration": 0,
                        "enable": false
                    },
                    "straight": false,
                    "trail": {
                        "enable": false,
                        "length": 10,
                        "fill": {}
                    },
                    "vibrate": false,
                    "warp": false
                },
                "number": {
                    "density": {
                        "enable": false,
                        "width": 1920,
                        "height": 1080
                    },
                    "limit": {
                        "mode": "delete",
                        "value": 0
                    },
                    "value": 0
                },
                "opacity": {
                    "value": {
                        "min": 0,
                        "max": 1
                    },
                    "animation": {
                        "count": 0,
                        "enable": true,
                        "speed": 2,
                        "decay": 0,
                        "delay": 0,
                        "sync": false,
                        "mode": "auto",
                        "startValue": "max",
                        "destroy": "min"
                    }
                },
                "reduceDuplicates": false,
                "shadow": {
                    "blur": 0,
                    "color": {
                        "value": "#000"
                    },
                    "enable": false,
                    "offset": {
                        "x": 0,
                        "y": 0
                    }
                },
                "shape": {
                    "close": true,
                    "fill": true,
                    "options": {},
                    "type": "square"
                },
                "size": {
                    "value": {
                        "min": 2,
                        "max": 4
                    },
                    "animation": {
                        "count": 0,
                        "enable": false,
                        "speed": 5,
                        "decay": 0,
                        "delay": 0,
                        "sync": false,
                        "mode": "auto",
                        "startValue": "random",
                        "destroy": "none"
                    }
                },
                "stroke": {
                    "width": 0,
                    "color": {
                        "value": "",
                        "animation": {
                            "h": {
                                "count": 0,
                                "enable": false,
                                "speed": 0,
                                "decay": 0,
                                "delay": 0,
                                "sync": false,
                                "offset": 0
                            },
                            "s": {
                                "count": 0,
                                "enable": false,
                                "speed": 1,
                                "decay": 0,
                                "delay": 0,
                                "sync": true,
                                "offset": 0
                            },
                            "l": {
                                "count": 0,
                                "enable": false,
                                "speed": 1,
                                "decay": 0,
                                "delay": 0,
                                "sync": true,
                                "offset": 0
                            }
                        }
                    }
                },
                "zIndex": {
                    "value": 0,
                    "opacityRate": 1,
                    "sizeRate": 1,
                    "velocityRate": 1
                },
                "destroy": {
                    "bounds": {},
                    "mode": "none",
                    "split": {
                        "count": 1,
                        "factor": {
                            "value": 3
                        },
                        "rate": {
                            "value": {
                                "min": 4,
                                "max": 9
                            }
                        },
                        "sizeOffset": true,
                        "particles": {}
                    }
                },
                "roll": {
                    "darken": {
                        "enable": true,
                        "value": 25
                    },
                    "enable": true,
                    "enlighten": {
                        "enable": false,
                        "value": 0
                    },
                    "mode": "vertical",
                    "speed": {
                        "min": 15,
                        "max": 25
                    }
                },
                "tilt": {
                    "value": {
                        "min": 0,
                        "max": 360
                    },
                    "animation": {
                        "enable": true,
                        "speed": 60,
                        "decay": 0,
                        "sync": false
                    },
                    "direction": "random",
                    "enable": true
                },
                "twinkle": {
                    "lines": {
                        "enable": false,
                        "frequency": 0.05,
                        "opacity": 1
                    },
                    "particles": {
                        "enable": false,
                        "frequency": 0.05,
                        "opacity": 1
                    }
                },
                "wobble": {
                    "distance": 30,
                    "enable": true,
                    "speed": {
                        "angle": {
                            "min": -15,
                            "max": 15
                        },
                        "move": 10
                    }
                },
                "life": {
                    "count": 1,
                    "delay": {
                        "value": 0,
                        "sync": false
                    },
                    "duration": {
                        "value": 5,
                        "sync": true
                    }
                },
                "rotate": {
                    "value": {
                        "min": 0,
                        "max": 360
                    },
                    "animation": {
                        "enable": true,
                        "speed": 60,
                        "decay": 0,
                        "sync": false
                    },
                    "direction": "random",
                    "path": false
                },
                "orbit": {
                    "animation": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": false
                    },
                    "enable": false,
                    "opacity": 1,
                    "rotation": {
                        "value": 45
                    },
                    "width": 1
                },
                "links": {
                    "blink": false,
                    "color": {
                        "value": "#fff"
                    },
                    "consent": false,
                    "distance": 100,
                    "enable": false,
                    "frequency": 1,
                    "opacity": 1,
                    "shadow": {
                        "blur": 5,
                        "color": {
                            "value": "#000"
                        },
                        "enable": false
                    },
                    "triangles": {
                        "enable": false,
                        "frequency": 1
                    },
                    "width": 1,
                    "warp": false
                },
                "repulse": {
                    "value": 0,
                    "enabled": false,
                    "distance": 1,
                    "duration": 1,
                    "factor": 1,
                    "speed": 1
                }
            },
            "pauseOnBlur": true,
            "pauseOnOutsideViewport": true,
            "responsive": [],
            "smooth": false,
            "style": {},
            "themes": [],
            "zLayers": 100,
            "emitters": {
                "autoPlay": true,
                "fill": true,
                "life": {
                    "wait": false,
                    "count": 0,
                    "delay": 0.4,
                    "duration": 0.1
                },
                "rate": {
                    "quantity": 150,
                    "delay": 0.1
                },
                "shape": {
                    "options": {},
                    "replace": {
                        "color": false,
                        "opacity": false
                    },
                    "type": "square"
                },
                "startCount": 0,
                "size": {
                    "mode": "percent",
                    "height": 0,
                    "width": 0
                },
                "particles": {}
            },
            "motion": {
                "disable": false,
                "reduce": {
                    "factor": 4,
                    "value": true
                }
            }
        }    });
}

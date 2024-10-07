
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
console.log('numbers', numbers)


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
    labels.push('РЕРОЛЛ')
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
//Start spinning
spinBtn.addEventListener("click", () => {
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
            if (additionalRotation - 5 > 0) {
                additionalRotation -= 5;
            }
            myChart.options.rotation = 0
        } else if (count >= 11 && Math.floor(myChart.options.rotation / 10) == Math.floor(randomDegree / 10)) {
            // valueGenerator(randomDegree);
            spinBtn.disabled = false;
            spinBtn.textContent = 'ПОБЕДИТЕЛЬ ВЫБРАН'

            // setInterval(()=>{
            //     let photos = ['assets/kargi54.png', 'assets/kargin6.png', 'assets/kargin7.png', 'assets/kargin1.png']
            //     let randPhoto = photos[Math.floor(Math.random()*photos.length)];
            //     karginPhoto.setAttribute('src', 'assets/kargin3.png')
            // })
            karginPhoto.setAttribute('src', 'assets/kargin3.png')
            fiftyTwo.style.animationPlayState = 'running'
            clearInterval(rotationInterval);
            count = 0;
            additionalRotation = 51;
            myChart.update()
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

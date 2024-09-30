
const wheel = document.getElementById("wheel");
const spinBtn = document.querySelector(".start_button");
const karginPhoto = document.querySelector(".kargin__photo")

const min = 1;
const max = 30;


const {data, labels, pieColors} = generateData(min, max)

function generateData(from, to) {
    const data = [];
    const labels = [];
    var pieColors = [];
    for (var i = from; i <= to; i++) {
        data.push(16)
        labels.push(i)
        pieColors.push(i % 2 === 0 ? '#CF1200': '#101616')
    }

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
                font: { size: 28 },
            },
        },
    },
});
//display value based on the randomAngle


//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
//Start spinning
spinBtn.addEventListener("click", () => {
    spinBtn.disabled = true;
    spinBtn.textContent = 'СТАВКА СДЕЛАНА'
    karginPhoto.setAttribute("src", "assets/kargin2.png")
    //Generate random degrees to stop at
    let randomDegree =  getRandomDegree()
    //Interval for rotation animation
    let rotationInterval = window.setInterval(() => {
        //Set rotation for piechart
        /*
        Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
        */
        myChart.options.rotation = myChart.options.rotation + resultValue;
        //Update chart with new value;
        myChart.update();
        //If rotation>360 reset it back to 0
        // console.log(count,resultValue)
        if (myChart.options.rotation >= 360) {
            count += 1;
            resultValue -= 5;
            // console.log(count, resultValue, randomDegree, myChart.options.rotation)
            myChart.options.rotation = 0;
        } else if (count >= 15 && myChart.options.rotation == randomDegree) {
            // valueGenerator(randomDegree);
            spinBtn.disabled = false;
            spinBtn.textContent = 'ПОБЕДИТЕЛЬ ВЫБРАН'

            // setInterval(()=>{
            //     let photos = ['assets/kargi54.png', 'assets/kargin6.png', 'assets/kargin7.png', 'assets/kargin1.png']
            //     let randPhoto = photos[Math.floor(Math.random()*photos.length)];
            //     karginPhoto.setAttribute('src', 'assets/kargin3.png')
            // })
            karginPhoto.setAttribute('src', 'assets/kargin3.png')
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;
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
    let randomDegree =  Math.floor(Math.random() * 360) + 1;
    let cellStepDegree = 360 / (max - min + 1); // each cell takes this many degrees
    return (Math.floor(randomDegree / cellStepDegree) + 0.5) * cellStepDegree;
}

function inputHandler(e) {
    let from = fromElement.value
    let to = toElement.value
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

document.querySelector(".start_button_overflow").addEventListener('click', ()=>{
    spinBtn.click();
})

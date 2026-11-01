// stores all point info
let points = [];

// internal names (value) to external names (name)
const regions = [
    { value: "DC", name: "Deep Core" },
    { value: "C", name: "Core" },
    { value: "CO", name: "Colonies" },
    { value: "IR", name: "Inner Rim" },
    { value: "ER", name: "Expansion Region" },
    { value: "MR", name: "Mid Rim" },
    { value: "OR", name: "Outer Rim" },
    { value: "WS", name: "Wild Space" },
    { value: "UR", name: "Unknown Regions" }
];
// values for calculating Base Travel time
const travelTable = {
    DC: {DC:12, C:18, CO:24, IR:48, ER:72, MR:96, OR:120, WS:144, UR:168},
    C:  {DC:24, C:6, CO:24, IR:36, ER:60, MR:84, OR:96, WS:120, UR:144},
    CO: {DC:48, C:24, CO:12, IR:24, ER:48, MR:72, OR:96, WS:120, UR:96},
    IR: {DC:72, C:36, CO:24, IR:18, ER:24, MR:48, OR:72, WS:96, UR:72},
    ER: {DC:96, C:60, CO:48, IR:24, ER:24, MR:24, OR:48, WS:72, UR:96},
    MR: {DC:120, C:84, CO:72, IR:48, ER:24, MR:36, OR:24, WS:48, UR:72},
    OR: {DC:144, C:96, CO:96, IR:72, ER:48, MR:24, OR:48, WS:24, UR:60},
    WS: {DC:168, C:120, CO:120, IR:96, ER:72, MR:48, OR:24, WS:12, UR:120},
    UR: {DC:192, C:144, CO:96, IR:72, ER:60, MR:72, OR:96, WS:120, UR:48}
};


// main add point button
document.getElementById('addPoint').addEventListener('click', () => {
    addPoint()
    displayPointsTable()
    calcDist()
});

// I dont know why this is here
//document.getElementById('')


// Adding point to points list 
function addPoint() {
    let xGrab = Number(document.getElementById('xValue').value);
    let yGrab = Number(document.getElementById('yValue').value);
    let rGrab = document.getElementById('region').value;

    points.push({
        x: xGrab,
        y: yGrab,
        region: rGrab
    });

    console.log(points);
};

// formular for determining time taken to get places
function calcform(p1, p2) {
    let Hyperdrive = Number(document.getElementById('Hyperdrive').value);

    // detects wether the line between points exceds quadrent boundry
    let quadrantBound = (
        Math.sign(p1.x) !== Math.sign(p2.x) ||
        Math.sign(p1.y) !== Math.sign(p2.y))
        ? 1 : 0.5;
    
    // calc for base travel
    function baseTravelTime(p1, p2) {
        let fromR = p1.region;
        let toR = p2.region;
        
        return Number(travelTable[fromR]?.[toR] ?? 0)//*quadrantBound
    }
    // calc the distance between to points, converts to hours
    function distTravelTime(p1, p2) {
        let dX = p2.x - p1.x;
        let dY = p2.y - p1.y;

        return Math.sqrt(dX**2 + dY**2)*24/368;
    }

    return (distTravelTime(p1,p2) + baseTravelTime(p1,p2))*Hyperdrive

    console.log('base travel:' + baseTravelTime(p1,p2));
    console.log('dist travel:' + distTravelTime(p1,p2));
};



// function to gen innerHTML for dropdown
function genRegionSelect(index, currentRegion) {
    return `
        <select onchange="updatePoint(${index}, 'region', this.value)">
            ${regions.map(region => `
                <option value="${region.value}" ${region.value === currentRegion ? 'selected' : ''}>
                    ${region.name}
                </option>
                `).join('')}
        </select>
    `;
}




// display points into a table
function displayPointsTable() {
    let table = document.getElementById("pointTable")
    
    table.innerHTML = "";

    points.forEach((point, index) => {
        table.innerHTML += `
        <tr>
            <td>${index +1}</td>

            <td>
                ${genRegionSelect(index, point.region)}
            </td>

            <td>
                <input value="${point.x}" onchange="updatePoint(${index}, 'x', this.value)">
            </td>

            <td>
                <input value="${point.y}" onchange="updatePoint(${index}, 'y', this.value)">
            </td>

            <td>
                <button onclick="insertPoint(${index})"> Insert After </button>
            </td>

            <td>
                <button onclick="deletePoint(${index})"> Delete </button>
            </td>
        </tr>
        `;
    });
};

// edit existing point
function updatePoint(index, axis, value) {
    if(axis === "region"){
        points[index][axis] = value;
    } else {
        points[index][axis] = Number(value);
    }
    
    displayPointsTable();
    calcDist();
};

function deletePoint(index) {
    points.splice(index, 1);

    displayPointsTable();
    calcDist();
};

function insertPoint(index) {
    points.splice(index +1, 0, {
        region: "DC",
        x: 0,
        y: 0
    });

    displayPointsTable();
    calcDist();
};

// for adding inbertween distances
function displayResults(i, sectDist) {

};

//
function calcDist(params) {
    let results = document.getElementById("results");
    let totalDist = 0;

    results.innerHTML = "";
    // used to show another point needed to work
    if (points.length < 2) {
        results.innerHTML = `
        <p>Add at least 2 points</p>
        `;
        return;
    }
    // loops through each pair of points, calcs distance between and displays andd adds to a total
    for (let i = 0; i < points.length  -1; i++) {
        let p1 = points[i];
        let p2 = points[i+1];
        let sectDist = calcform(p1,p2)
        

        // Adding point to point distancce to total
        totalDist += sectDist;
        
        // html for outputing distence between point to next
        results.innerHTML += `
        <p>
        point ${i + 1} => point ${i + 2}
        = ${sectDist.toFixed(2)}
        </p>
        `;

    };
    // html for total
    results.innerHTML += `
    <h3> Total Dist: ${totalDist.toFixed(2)}</h3>
    `;

    console.log('total dist:' + totalDist);
}


















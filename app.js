/*

are the essential parts for program.
points stors info and is used in *all code
constants regions & travelTable are used to calculate travel time betewwn regions

*/

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

// map image px 1557 x 1491
// internal qwards are x = -1100 to 1300
//                     y = -1400 to 900
const MAP_MIN_X = -1100;
const MAP_MAX_X = 1300;
const MAP_MIN_Y = -1400;
const MAP_MAX_Y = 880;

// deffinitions
// full map is whaen the map is enllared dand interactable
const fullMap = document.getElementById('fullMap');
// thumb is when the map is small
const thumb = document.getElementById('thumbMap');
//lightbox discribes the area behind the full map and is used to exit
const lightBox = document.getElementById('lightBox');


/*
bellow are the only non-functions
seperated between point and map code
*/

// main add point button [point code]
// perpouse is to add position to table from and inputed cordinates and region
document.getElementById('addPoint').addEventListener('click', () => {
    addPoint()
    displayPointsTable()
    calcDist()
    drawMapPoints()
});

// lissens out for change in hyperdive class and updates calcs
document.getElementById('Hyperdrive').addEventListener('input', () => {
    calcDist()
});




thumb.addEventListener('click', () => {
    lightBox.style.display = 'block';
    drawMapPoints();
});
document.getElementById('overlay').addEventListener('click', () => {
    lightBox.style.display = 'none';
});

fullMap.addEventListener('click', getMapPoint);




function getMapPoint(event) {
    const rect = fullMap.getBoundingClientRect();

    const xPixel = event.clientX - rect.left;
    const yPixel = event.clientY - rect.top;

    const xPercent = xPixel / rect.width;
    const yPercent = yPixel / rect.height;

    const xMap = MAP_MIN_X + xPercent * (MAP_MAX_X - MAP_MIN_X);
    const yMap = MAP_MAX_Y - yPercent * (MAP_MAX_Y - MAP_MIN_Y);

    points.push({
// for rescaling ploting position between diff size maps
        xImage: xPercent,
        yImage: yPercent,
// for adding to the table and doing math with
        xMap: xMap,
        yMap: yMap,

        region: document.getElementById('region').value
    });

    displayPointsTable();
    calcDist();
    drawMapPoints();

    console.log(xMap, yMap);
}

// drawing points on both maps
function drawMapPoints() {
    drawMapFullPoints();
    drawMapThumbPoints();

    function drawMapFullPoints() {
        const layer = document.getElementById('fullMarkers');

        layer.innerHTML = "";
        points.forEach(point => {
            const marker = document.createElement('div');
            marker.className = 'marker';
            marker.style.left = (point.xImage * fullMap.clientWidth) + "px";
            marker.style.top = (point.yImage * fullMap.clientHeight) + "px";

            layer.appendChild(marker);
        });
        console.log("point added");
    
    }
    function drawMapThumbPoints() {
        const layer = document.getElementById('thumbMarkers');

        layer.innerHTML = "";
        points.forEach(point => {
            const marker = document.createElement('div');
            marker.className = 'marker';
            marker.style.left = (point.xImage * thumbMap.clientWidth) + "px";
            marker.style.top = (point.yImage * thumbMap.clientHeight) + "px";

            layer.appendChild(marker);
        });
    }
}



// Adding point to points list 
// perpouse to retrive and store possiton 
function addPoint() {
    let xMap = Number(document.getElementById('xValue').value);
    let yMap = Number(document.getElementById('yValue').value);
    let rGrab = document.getElementById('region').value;

    const xPercent = (xMap - MAP_MIN_X) / (MAP_MAX_X - MAP_MIN_X);
    const yPercent = (MAP_MAX_Y - yMap) / (MAP_MAX_Y - MAP_MIN_Y);

    points.push({
        xImage: xPercent,
        yImage: yPercent,
        
        xMap: xMap,
        yMap: yMap,

        region: rGrab
    });

    console.log(points);
};

function convertMapToImage(point) {
    point.xImage = (point.xMap - MAP_MIN_X) / (MAP_MAX_X - MAP_MIN_X);
    point.yImage = (MAP_MAX_Y - point.yMap) / (MAP_MAX_Y - MAP_MIN_Y);
}

// formular for determining time taken to get places
// perpouse is to seperate the math and determin between positon 
function calcform(p1, p2) {
    let Hyperdrive = Number(document.getElementById('Hyperdrive').value);

    // detects wether the line between points exceds quadrent boundry
    let quadrantBound = (
        Math.sign(p1.xMap) !== Math.sign(p2.xMap) ||
        Math.sign(p1.yMap) !== Math.sign(p2.yMap))
        ? 1 : 0.5;
    
    // calc for base travel
    function baseTravelTime(p1, p2) {
        let fromR = p1.region;
        let toR = p2.region;
        
        return Number(travelTable[fromR]?.[toR] ?? 0)//*quadrantBound
    }
    // calc the distance between to points, converts to hours
    function distTravelTime(p1, p2) {
        let dX = p2.xMap - p1.xMap;
        let dY = p2.yMap - p1.yMap;

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
// also adds function bouttons to each row for delleting and innserting points
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
                <input value="${point.xMap}" onchange="updatePoint(${index}, 'xMap', this.value)">
            </td>

            <td>
                <input value="${point.yMap}" onchange="updatePoint(${index}, 'yMap', this.value)">
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
        if(axis === "xMap" || axis === "yMap"){
            convertMapToImage(points[index]);
        }
    }
    
    displayPointsTable();
    calcDist();
    drawMapPoints();
};

// delete a point
function deletePoint(index) {
    points.splice(index, 1);

    displayPointsTable();
    calcDist();
    drawMapPoints();
};

// add a blank point bellow point
function insertPoint(index) {
    let point = {
        region: "DC",
        xMap: 0,
        yMap: 0
    };
    convertMapToImage(point);
    points.splice(index +1, 0, point);

    displayPointsTable();
    calcDist();
    drawMapPoints();
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


















<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nav-Computer</title>
    <link rel="stylesheet" href="main.css">
</head>
<body>
    <div class="layout">
        <div class="mainContent">
            <div class="controlls">
                <p>
                    <label>Hyperdrive Class</label>
                    <input type="number" id="Hyperdrive">
                </p>
                <select id="region">
                    <option value="DC">Deep Core</option>
                    <option value="C">Core</option>
                    <option value="CO">Colonies</option>
                    <option value="IR">Inner Rim</option>
                    <option value="ER">Expansion Region</option>
                    <option value="MR">Mid Rim</option>
                    <option value="OR">Outer Rim</option>
                    <option value="WS">Wild Space</option>
                    <option value="UR">Unknown Regions</option>
                </select>

                <label>X:</label>
                <input type="number" id="xValue">

                <label>Y:</label>
                <input type="number" id="yValue">

                <button id="addPoint">Add Point</button>
            </div>
            <h2>Points</h2>
            <table>
                <thead>
                    <tr>
                        <th>Point</th>
                        <th>Region</th>
                        <th>X</th>
                        <th>Y</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="pointTable"></tbody>
            </table>

            <h2>Results</h2>
            <div id="results"></div>
        </div>

        <div id="thumbWrap">  
            <img id="thumbMap" src="Space Chart 1.jpg" alt="StarChart not loaded">
            <div id="thumbMarkers"></div>
        </div>
    </div>
    <div id="lightBox">
        <div id="overlay"></div>

        <div id="lightBoxContent">
                <img id="fullMap" src="Space Chart 1.jpg" alt="StarChart not loaded">
            <div id="fullMarkers"></div>
        </div>
    </div>


    <h2>Points</h2>
    <table>
        <thead>
            <tr>
                <th>Point</th>
                <th>Region</th>
                <th>X</th>
                <th>Y</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="pointTable"></tbody>
    </table>

    <h2>Results</h2>
    <div id="results"></div>



    <script src="app.js"></script>
</body>
</html>

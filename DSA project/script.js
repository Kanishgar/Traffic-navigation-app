// script.js
let map;
let markers = [];
let paths = [];

const locations = {
    "Coimbatore": { lat: 11.0168, lng: 76.9558 },
    "Erode": { lat: 11.3410, lng: 77.7170 },
    "Tirupattur": { lat: 12.5266, lng: 78.6891 },
    "Salem": { lat: 11.6643, lng: 78.1460 },
    "Trichy": { lat: 10.7905, lng: 78.7045 },
    "Mayiladuthurai": { lat: 11.1271, lng: 79.6494 }
};




// Graph for Dijkstra's Algorithm
const graph = {
    'Coimbatore': { 'Erode': 80, 'Salem': 120 },
    'Erode': { 'Coimbatore': 80, 'Tirupattur': 100, 'Salem': 60 },
    'Tirupattur': { 'Erode': 100, 'Salem': 50, 'Trichy': 150 },
    'Salem': { 'Coimbatore': 120, 'Erode': 60, 'Tirupattur': 50, 'Trichy': 130 },
    'Trichy': { 'Tirupattur': 150, 'Salem': 130, 'Mayiladuthurai': 90 },
    'Mayiladuthurai': { 'Trichy': 90 }
};


// Initialize Map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 12.9716, lng: 77.5946 }, // Centered at Bangalore
        zoom: 6,
    });
}

// Dijkstra’s Algorithm
function dijkstra(graph, start, end) {
    let pq = new PriorityQueue();
    let distances = {};
    let prev = {};

    for (let node in graph) {
        distances[node] = Infinity;
        prev[node] = null;
    }
    distances[start] = 0;
    pq.enqueue([start, 0]);

    while (!pq.isEmpty()) {
        let [currentNode, currentDistance] = pq.dequeue();
        if (currentNode === end) break;

        for (let neighbor in graph[currentNode]) {
            let newDist = currentDistance + graph[currentNode][neighbor];
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                prev[neighbor] = currentNode;
                pq.enqueue([neighbor, newDist]);
            }
        }
    }

    let path = [];
    for (let at = end; at; at = prev[at]) {
        path.push(at);
    }
    path.reverse();

    return { path, distance: distances[end] };
}

// Priority Queue
class PriorityQueue {
    constructor() {
        this.values = [];
    }
    enqueue(val) {
        this.values.push(val);
        this.values.sort((a, b) => a[1] - b[1]);
    }
    dequeue() {
        return this.values.shift();
    }
    isEmpty() {
        return this.values.length === 0;
    }
}

// Find Shortest Path & Display on Map
function findPath() {
    let source = document.getElementById("source").value;
    let destination = document.getElementById("destination").value;

    if (source === destination) {
        document.getElementById("result").innerText = "Source and Destination cannot be the same!";
        return;
    }

    let { path, distance } = dijkstra(graph, source, destination);
    document.getElementById("result").innerText = `Path: ${path.join(" ➝ ")} | Distance: ${distance} km`;

    clearMap();
    drawMarkers(path);
    drawPath(path);
}

// Clear previous markers and paths
function clearMap() {
    markers.forEach(marker => marker.setMap(null));
    paths.forEach(path => path.setMap(null));
    markers = [];
    paths = [];
}

// Draw markers on map
function drawMarkers(path) {
    path.forEach(location => {
        let marker = new google.maps.Marker({
            position: locations[location],
            map: map,
            title: location
        });
        markers.push(marker);
    });
}

// Draw shortest path line
function drawPath(path) {
    let pathCoords = path.map(location => locations[location]);

    let routePath = new google.maps.Polyline({
        path: pathCoords,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 4,
    });

    routePath.setMap(map);
    paths.push(routePath);
}

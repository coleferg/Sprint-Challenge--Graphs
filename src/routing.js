/**
 * Edge class
 */
class Edge {
	constructor(destination, weight=1) {
		this.destination = destination;
		this.weight = weight;
	}
}

/**
 * Vertex class
 */
class Vertex {
	constructor(value='vertex') {
		this.value = value;
		this.edges = [];
	}
}

/**
 * Graph class
 */
class Graph {
	constructor() {
		this.vertexes = [];
	}

	/**
	 * Breadth-First search from a starting vertex
	 */
	bfs(start) {
		for (let i = 0; i < this.vertexes.length; i++) {
			this.vertexes[i].color = 'white'
			this.vertexes[i].parent = null
		}
		let queue = []
		start.color = 'gray'
  
		queue.push(start)
  
		while (queue.length > 0) {
			let u = queue[0]
			if (!u.edges) {
				return
			}
			for (let v = 0; v < u.edges.length; v++) {
				if (u.edges[v].destination.color === 'white') {
					u.edges[v].destination.color = 'gray'
					u.edges[v].destination.parent = u
					queue.push(u.edges[v].destination)
				}
			}
			queue.shift()
			u.color = 'black'
		}
		return 
	}

	/**
	 * Find a vertex by its value
	 * 
	 * Return null if the vertex isn't found
	 */
	findVertex(value) {
		let vertex = null;
		for (let i = 0; i < this.vertexes.length; i++) {
			if (this.vertexes[i].value === value) {
				vertex = this.vertexes[i]
			}
		}
		return vertex
	}

	/**
	 * Print out the route from the start vert back along the parent
	 * pointers (set in the previous BFS)
	 */
	route(start) {
		let current = start;
		let colorCount = 0;
		let color = this.color(colorCount)
		while (current.parent != null) {
			process.stdout.write(`${color}${current.value}${color}-->`)
			current = current.parent
			colorCount++
			color = this.color(colorCount)
		}
		process.stdout.write(`${color}${current.value}${color}\n`)
	}

	color(i) {
		const colors = [
		"\x1b[32m",
		"\x1b[36m",
		"\x1b[34m",
		"\x1b[35m",
		"\x1b[33m"
		]
		return colors[i]
	}
}

/**
 * Helper function to add bidirectional edges
 */
function addEdge(v0, v1) {
	v0.edges.push(new Edge(v1));
	v1.edges.push(new Edge(v0));
}

/**
 * Main
 */

// Test for valid command line
const args = process.argv.slice(2);

if (args.length != 2) {
	console.error('usage: routing hostA hostB');
	process.exit(1);
}

// Build the entire Internet
// (it's only a model)
const graph = new Graph();
const vertA = new Vertex('HostA');
const vertB = new Vertex('HostB');
const vertC = new Vertex('HostC');
const vertD = new Vertex('HostD');
const vertE = new Vertex('HostE');
const vertF = new Vertex('HostF');
const vertG = new Vertex('HostG');
const vertH = new Vertex('HostH');

addEdge(vertA, vertB);
addEdge(vertB, vertD);
addEdge(vertA, vertC);
addEdge(vertC, vertD);
addEdge(vertC, vertF);
addEdge(vertG, vertF);
addEdge(vertE, vertF);
addEdge(vertH, vertF);
addEdge(vertH, vertE);

graph.vertexes.push(vertA);
graph.vertexes.push(vertB);
graph.vertexes.push(vertC);
graph.vertexes.push(vertD);
graph.vertexes.push(vertE);
graph.vertexes.push(vertF);
graph.vertexes.push(vertG);
graph.vertexes.push(vertH);

// Look up the hosts passed on the command line by name to see if we can
// find them.

const hostAVert = graph.findVertex(args[0]);

if (hostAVert === null) {
	console.error('routing: could not find host: ' + args[0]);
	process.exit(2);
}

const hostBVert = graph.findVertex(args[1]);

if (hostBVert === null) {
	console.error('routing: could not find host: ' + args[1]);
	process.exit(2);
}

// Route from one host to another

graph.bfs(hostBVert);
graph.route(hostAVert);

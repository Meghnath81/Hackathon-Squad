let networkInstance = null;
let graphGlobalData = { N: 0, skills: [], adj: [], selectedTeam: [] };

function findBestTeam(N, skills, edges) {
    let adj = Array.from({ length: N + 1 }, () => []);
    for (let edge of edges) {
        adj[edge.from].push(edge.to);
        adj[edge.to].push(edge.from);
    }

    let coders = [];
    for (let i = 1; i <= N; i++) {
        let degree = adj[i].length;
        let score = skills[i - 1] / (degree + 1.5); 
        coders.push({ id: i, skill: skills[i - 1], score: score, degree: degree });
    }

    coders.sort((a, b) => b.score - a.score);

    let blocked = Array(N + 1).fill(false);
    let team = [];
    let totalSkill = 0;

    for (let coder of coders) {
        let u = coder.id;
        if (blocked[u]) continue;

        team.push(u);
        totalSkill += coder.skill;
        blocked[u] = true;

        for (let v of adj[u]) {
            blocked[v] = true;
        }
    }

    return { team, totalSkill, adj };
}

function solveGraph() {
    try {
        const text = document.getElementById("inputData").value.trim();
        if(!text) return;

        const lines = text.split("\n").map(x => x.trim()).filter(x => x.length > 0);
        const firstLine = lines[0].split(/\s+/).map(Number);
        const N = firstLine[0];
        const M = firstLine[1];
        const skills = lines[1].split(/\s+/).map(Number);

        let edges = [];
        for (let i = 2; i < 2 + M; i++) {
            if(!lines[i]) continue;
            let arr = lines[i].split(/\s+/).map(Number);
            if (arr.length >= 2) edges.push({ from: arr[0], to: arr[1] });
        }

        const result = findBestTeam(N, skills, edges);
        const selectedTeam = result.team;

        // Cache parameters into memory variables for our custom search toolings
        graphGlobalData = { N, skills, adj: result.adj, selectedTeam };

        // Calculate Network Structural Density Matrix Factor
        const maxEdges = (N * (N - 1)) / 2;
        const density = maxEdges > 0 ? ((M / maxEdges) * 100).toFixed(2) : "0.00";

        if (N > 2000) {
            document.getElementById("outputPlaceholder").classList.add("hidden");
            document.getElementById("output").classList.remove("hidden");
            document.getElementById("output").innerHTML = `
                <div class="metrics-grid"><div class="metric-card highlight"><div class="metric-label">Peak Engine Output Skill</div><div class="metric-value">★ ${result.totalSkill.toLocaleString()}</div></div></div>
            `;
            return;
        }

        let nodes = [];
        for (let i = 1; i <= N; i++) {
            let isSelected = selectedTeam.includes(i);
            nodes.push({
                id: i,
                label: `Coder ${i}`,
                color: { background: isSelected ? '#10b981' : '#ef4444', border: isSelected ? '#047857' : '#991b1b' },
                font: { color: '#ffffff' },
                shape: "dot",
                size: isSelected ? 25 : 18
            });
        }

        const data = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges.map(e => ({from: e.from, to: e.to, color: '#334155'})))
        };

        const options = {
            interaction: { hover: true, zoomView: true, dragView: true },
            physics: {
                enabled: true,
                barnesHut: { gravitationalConstant: -2000, centralGravity: 0.2, springLength: 100, damping: 0.15 },
                stabilization: { enabled: true, iterations: 600 }
            },
            nodes: { font: { face: 'Inter', size: 12 } }
        };

        const container = document.getElementById("network");
        networkInstance = new vis.Network(container, data, options);

        // NEW ATTACHMENT: Event trigger for selecting node profiles on click
        networkInstance.on("click", function (params) {
            if (params.nodes.length > 0) {
                inspectNode(params.nodes[0]);
            }
        });

        // Update Dashboard Statistics Layout
        const selectionRate = ((selectedTeam.length / N) * 100).toFixed(1);
        document.getElementById("outputPlaceholder").classList.add("hidden");
        
        const outputDiv = document.getElementById("output");
        outputDiv.classList.remove("hidden");
        outputDiv.innerHTML = `
            <div class="metrics-grid">
                <div class="metric-card highlight">
                    <div class="metric-label">Engine Total Skill Rating Peak</div>
                    <div class="metric-value" style="color: #10b981;">★ ${result.totalSkill.toLocaleString()}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Selected Roster Size</div>
                    <div class="metric-value">${selectedTeam.length} <span style="font-size:0.85rem; color:var(--text-muted)">/ ${N}</span></div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Graph Structural Density</div>
                    <div class="metric-value">${density}%</div>
                </div>
            </div>
            <div style="margin-top: 14px;">
                <div class="metric-label" style="margin-bottom:4px;">Optimized Squad Roster</div>
                <div class="team-list-box">${selectedTeam.join(", ")}</div>
            </div>
        `;

    } catch (err) {
        console.error(err);
    }
}

// NEW CORE METHOD: Element profile structural readout logic
function inspectNode(nodeId) {
    if (!graphGlobalData.N) return;
    
    const id = parseInt(nodeId);
    const skill = graphGlobalData.skills[id - 1];
    const connections = graphGlobalData.adj[id] || [];
    const degree = connections.length;
    const score = (skill / (degree + 1.5)).toFixed(2);
    const isSelected = graphGlobalData.selectedTeam.includes(id);

    document.getElementById("inspectorDefault").classList.add("hidden");
    const content = document.getElementById("inspectorContent");
    content.classList.remove("hidden");
    
    content.innerHTML = `
        <div class="inspector-card">
            <div class="inspector-row"><span>Coder Index:</span><strong style="color:#38bdf8;"># ${id}</strong></div>
            <div class="inspector-row"><span>Roster Status:</span><span class="badge ${isSelected ? 'in' : 'out'}">${isSelected ? 'ACCEPTED' : 'EXCLUDED'}</span></div>
            <div class="inspector-row"><span>Base Skill Score:</span><strong>★ ${skill}</strong></div>
            <div class="inspector-row"><span>Direct Rivalries:</span><strong>${degree}</strong></div>
            <div class="inspector-row"><span>Heuristic Value:</span><strong style="color:#a78bfa;">${score}</strong></div>
            <div class="inspector-row" style="flex-direction:column; gap:6px; border-bottom:none; margin-top:10px;">
                <span style="font-size:0.8rem; color:var(--text-muted);">Direct Conflict Nodes:</span>
                <div style="font-family:var(--font-mono); font-size:0.85rem; background:#040711; padding:6px; border-radius:4px; max-height:60px; overflow-y:auto;">
                    ${degree > 0 ? connections.sort((a,b)=>a-b).join(", ") : 'None (Isolated Element)'}
                </div>
            </div>
        </div>
    `;
}

// NEW CORE METHOD: Camera interpolation search handler
function searchNode() {
    const val = parseInt(document.getElementById("nodeSearchInput").value);
    if (!networkInstance || isNaN(val) || val < 1 || val > graphGlobalData.N) {
        alert("Please specify a valid operational Coder ID currently within graph limits.");
        return;
    }

    // Trigger profile layout changes simultaneously
    inspectNode(val);
    networkInstance.selectNodes([val]);

    // Animate camera focusing right onto selected element path
    networkInstance.focus(val, {
        scale: 1.25,
        animation: { duration: 400, easingFunction: 'easeInOutQuad' }
    });
}
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Coder {
    int id;
    long long skill;
    int degree;
    double score;
};

int main() {
    // Ultra-high-speed I/O optimization for massive contest inputs
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, M;
    if (!(cin >> N >> M)) return 0;

    vector<long long> skill(N + 1);
    for (int i = 1; i <= N; i++) {
        cin >> skill[i];
    }

    vector<vector<int>> adj(N + 1);
    for (int i = 0; i < M; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<Coder> coders;
    coders.reserve(N);
    for (int i = 1; i <= N; i++) {
        int deg = adj[i].size();
        // Fine-tuned Scaling Heuristic to penalize hyper-connected nodes
        double heuristic = (double)skill[i] / (deg + 1.5); 
        coders.push_back({i, skill[i], deg, heuristic});
    }

    // Sort descending by score. On tie-breakers, favor the lower degree node.
    sort(coders.begin(), coders.end(), [](const Coder &a, const Coder &b) {
        if (a.score != b.score) return a.score > b.score;
        return a.degree < b.degree; 
    });

    vector<bool> blocked(N + 1, false);
    vector<int> team;
    long long totalSkill = 0;

    // Fast Independent Set Evaluation Pass
    for (const auto &coder : coders) {
        int node = coder.id;
        if (blocked[node]) continue;

        team.push_back(node);
        totalSkill += coder.skill;
        blocked[node] = true;
        for (int neighbor : adj[node]) {
            blocked[neighbor] = true;
        }
    }

    // Sort team indices in ascending numerical order to match contest standard
    sort(team.begin(), team.end());

    // Strict Submission Format (Line 1: Score, Line 2: Elements)
    cout << totalSkill << "\n";
    for (size_t i = 0; i < team.size(); i++) {
        cout << team[i] << (i + 1 == team.size() ? "" : " ");
    }
    cout << "\n";

    return 0;
}
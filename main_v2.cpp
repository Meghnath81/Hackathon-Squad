#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// ----------------------------
// Coder Structure
// ----------------------------
struct Coder
{
    int id;
    long long skill;
    double score;
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // ----------------------------
    // Input
    // ----------------------------
    int N, M;
    cin >> N >> M;

    vector<long long> skill(N + 1);

    for (int i = 1; i <= N; i++)
    {
        cin >> skill[i];
    }

    // ----------------------------
    // Graph
    // ----------------------------
    vector<vector<int>> adj(N + 1);

    for (int i = 0; i < M; i++)
    {
        int u, v;
        cin >> u >> v;

        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    // ----------------------------
    // Heuristic Calculation
    // score = skill - 5 * degree
    // ----------------------------
    vector<Coder> coders;

    for (int i = 1; i <= N; i++)
    {
        int degree = adj[i].size();

        double heuristic =
            skill[i] - (5.0 * degree);

        coders.push_back(
        {
            i,
            skill[i],
            heuristic
        });
    }

    // ----------------------------
    // Sort Descending
    // ----------------------------
    sort(
        coders.begin(),
        coders.end(),
        [](const Coder &a, const Coder &b)
        {
            return a.score > b.score;
        });

    // ----------------------------
    // Greedy Selection
    // ----------------------------
    vector<bool> blocked(N + 1, false);

    vector<int> team;

    long long totalSkill = 0;

    for (auto &coder : coders)
    {
        int node = coder.id;

        if (blocked[node])
            continue;

        team.push_back(node);

        totalSkill += skill[node];

        blocked[node] = true;

        for (int neighbor : adj[node])
        {
            blocked[neighbor] = true;
        }
    }

    // ----------------------------
    // Sort Team
    // ----------------------------
    sort(team.begin(), team.end());

    // ----------------------------
    // Output
    // ----------------------------
    cout << "\n===== RESULT V2 =====\n";

    cout << "Total Skill = "
         << totalSkill << "\n";

    cout << "Selected Team:\n";

    for (int member : team)
    {
        cout << member << " ";
    }

    cout << "\n";

    return 0;
}
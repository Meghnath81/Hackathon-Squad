#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// ----------------------------------
// Structure for each coder
// ----------------------------------
struct Coder
{
    int id;
    long long skill;
    double score;
};

// ----------------------------------
// Main Function
// ----------------------------------
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // -------------------------------
    // Input Number of Coders and Conflicts
    // -------------------------------
    int N, M;
    cin >> N >> M;

    // -------------------------------
    // Input Skills
    // -------------------------------
    vector<long long> skill(N + 1);

    for (int i = 1; i <= N; i++)
    {
        cin >> skill[i];
    }

    // -------------------------------
    // Build Graph
    // -------------------------------
    vector<vector<int>> adj(N + 1);

    for (int i = 0; i < M; i++)
    {
        int u, v;
        cin >> u >> v;

        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    // -------------------------------
    // Calculate Heuristic Score
    // score = skill / (degree + 1)
    // -------------------------------
    vector<Coder> coders;

    for (int i = 1; i <= N; i++)
    {
        int degree = adj[i].size();

        double heuristic =
            (double)skill[i] / (degree + 1);

        coders.push_back(
        {
            i,
            skill[i],
            heuristic
        });
    }

    // -------------------------------
    // Sort Descending by Score
    // -------------------------------
    sort(
        coders.begin(),
        coders.end(),
        [](const Coder &a, const Coder &b)
        {
            return a.score > b.score;
        });

    // -------------------------------
    // Greedy Selection
    // -------------------------------
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

    // -------------------------------
    // Sort Team Members
    // -------------------------------
    sort(team.begin(), team.end());

    // -------------------------------
    // Output Result
    // -------------------------------
    cout << "\n===== RESULT =====\n";

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
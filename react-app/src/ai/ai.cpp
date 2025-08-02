#include <vector>
#include <map>
#include <set>
#include <algorithm>
#include <random>
#include <chrono>
#include <iostream>
#include <string>
using namespace std;

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());

struct Segment {
    int start, len;
};

vector<Segment> getSegments(vector<bool>& sticks) {
    vector<Segment> segments;
    int n = sticks.size();
    int i = 0;
    while (i < n) {
        if (sticks[i]) {
            int start = i;
            while (i < n && sticks[i])
                ++i;
            segments.push_back({ start, i - start });
        }
        else
            ++i;
    }
    return segments;
}

int getMex(set<int>& s) {
    int mex = 0;
    for (auto i = s.begin(); i != s.end(); ++i) {
        if (*i != mex) {
            return mex;
        }
        ++mex;
    }
    return mex;
}

vector<int> getMoveAny(vector<bool>& sticks, int a, int b) {
    int len = sticks.size();
    int n = count(sticks.begin(), sticks.end(), true);

    vector<bool> dp(n + 1, false);
    vector<double> loseMovePercentage(n + 1, 0);
    vector<vector<int>> bestMove(n + 1);

    for (int i = 1; i <= n; ++i) {
        for (int j = a; (j <= b) && (i - j >= 0); ++j) {
            if (!dp[i - j]) {
                dp[i] = true;
                ++loseMovePercentage[i];
                bestMove[i].push_back(i - j);
            }
        }
        int possibleMoves = max(0, min(b, i) - a + 1);
        if (possibleMoves > 0)
            loseMovePercentage[i] /= possibleMoves;
    }

    int newN;
    if (bestMove[n].empty()) {
        newN = n - a;
        for (int i = a + 1; i <= b; ++i) {
            if (loseMovePercentage[newN] > loseMovePercentage[n - i])
                newN = n - i;
        }
    }
    else
        newN = bestMove[n][uniform_int_distribution<int>(0, bestMove[n].size() - 1)(rnd)];

    int toRemove = n - newN;
    vector<int> activeIndices;
    activeIndices.reserve(toRemove);
    for (int i = 0; i < len; ++i) {
        if (sticks[i])
            activeIndices.push_back(i);
    }
    shuffle(activeIndices.begin(), activeIndices.end(), rnd);
    vector<int> ans;
    ans.insert(ans.end(), activeIndices.begin(), activeIndices.begin() + toRemove);
    return ans;
}

vector<int> getMoveConsecutive(vector<bool>& sticks, int a, int b) {
    int len = sticks.size();
    int n = count(sticks.begin(), sticks.end(), true);

    vector<int> grundy(n + 1, 0);
    for (int i = 1; i <= n; ++i) {
        set<int> transitions;
        for (int j = a; (j <= b) && (i - j >= 0); ++j) {
            for (int pos = 0; pos + j <= i; ++pos) {
                int left = pos, right = i - pos - j;
                transitions.insert(grundy[left] ^ grundy[right]);
            }
        }
        grundy[i] = getMex(transitions);
    }

    int total = 0;
    vector<Segment> segments = getSegments(sticks);
    for (auto& seg : segments)
        total ^= grundy[seg.len];
    vector<vector<int>> bestMoves;
    for (auto& seg : segments) {
        int maxN = min(b, seg.len);
        if (a > maxN) continue;

        for (int j = a; j <= maxN; ++j) {
            for (int pos = 0; pos + j <= seg.len; ++pos) {
                int left = pos, right = seg.len - j - pos;
                if ((total ^ grundy[left] ^ grundy[right] ^ grundy[seg.len]) == 0) {
                    bestMoves.push_back({});
                    for (int i = 0; i < j; ++i)
                        bestMoves[bestMoves.size() - 1].push_back(seg.start + pos + i);
                }
            }
        }
    }

    if (!bestMoves.empty())
        return bestMoves[uniform_int_distribution<int>(0, bestMoves.size() - 1)(rnd)];

    vector<vector<int>> allMoves;
    for (auto& seg : segments) {
        int maxN = min(b, seg.len);
        for (int j = a; j <= maxN; ++j) {
            for (int pos = 0; pos + j <= seg.len; ++pos) {
                allMoves.push_back({});
                allMoves.back().reserve(j);
                for (int k = 0; k < j; ++k)
                    allMoves.back().push_back(seg.start + pos + k);
            }
        }
    }
    if (!allMoves.empty())
        return allMoves[uniform_int_distribution<int>(0, allMoves.size() - 1)(rnd)];
    return {};
}

static map<string, int> mem;
string vecToKey(const vector<int>& v) {
    string s;
    for (size_t i = 0; i < v.size(); ++i) {
        if (i) s += ',';
        s += to_string(v[i]);
    }
    return s;
}

int getGrundySpecial(vector<int> lens) {
    sort(lens.begin(), lens.end());
    string key = vecToKey(lens);
    int n = lens.size();
    if (mem.count(key)) return mem[key];
    if (n == 0) return mem[key] = 0;
    set<vector<int>> transitions;

    //1 stick
    for (int i = 0; i < n; ++i) {
        int len = lens[i];
        for (int pos = 0; pos < len; ++pos) {
            vector<int> trans = lens;
            trans.erase(trans.begin() + i);

            int left = pos, right = len - pos - 1;
            if (left != 0) trans.push_back(left);
            if (right != 0) trans.push_back(right);

            sort(trans.begin(), trans.end());
            transitions.insert(trans);
        }
    }

    //2 sticks in single segment
    for (int i = 0; i < n; ++i) {
        int len = lens[i];
        if (len < 2) continue;
        for (int pos1 = 0; pos1 < len; ++pos1) {
            for (int pos2 = pos1 + 1; pos2 < len; ++pos2) {
                vector<int> trans = lens;
                trans.erase(trans.begin() + i);

                int a = pos1;
                int b = pos2 - pos1 - 1;
                int c = len - pos2 - 1;
                if (a) trans.push_back(a);
                if (b) trans.push_back(b);
                if (c) trans.push_back(c);

                sort(trans.begin(), trans.end());
                transitions.insert(trans);
            }
        }
    }

    //2 sticks in different segment
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            int len1 = lens[i], len2 = lens[j];
            for (int pos1 = 0; pos1 < len1; ++pos1) {
                for (int pos2 = 0; pos2 < len2; ++pos2) {
                    vector<int> trans = lens;
                    trans.erase(trans.begin() + j);
                    trans.erase(trans.begin() + i);

                    int left1 = pos1, right1 = len1 - pos1 - 1;
                    int left2 = pos2, right2 = len2 - pos2 - 1;
                    if (left1) trans.push_back(left1);
                    if (right1) trans.push_back(right1);
                    if (left2) trans.push_back(left2);
                    if (right2) trans.push_back(right2);

                    sort(trans.begin(), trans.end());
                    transitions.insert(trans);
                }
            }
        }
    }

    //3 sticks
    for (int i = 0; i < n; ++i) {
        int len = lens[i];
        if (len < 3) continue;
        for (int pos = 0; pos <= len - 3; ++pos) {
            vector<int> trans = lens;
            trans.erase(trans.begin() + i);

            int left = pos, right = len - pos - 3;
            if (left != 0) trans.push_back(left);
            if (right != 0) trans.push_back(right);

            sort(trans.begin(), trans.end());
            transitions.insert(trans);
        }
    }

    set<int> grundySet;
    for (auto& v : transitions)
        grundySet.insert(getGrundySpecial(v));
    return mem[key] = getMex(grundySet);
}

vector<int> getMoveSpecial(vector<bool>& sticks) {
    vector<Segment> segments = getSegments(sticks);
    int n = segments.size();
    vector<int> lens;
    lens.reserve(n);
    for (auto& seg : segments) lens.push_back(seg.len);
    vector<vector<int>> bestMoves;

    //1 stick
    for (int i = 0; i < n; ++i) {
        int start = segments[i].start;
        int len = segments[i].len;
        for (int pos = 0; pos < len; ++pos) {
            vector<int> trans = lens;
            trans.erase(trans.begin() + i);

            int left = pos, right = len - pos - 1;
            if (left) trans.push_back(left);
            if (right) trans.push_back(right);

            if (getGrundySpecial(trans) == 0) bestMoves.push_back({ start + pos });
        }
    }

    //2 sticks in single segment
    for (int i = 0; i < n; ++i) {
        int start = segments[i].start;
        int len = segments[i].len;
        if (len < 2) continue;
        for (int pos1 = 0; pos1 < len; ++pos1) {
            for (int pos2 = pos1 + 1; pos2 < len; ++pos2) {
                vector<int> trans = lens;
                trans.erase(trans.begin() + i);

                int a = pos1;
                int b = pos2 - pos1 - 1;
                int c = len - pos2 - 1;
                if (a) trans.push_back(a);
                if (b) trans.push_back(b);
                if (c) trans.push_back(c);

                if (getGrundySpecial(trans) == 0)
                    bestMoves.push_back({ start + pos1, start + pos2 });
            }
        }
    }

    //2 sticks in different segments
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            int start1 = segments[i].start;
            int len1 = segments[i].len;
            int start2 = segments[j].start;
            int len2 = segments[j].len;
            for (int pos1 = 0; pos1 < len1; ++pos1) {
                for (int pos2 = 0; pos2 < len2; ++pos2) {
                    vector<int> trans = lens;
                    trans.erase(trans.begin() + j);
                    trans.erase(trans.begin() + i);

                    int left1 = pos1, right1 = len1 - pos1 - 1;
                    int left2 = pos2, right2 = len2 - pos2 - 1;
                    if (left1) trans.push_back(left1);
                    if (right1) trans.push_back(right1);
                    if (left2) trans.push_back(left2);
                    if (right2) trans.push_back(right2);

                    if (getGrundySpecial(trans) == 0)
                        bestMoves.push_back({ start1 + pos1, start2 + pos2 });
                }
            }
        }
    }

    //3 sticks
    for (int i = 0; i < n; ++i) {
        int start = segments[i].start;
        int len = segments[i].len;
        if (len < 3) continue;
        for (int pos = 0; pos <= len - 3; ++pos) {
            vector<int> trans = lens;
            trans.erase(trans.begin() + i);

            int left = pos;
            int right = len - pos - 3;
            if (left) trans.push_back(left);
            if (right) trans.push_back(right);

            if (getGrundySpecial(trans) == 0)
                bestMoves.push_back({ start + pos, start + pos + 1, start + pos + 2 });
        }
    }
    if (!bestMoves.empty())
        return bestMoves[uniform_int_distribution<int>(0, bestMoves.size() - 1)(rnd)];
    
    vector<std::vector<int>> allMoves;
    // 1 stick
    for (int i = 0; i < n; ++i) {
        int start = segments[i].start;
        int len = segments[i].len;
        for (int pos = 0; pos < len; ++pos)
            allMoves.push_back({ start + pos });
    }
    // 2 sticks in single segment
    for (int i = 0; i < n; ++i) {
        int start = segments[i].start;
        int len = segments[i].len;
        if (len < 2) continue;
        for (int pos1 = 0; pos1 < len; ++pos1)
            for (int pos2 = pos1 + 1; pos2 < len; ++pos2)
                allMoves.push_back({ start + pos1, start + pos2 });
    }
    // 2 sticks in different
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            int start1 = segments[i].start;
            int len1 = segments[i].len;
            int start2 = segments[j].start;
            int len2 = segments[j].len;
            for (int pos1 = 0; pos1 < len1; ++pos1)
                for (int pos2 = 0; pos2 < len2; ++pos2)
                    allMoves.push_back({ start1 + pos1, start2 + pos2 });
        }
    }
    // 3 consecutive
    for (int i = 0; i < n; ++i) {
        int start = segments[i].start;
        int len = segments[i].len;
        if (len < 3) continue;
        for (int pos = 0; pos <= len - 3; ++pos)
            allMoves.push_back({ start + pos, start + pos + 1, start + pos + 2 });
    }
    if (!allMoves.empty())
        return allMoves[uniform_int_distribution<int>(0, allMoves.size() - 1)(rnd)];
    return {};
}

vector<int> getOptimalMove(int mode, vector<bool>& sticks, int a = 0, int b = 0, int k = 0) {
    switch (mode) {
    case 1: return getMoveAny(sticks, 1, k);
    case 2: return getMoveAny(sticks, a, b);
    case 3: return getMoveConsecutive(sticks, 1, k);
    case 4: return getMoveConsecutive(sticks, a, b);
    case 5: return getMoveSpecial(sticks);
    default: return {};
    }
}
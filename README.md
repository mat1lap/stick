# Stick

Проект собран на **Electron** и **React**.  
Доступен по ссылке:
https://mat1lap.github.io/stick/

Чтобы собрать проект или развепнуть в браузере Вам понадобится Node.js и Git.

Если хотите собрать проект:
1. Откройте git bash
2. Перейдите в папку `electron-app` и установите `@electron-forge/cli`:
   ```bash
   npm install @electron-forge/cli
   ```
3. Соберите проект:
   ```bash
   npm run make
   ```
4. Итоговый исполняемый файл окажется в electron-app/out/electron-app-win32-x64/electron-app.exe

Если хотите развернуть проект в браузере:
1. Установите `react-router-dom`:
   ```bash
   npm install react-router-dom
   ```
2. Перейдите в папку `react-app` и запустите:
   ```bash
   npm run start
   ```
3. После этого проект будет доступен по адресу [http://localhost:3000](http://localhost:3000) (по умолчанию).

---

## Функционал

1. Все режимы с оптимальными стратегиями для каждого.
2. Вкладка "Как играть" с правилами и советами по игре.
3. Возможность отображения подсказок (оптимального хода).
4. Возможность отката позиции.
5. Визуальное отображение возможности/невозможности хода.

---

## Стратегии для режимов

### Режим 1–2

Режим 1 — частный случай второго, когда `a = 1`. Поэтому рассмотрим их вместе:

```cpp
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
        int minPercentage = n - a;
        for (int i = a + 1; i <= b; ++i) {
            if (loseMovePercentage[minPercentage] > loseMovePercentage[n - i])
                minPercentage = n - i;
        }
        newN = minPercentage;
    } else {
        newN = bestMove[n][uniform_int_distribution<int>(0, bestMove[n].size() - 1)(rnd)];
    }

    vector<int> ans;
    for (int i = 0; i < len && ans.size() < n - newN; ++i) {
        if (sticks[i])
            ans.push_back(i);
    }
    return ans;
}
```

Алгоритм:

- Используется массив `dp`, где `dp[i] = true`, если при `i` палочках игрок может выиграть.
- Если `dp[i - j] == false` для какого-то `j` от `a` до `b`, то `dp[i] = true`.
- Изначально `dp[0] = false`.
- Выигрышный ход — перейти из состояния `dp[n] = true` в `dp[newN] = false`.

---

### Режим 3–4

Режим 3 — частный случай четвёртого при `a = 1`.

```cpp
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
                        bestMoves.back().push_back(seg.start + pos + i);
                }
            }
        }
    }

    if (!bestMoves.empty())
        return bestMoves[uniform_int_distribution<int>(0, bestMoves.size() - 1)(rnd)];
    else {
        for (auto& seg : segments) {
            if (seg.len >= a) {
                vector<int> move;
                for (int i = 0; i < a; ++i)
                    move.push_back(seg.start + i);
                return move;
            }
        }
    }
    return {};
}
```

Так как наша игра равноправна, т.е. выигрышность/проигрышность зависят только от состояния игры, то можем применить **Теорему Шпрага-Гранди**, а также **функцию Шпрага-Гранди**:
1. Определяются все возможные переходы.
2. Если ход разбивает игру на несколько независимых — применяется XOR.
3. Вычисляется **mex** от всех переходов.
4. Если число Шпрага-Гранди равно 0 — проигрыш, иначе — выигрыш.

Собственно это и происходит в коде. При взятии какого-то отрезка палочек, мы разбиваем наш текущий отрезок палочек на 2 подотрезка, т.е. на 2 независимые игры. Поэтому пытаемся взять отрезок так, чтобы итоговый xor оказался равен 0. Это и будет оптимальный ход.

---

### Режим 5
- В этом режиме возможны более сложные разбиения, и требуется **рекурсивный** подсчёт чисел Шпрага-Гранди.
- Для ускорения используется **меморизация**: предварительно можно сохранить вычисленные значения в файл.
- Размер файла не слишком велик т.к. всего нужно вычислить около 20000 различных позиций, что нормально по памяти

Код:

- Без меморизации: `react-app/src/ai/ai.cpp`
- С меморизацией: `react-app/src/ai/ai.js`
